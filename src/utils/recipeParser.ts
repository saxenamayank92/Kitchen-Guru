import { Recipe } from '../types';

export function parseRecipeText(text: string): Partial<Recipe> {
  const recipe: Partial<Recipe> = {
    ingredients: [],
    instructions: [],
  };

  // Split text into lines and remove empty lines
  const lines = text.split('\n').filter(line => line.trim());

  // Try to identify the recipe name (usually the first line)
  recipe.name = lines[0].trim();

  let currentSection: 'ingredients' | 'instructions' | null = null;

  for (const line of lines.slice(1)) {
    const cleanLine = line.trim().toLowerCase();

    // Detect sections
    if (cleanLine.includes('ingredient')) {
      currentSection = 'ingredients';
      continue;
    } else if (cleanLine.includes('instruction') || cleanLine.includes('direction')) {
      currentSection = 'instructions';
      continue;
    }

    // Parse ingredients
    if (currentSection === 'ingredients') {
      const ingredientMatch = line.match(/^([\d./]+)?\s*(cup|tbsp|tsp|oz|g|lb|piece|pieces|clove|cloves|whole)?\s*(.+)$/i);
      if (ingredientMatch) {
        const [, amount, unit, name] = ingredientMatch;
        recipe.ingredients!.push({
          name: name.trim(),
          amount: amount ? parseFloat(amount) : 1,
          unit: unit?.toLowerCase() || 'piece'
        });
      }
    }

    // Parse instructions
    if (currentSection === 'instructions') {
      // Remove numbers or bullets from the start of the line
      const instruction = line.replace(/^[\d.-]+\s*\.?\s*/, '').trim();
      if (instruction) {
        recipe.instructions!.push(instruction);
      }
    }
  }

  return recipe;
}