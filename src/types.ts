export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
  dateCooked?: Date[];
  source?: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  checked: boolean;
  recipeId?: string;
}