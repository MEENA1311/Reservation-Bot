// Restaurant menu data - compressed for efficient AI token usage
export const restaurantInfo = {
  name: "Savor & Spice",
  cuisine: "Modern American",
  description: "Contemporary dining with locally-sourced ingredients",
  hours: {
    monday: "5:00 PM - 10:00 PM",
    tuesday: "5:00 PM - 10:00 PM",
    wednesday: "5:00 PM - 10:00 PM",
    thursday: "5:00 PM - 10:00 PM",
    friday: "5:00 PM - 11:00 PM",
    saturday: "4:00 PM - 11:00 PM",
    sunday: "4:00 PM - 9:00 PM"
  }
};

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  dietary?: string[];
  popular?: boolean;
}

export const menuItems: MenuItem[] = [
  // Appetizers
  { id: "a1", name: "Crispy Calamari", category: "Appetizers", price: 14, description: "Lemon aioli, marinara", dietary: [], popular: true },
  { id: "a2", name: "Burrata & Heirloom Tomatoes", category: "Appetizers", price: 16, description: "Basil, aged balsamic", dietary: ["vegetarian"] },
  { id: "a3", name: "Tuna Tartare", category: "Appetizers", price: 18, description: "Avocado, crispy wontons", dietary: [] },
  { id: "a4", name: "Wild Mushroom Soup", category: "Appetizers", price: 12, description: "Truffle oil, herbs", dietary: ["vegan"] },
  { id: "a5", name: "Beef Carpaccio", category: "Appetizers", price: 17, description: "Arugula, parmesan, truffle oil", dietary: [] },
  { id: "a6", name: "Grilled Octopus", category: "Appetizers", price: 19, description: "Chorizo, potatoes, paprika oil", dietary: [] },
  
  // Salads
  { id: "s1", name: "Caesar Salad", category: "Salads", price: 13, description: "Romaine, parmesan, garlic croutons", dietary: ["vegetarian"] },
  { id: "s2", name: "Harvest Salad", category: "Salads", price: 14, description: "Mixed greens, apple, candied walnuts, goat cheese", dietary: ["vegetarian"], popular: true },
  { id: "s3", name: "Greek Salad", category: "Salads", price: 12, description: "Cucumber, tomato, feta, olives, red onion", dietary: ["vegetarian"] },
  { id: "s4", name: "Quinoa Power Bowl", category: "Salads", price: 15, description: "Kale, roasted vegetables, tahini dressing", dietary: ["vegan"] },
  
  // Mains
  { id: "m1", name: "Pan-Seared Salmon", category: "Mains", price: 32, description: "Roasted vegetables, lemon butter", dietary: [], popular: true },
  { id: "m2", name: "Dry-Aged Ribeye", category: "Mains", price: 48, description: "16oz, garlic mash, red wine jus", dietary: [] },
  { id: "m3", name: "Lobster Risotto", category: "Mains", price: 42, description: "Maine lobster, parmesan, peas", dietary: [], popular: true },
  { id: "m4", name: "Herb-Roasted Chicken", category: "Mains", price: 28, description: "Free-range, seasonal vegetables", dietary: [] },
  { id: "m5", name: "Wild Mushroom Pasta", category: "Mains", price: 26, description: "House-made fettuccine, truffle cream", dietary: ["vegetarian"] },
  { id: "m6", name: "Braised Short Ribs", category: "Mains", price: 38, description: "Red wine reduction, root vegetables", dietary: [] },
  { id: "m7", name: "Seared Scallops", category: "Mains", price: 36, description: "Cauliflower puree, crispy prosciutto", dietary: [] },
  { id: "m8", name: "Duck Confit", category: "Mains", price: 34, description: "Orange glaze, wild rice, asparagus", dietary: [] },
  { id: "m9", name: "Vegetable Wellington", category: "Mains", price: 24, description: "Puff pastry, seasonal vegetables, mushroom sauce", dietary: ["vegetarian"] },
  
  // Sides
  { id: "sd1", name: "Truffle Fries", category: "Sides", price: 9, description: "Parmesan, truffle aioli", dietary: ["vegetarian"] },
  { id: "sd2", name: "Garlic Mashed Potatoes", category: "Sides", price: 7, description: "Butter, chives", dietary: ["vegetarian"] },
  { id: "sd3", name: "Grilled Asparagus", category: "Sides", price: 8, description: "Lemon, olive oil", dietary: ["vegan"] },
  { id: "sd4", name: "Brussels Sprouts", category: "Sides", price: 8, description: "Bacon, balsamic glaze", dietary: [] },
  { id: "sd5", name: "Mac & Cheese", category: "Sides", price: 9, description: "Three cheese blend, breadcrumbs", dietary: ["vegetarian"] },
  
  // Desserts
  { id: "d1", name: "Chocolate Lava Cake", category: "Desserts", price: 12, description: "Vanilla ice cream, berries", dietary: ["vegetarian"], popular: true },
  { id: "d2", name: "Lemon Tart", category: "Desserts", price: 10, description: "Fresh raspberries, mint", dietary: ["vegetarian"] },
  { id: "d3", name: "Tiramisu", category: "Desserts", price: 11, description: "Classic Italian, espresso-soaked", dietary: ["vegetarian"] },
  { id: "d4", name: "Crème Brûlée", category: "Desserts", price: 10, description: "Vanilla bean, caramelized sugar", dietary: ["vegetarian"] },
  { id: "d5", name: "Seasonal Cheesecake", category: "Desserts", price: 11, description: "Berry compote, whipped cream", dietary: ["vegetarian"] },
  
  // Beverages
  { id: "b1", name: "Espresso", category: "Beverages", price: 4, description: "Italian dark roast", dietary: ["vegan"] },
  { id: "b2", name: "Cappuccino", category: "Beverages", price: 5, description: "Steamed milk, foam", dietary: ["vegetarian"] },
  { id: "b3", name: "Fresh Juice", category: "Beverages", price: 6, description: "Orange, apple, or grapefruit", dietary: ["vegan"] },
  { id: "b4", name: "Iced Tea", category: "Beverages", price: 4, description: "House-made, unsweetened", dietary: ["vegan"] },
  { id: "b5", name: "Sparkling Water", category: "Beverages", price: 5, description: "San Pellegrino", dietary: ["vegan"] },
];

// Compressed menu context for AI - optimized for token efficiency
export const menuContext = `Restaurant: ${restaurantInfo.name} (${restaurantInfo.cuisine})
Hours: Mon-Thu 5-10PM, Fri 5-11PM, Sat 4-11PM, Sun 4-9PM

Menu Summary:
Appetizers ($12-19): Calamari★, Burrata(v), Tuna Tartare, Mushroom Soup(vg), Beef Carpaccio, Grilled Octopus
Salads ($12-15): Caesar(v), Harvest★(v), Greek(v), Quinoa Bowl(vg)
Mains ($24-48): Salmon★ $32, Ribeye $48, Lobster Risotto★ $42, Chicken $28, Mushroom Pasta(v) $26, Short Ribs $38, Scallops $36, Duck $34, Veggie Wellington(v) $24
Sides ($7-9): Truffle Fries(v), Mashed Potatoes(v), Asparagus(vg), Brussels Sprouts, Mac & Cheese(v)
Desserts ($10-12): Lava Cake★(v), Lemon Tart(v), Tiramisu(v), Crème Brûlée(v), Cheesecake(v)
Beverages ($4-6): Espresso(vg), Cappuccino(v), Fresh Juice(vg), Iced Tea(vg), Sparkling Water(vg)

★=Popular | (v)=vegetarian | (vg)=vegan`;
