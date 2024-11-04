import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Recipe } from '../types';
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  recipes: Recipe[];
  onAddToCookingCalendar: (recipeId: string, date: Date) => void;
}

export default function Calendar({ recipes, onAddToCookingCalendar }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleAddToCookingCalendar = () => {
    if (selectedRecipe) {
      onAddToCookingCalendar(selectedRecipe.id, selectedDate);
      setSelectedRecipe(null);
    }
  };

  const getCookedRecipesForDate = (date: Date) => 
    recipes.filter(recipe => 
      recipe.dateCooked?.some(d => 
        format(new Date(d), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
    );

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-8">
        {/* Calendar Section */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Cooking Calendar</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date) => setSelectedDate(date)}
            inline
            calendarClassName="!border-0"
          />
        </div>

        {/* Recipe Selection Section */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add Recipe to Calendar
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">
                {format(selectedDate, 'MMMM d, yyyy')}
              </span>
            </div>
            <select
              value={selectedRecipe?.id || ''}
              onChange={(e) => {
                const recipe = recipes.find(r => r.id === e.target.value);
                setSelectedRecipe(recipe || null);
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a recipe...</option>
              {recipes.map(recipe => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddToCookingCalendar}
              disabled={!selectedRecipe}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add to Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Cooked Recipes for Selected Date */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recipes for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        <div className="space-y-4">
          {getCookedRecipesForDate(selectedDate).map(recipe => (
            <div
              key={recipe.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900">{recipe.name}</h4>
                <p className="text-sm text-gray-500">
                  Prep: {recipe.prepTime}min • Cook: {recipe.cookTime}min
                </p>
              </div>
            </div>
          ))}
          {getCookedRecipesForDate(selectedDate).length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No recipes planned for this date
            </p>
          )}
        </div>
      </div>
    </div>
  );
}