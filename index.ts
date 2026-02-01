import { Hono } from "hono";
import { cors } from "hono/cors";
import { GoogleGenAI } from "@google/genai";
import { menuContext } from "../data/menu";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const reservationSchema = z.object({
  guest_name: z.string().min(2),
  guest_email: z.string().email().optional(),
  guest_phone: z.string().optional(),
  reservation_date: z.string(),
  reservation_time: z.string(),
  party_size: z.number().min(1).max(8),
  special_requests: z.string().optional()
});

// Schema for AI to extract reservation details
const extractionSchema = {
  type: "object",
  properties: {
    has_complete_reservation: { type: "boolean" },
    reservation_details: {
      type: "object",
      properties: {
        guest_name: { type: "string" },
        guest_email: { type: "string" },
        guest_phone: { type: "string" },
        reservation_date: { type: "string" },
        reservation_time: { type: "string" },
        party_size: { type: "number" },
        special_requests: { type: "string" }
      }
    }
  },
  required: ["has_complete_reservation"]
};

app.post("/api/chat", async (c) => {
  try {
    const { message, history } = await c.req.json<{
      message: string;
      history: ChatMessage[];
    }>();

    const apiKey = c.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return c.json({ 
        response: "I apologize, but the AI service is not configured yet. Please add your Gemini API key in the app settings." 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // First, try to extract reservation details using structured output
    const extractionPrompt = `Analyze this conversation and determine if the customer has provided all required information for a restaurant reservation.

Required information:
- guest_name: Customer's full name
- reservation_date: Date in YYYY-MM-DD format
- reservation_time: Time in HH:MM 24-hour format (must be between 17:00 and 21:00)
- party_size: Number of guests (1-8)
- At least one of: guest_email OR guest_phone

Optional:
- special_requests: Any special needs or requests

Set has_complete_reservation to true ONLY if ALL required fields are present and valid. Extract all available details into reservation_details.

Conversation:
${history.slice(1).map(msg => `${msg.role}: ${msg.content}`).join('\n')}
${message ? `user: ${message}` : ''}`;

    const extractionResult = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: extractionPrompt,
      config: {
        responseSchema: extractionSchema,
        responseMimeType: "application/json"
      }
    });

    const extractionText = extractionResult.text || '{"has_complete_reservation": false}';
    const extraction = JSON.parse(extractionText);

    // If we have complete reservation info, create it
    let reservationId: number | null = null;
    if (extraction.has_complete_reservation && extraction.reservation_details) {
      const details = extraction.reservation_details;
      
      // Ensure required fields exist
      if (details.guest_name && details.reservation_date && details.reservation_time && details.party_size) {
        try {
          const result = await c.env.DB.prepare(
            `INSERT INTO reservations (guest_name, guest_email, guest_phone, reservation_date, reservation_time, party_size, special_requests, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`
          ).bind(
            details.guest_name,
            details.guest_email || null,
            details.guest_phone || null,
            details.reservation_date,
            details.reservation_time,
            details.party_size,
            details.special_requests || null
          ).run();
        
          reservationId = result.meta.last_row_id as number;
        } catch (error) {
          console.error("Failed to create reservation:", error);
        }
      }
    }

    // Now generate the conversational response
    const chatHistory = history.slice(1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const systemPrompt = `You are a helpful AI assistant for Savor & Spice restaurant. Your role is to:
1. Answer questions about the menu and help customers choose dishes
2. Help customers make reservations by collecting: name, date, time, party size, phone/email
3. Provide information about hours, location, and dietary options
4. Be warm, professional, and enthusiastic about the food

${menuContext}

Restaurant Information:
- Hours: 5:00 PM - 9:00 PM Daily
- Accepts reservations for 1-8 guests
- Location: 123 Culinary Lane, Downtown

When helping with reservations:
- Collect: name, date, time, party size, and contact (email or phone)
- Confirm availability for requested time
- Be encouraging and enthusiastic when confirming bookings
${reservationId ? `\n\nIMPORTANT: A reservation was just created with ID #${reservationId}. Congratulate the customer and provide the confirmation details in a warm, professional manner. Include the reservation ID number.` : ''}

Keep responses concise and conversational. Focus on being helpful and creating a great dining experience.`;

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I am the AI assistant for Savor & Spice restaurant.' }]
        },
        ...chatHistory
      ]
    });

    const response = await chat.sendMessage({ message });

    return c.json({ 
      response: response.text,
      reservation_created: !!reservationId,
      reservation_id: reservationId
    });
  } catch (error) {
    console.error("Chat error:", error);
    return c.json({ 
      response: "I apologize, but I'm having trouble processing your request. Please try again." 
    }, 500);
  }
});

app.post("/api/reservations", zValidator("json", reservationSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    
    const result = await c.env.DB.prepare(
      `INSERT INTO reservations (guest_name, guest_email, guest_phone, reservation_date, reservation_time, party_size, special_requests, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`
    ).bind(
      data.guest_name,
      data.guest_email || null,
      data.guest_phone || null,
      data.reservation_date,
      data.reservation_time,
      data.party_size,
      data.special_requests || null
    ).run();

    return c.json({ 
      success: true, 
      id: result.meta.last_row_id,
      message: "Reservation confirmed!"
    });
  } catch (error) {
    console.error("Reservation error:", error);
    return c.json({ success: false, message: "Failed to create reservation" }, 500);
  }
});

app.get("/api/reservations", async (c) => {
  try {
    const email = c.req.query("email");
    
    let query = "SELECT * FROM reservations WHERE 1=1";
    const params: any[] = [];
    
    if (email) {
      query += " AND guest_email = ?";
      params.push(email);
    }
    
    query += " ORDER BY reservation_date DESC, reservation_time DESC LIMIT 50";
    
    const result = await c.env.DB.prepare(query).bind(...params).all();
    
    return c.json({ reservations: result.results || [] });
  } catch (error) {
    console.error("Fetch reservations error:", error);
    return c.json({ reservations: [] }, 500);
  }
});

app.get("/api/availability", async (c) => {
  try {
    const date = c.req.query("date");
    
    if (!date) {
      return c.json({ available: true, slots: [] });
    }
    
    // Get existing reservations for the date
    const result = await c.env.DB.prepare(
      "SELECT reservation_time, SUM(party_size) as total_guests FROM reservations WHERE reservation_date = ? GROUP BY reservation_time"
    ).bind(date).all();
    
    const bookedSlots = new Map(
      (result.results || []).map((r: any) => [r.reservation_time, r.total_guests])
    );
    
    // Generate available time slots (5:00 PM - 9:00 PM, 30-min intervals)
    const slots = [];
    const maxCapacity = 40; // Restaurant capacity
    
    for (let hour = 17; hour <= 21; hour++) {
      for (let min of [0, 30]) {
        if (hour === 21 && min === 30) break; // Stop at 9:00 PM
        
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const booked = bookedSlots.get(time) || 0;
        const available = maxCapacity - booked;
        
        slots.push({
          time,
          available,
          isAvailable: available > 0
        });
      }
    }
    
    return c.json({ available: true, slots });
  } catch (error) {
    console.error("Availability error:", error);
    return c.json({ available: true, slots: [] }, 500);
  }
});

export default app;
