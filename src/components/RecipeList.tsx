import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Recipe } from '../types';
import RecipeDetails from './RecipeDetails';

interface Props {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Get unique ingredients from all recipes
  const allIngredients = Array.from(
    new Set(
      recipes.flatMap(recipe => recipe.ingredients.map(ing => ing.name.toLowerCase()))
    )
  ).sort();

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIngredients = selectedIngredients.length === 0 || 
      selectedIngredients.every(ing => 
        recipe.ingredients.some(i => i.name.toLowerCase() === ing.toLowerCase())
      );
    return matchesSearch && matchesIngredients;
  });

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          {allIngredients.map(ingredient => (
            <button
              key={ingredient}
              onClick={() => {
                setSelectedIngredients(prev =>
                  prev.includes(ingredient)
                    ? prev.filter(i => i !== ingredient)
                    : [...prev, ingredient]
                )
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedIngredients.includes(ingredient)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {ingredient}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedRecipe(recipe)}
          >
            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
              <div className="flex flex-wrap gap-2">
                {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
                  >
                    {ing.name}
                  </span>
                ))}
                {recipe.ingredients.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{recipe.ingredients.length - 3} more
                  </span>
                )}
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Prep: {recipe.prepTime}min</span>
                <span>Cook: {recipe.cookTime}min</span>
                <span>Serves: {recipe.servings}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No recipes found matching your criteria.</p>
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}