import React from 'react';
import { X, Clock } from 'lucide-react';
import { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeDetails({ recipe, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h2>
          <p className="text-gray-600 mb-4">{recipe.description}</p>
          
          <div className="flex items-center gap-6 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Prep: {recipe.prepTime}min</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Cook: {recipe.cookTime}min</span>
            </div>
            <div>Servings: {recipe.servings}</div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, index) => (
                <li key={index} className="flex justify-between">
                  <span>{ing.name}</span>
                  <span className="text-gray-600">
                    {ing.amount} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-gray-700">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}