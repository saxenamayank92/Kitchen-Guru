import React, { useState } from 'react';
import { Plus, Minus, Upload } from 'lucide-react';
import { Recipe, Ingredient } from '../types';
import { parseRecipeText } from '../utils/recipeParser';
import toast from 'react-hot-toast';

interface Props {
  onSubmit: (recipe: Recipe) => void;
  onCancel: () => void;
}

export default function RecipeForm({ onSubmit, onCancel }: Props) {
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    name: '',
    description: '',
    ingredients: [{ name: '', amount: 0, unit: '' }],
    instructions: [''],
    prepTime: 0,
    cookTime: 0,
    servings: 1,
  });

  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...(recipe.ingredients || [])];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...(recipe.instructions || [])];
    newInstructions[index] = value;
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipe.name && recipe.ingredients?.length && recipe.instructions?.length) {
      onSubmit(recipe as Recipe);
    }
  };

  const handleImport = () => {
    try {
      const parsedRecipe = parseRecipeText(importText);
      if (parsedRecipe.name && parsedRecipe.ingredients?.length) {
        setRecipe({
          ...recipe,
          ...parsedRecipe,
          ingredients: parsedRecipe.ingredients.length ? parsedRecipe.ingredients : recipe.ingredients,
          instructions: parsedRecipe.instructions?.length ? parsedRecipe.instructions : recipe.instructions,
        });
        setShowImport(false);
        toast.success('Recipe imported successfully!');
      } else {
        toast.error('Could not parse recipe. Please check the format and try again.');
      }
    } catch (error) {
      toast.error('Failed to import recipe. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Add New Recipe</h2>
        
        {/* Import Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          {showImport ? (
            <div className="space-y-4">
              <textarea
                placeholder="Paste your recipe here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={10}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImport(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowImport(true)}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Recipe
            </button>
          )}
        </div>

        {/* Rest of the form remains the same */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Recipe Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            required
          />
          
          <textarea
            placeholder="Description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={recipe.description}
            onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Prep Time (min)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={recipe.prepTime}
                onChange={(e) => setRecipe({ ...recipe, prepTime: Number(e.target.value) })}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Cook Time (min)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={recipe.cookTime}
                onChange={(e) => setRecipe({ ...recipe, cookTime: Number(e.target.value) })}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Servings</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={recipe.servings}
                onChange={(e) => setRecipe({ ...recipe, servings: Number(e.target.value) })}
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Ingredients</h3>
          {recipe.ingredients?.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ingredient"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                value={ingredient.amount || ''}
                onChange={(e) => handleIngredientChange(index, 'amount', Number(e.target.value))}
                required
              />
              <input
                type="text"
                placeholder="Unit"
                className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                required
              />
              {index === recipe.ingredients.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setRecipe({
                    ...recipe,
                    ingredients: [...recipe.ingredients!, { name: '', amount: 0, unit: '' }]
                  })}
                  className="p-2 text-green-600 hover:text-green-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setRecipe({
                    ...recipe,
                    ingredients: recipe.ingredients?.filter((_, i) => i !== index)
                  })}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <Minus className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Instructions</h3>
          {recipe.instructions?.map((instruction, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <span className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-full">
                {index + 1}
              </span>
              <textarea
                placeholder="Instruction step"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                rows={2}
                required
              />
              {index === recipe.instructions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setRecipe({
                    ...recipe,
                    instructions: [...recipe.instructions!, '']
                  })}
                  className="p-2 text-green-600 hover:text-green-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setRecipe({
                    ...recipe,
                    instructions: recipe.instructions?.filter((_, i) => i !== index)
                  })}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <Minus className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Save Recipe
        </button>
      </div>
    </form>
  );
}