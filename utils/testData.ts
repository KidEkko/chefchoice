// Seed data for two recipes. Instructions are paraphrased, not copied.
// TODO: swap these local types for your shared types if they differ.
 
import { Recipe } from "./types";

 

export const testRecipes: Recipe[] = [
  {
    id: 0,
    createdBy: "berry",
    createdOn: new Date(), 
    name: "Pan-Fried Garlic Butter Steak with Crispy Potatoes and Asparagus",
    sourceUrl:
      "https://hostthetoast.com/pan-fried-garlic-butter-steak-with-crispy-potatoes-and-asparagus/",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 25,
    difficulty: "medium",
    dietaryTags: ["gluten-free"],
    ingredients: [
      { id: 0, name: "potatoes", amount: 1, unit: "lb", note: "small, halved", cost: 0 },
      { id: 1, name: "ribeye steak", amount: 1, note: "1.5 to 2 inches thick", cost: 10.5 },
      { id: 2, name: "salt", amount: 0, note: "kosher" , cost: 0 },
      { id: 3, name: "black pepper", amount: 0,  note: "freshly ground", cost: 0 },
      { id: 4, name: "vegetable oil", amount: 3, unit: "tbsp", cost: 0 },
      { id: 5, name: "butter", amount: 4, unit: "tbsp", cost: 0 },
      { id: 6, name: "rosemary", amount: 2, unit: "sprigs", cost: 0 },
      { id: 7, name: "thyme", amount: 2, unit: "sprigs",  cost: 0 },
      { id: 8, name: "garlic", amount: 8, unit: "cloves", note: "peeled", cost: 0 },
      {id: 9,  name: "asparagus", amount: 8, unit: "oz", note: "trimmed", cost: 0 },
    ],
    instructions: [
      "Cover the halved potatoes with water in a pot, bring to a boil, then simmer 6-8 minutes until tender. Drain and set aside.",
      "Season the steak generously with salt and pepper. Heat the oil in a large cast iron skillet over high heat until it just starts to smoke.",
      "Sear the steak, flipping about every 30 seconds, for roughly 4 minutes total until well browned. Sear the edges too.",
      "Drop the heat to medium and add the butter, garlic, rosemary and thyme. When the butter melts, tilt the pan and spoon the butter over the steak, flipping occasionally, until it reads 120-125°F for medium-rare or 125-130°F for medium (about 3-4 minutes). Move the steak to a plate to rest.",
      "Place the potatoes cut-side down in the same skillet and add the asparagus in the middle. Toss the asparagus now and then, leaving the potatoes alone, until the asparagus is just tender (about 6 minutes). Take the asparagus out, then let the potatoes crisp about 2 more minutes until golden.",
      "Slice the steak and serve with the potatoes and asparagus.",
    ],
  },
  {
    id: 1,
    createdBy: "berry",
    createdOn: new Date(), 
    name: "Creamy Italian Sausage Pasta",
    sourceUrl: "https://thesaltymarshmallow.com/creamy-italian-sausage-pasta/",
    servings: 4,
    prepMinutes: 5,
    cookMinutes: 15,
    difficulty: "easy",
    dietaryTags: [],
    // NOTE: the ingredient list did not load from the original page. These amounts
    // come from a Cooklist copy of the recipe, and the first eight match a partial
    // copy found on the site's own comment pages. The spinach and parmesan amounts
    // appear only in the Cooklist copy, so verify them against the original page.
    ingredients: [
      { id: 10, name: "penne pasta", amount: 1, unit: "lb" , cost: 0 },
      { id: 11, name: "olive oil", amount: 1, unit: "tbsp", cost: 0 },
      { id: 12, name: "italian sausage", amount: 1, unit: "lb", note: "ground", cost: 0 },
      { id: 13, name: "onion", amount: 0.5, note: "yellow, minced", cost: 0 },
      { id: 14, name: "garlic", amount: 2, unit: "cloves", note: "minced", cost: 0 },
      { id: 15, name: "red pepper flakes", amount: 0.5, unit: "tsp", cost: 0 },
      { id: 16, name: "salt", amount: 0.5, unit: "tsp", cost: 0 },
      { id: 17, name: "heavy cream", amount: 2, unit: "cups", cost: 0 },
      { id: 18, name: "baby spinach", amount: 5, unit: "oz",  cost: 0 },
      { id: 19, name: "parmesan cheese", amount: 1, unit: "cup",  cost: 0 },
    ],
    instructions: [
      "Boil the penne in well-salted water according to the package directions.",
      "While it cooks, heat the olive oil in a large skillet over medium-high heat. Cook the sausage with the onion, garlic, red pepper flakes and salt until no pink remains.",
      "Pour off excess fat if needed and leave the sausage mixture in the pan.",
      "Reduce the heat to low, add the cream and bring it to a simmer. Stir in the spinach and cook about 3 minutes until wilted.",
      "Stir in the parmesan until melted, add the drained pasta and toss to coat. Serve right away.",
    ],
  },
];