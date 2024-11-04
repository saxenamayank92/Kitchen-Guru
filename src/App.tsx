import React, { useState } from 'react';
import { ChefHat, Calendar as CalendarIcon, ShoppingCart, PlusCircle, Search } from 'lucide-react';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import Calendar from './components/Calendar';
import GroceryList from './components/GroceryList';
import { Recipe } from './types';

// Sample recipes
const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Classic Chicken Alfredo',
    description: 'Creamy pasta dish with grilled chicken and parmesan sauce',
    ingredients: [
      { name: 'chicken breast', amount: 2, unit: 'pieces' },
      { name: 'fettuccine', amount: 1, unit: 'lb' },
      { name: 'heavy cream', amount: 2, unit: 'cups' },
      { name: 'parmesan cheese', amount: 1, unit: 'cup' },
      { name: 'garlic', amount: 3, unit: 'cloves' }
    ],
    instructions: [
      'Cook fettuccine according to package instructions',
      'Season and grill chicken until cooked through',
      'Simmer cream and garlic in a pan',
      'Add cheese and stir until smooth',
      'Combine pasta, sauce, and sliced chicken'
    ],
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    name: 'Homemade Margherita Pizza',
    description: 'Classic Italian pizza with fresh basil and mozzarella',
    ingredients: [
      { name: 'pizza dough', amount: 1, unit: 'piece' },
      { name: 'tomato sauce', amount: 1, unit: 'cup' },
      { name: 'fresh mozzarella', amount: 8, unit: 'oz' },
      { name: 'fresh basil', amount: 1, unit: 'cup' },
      { name: 'olive oil', amount: 2, unit: 'tbsp' }
    ],
    instructions: [
      'Preheat oven to 450°F',
      'Roll out pizza dough',
      'Spread sauce and add cheese',
      'Bake until crust is golden',
      'Top with fresh basil'
    ],
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('recipes');
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [showAddRecipe, setShowAddRecipe] = useState(false);

  const handleAddRecipe = (recipe: Recipe) => {
    setRecipes([...recipes, { ...recipe, id: Date.now().toString() }]);
    setShowAddRecipe(false);
  };

  const handleAddToCookingCalendar = (recipeId: string, date: Date) => {
    setRecipes(recipes.map(recipe =>
      recipe.id === recipeId
        ? {
            ...recipe,
            dateCooked: [...(recipe.dateCooked || []), date]
          }
        : recipe
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Kitchen Master</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('recipes')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'recipes'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Recipes
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'calendar'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('grocery')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'grocery'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Grocery List
              </button>
            </nav>
            <button
              onClick={() => setShowAddRecipe(true)}
              className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Recipe
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'recipes' && <RecipeList recipes={recipes} />}
        {activeTab === 'calendar' && (
          <Calendar 
            recipes={recipes} 
            onAddToCookingCalendar={handleAddToCookingCalendar}
          />
        )}
        {activeTab === 'grocery' && <GroceryList recipes={recipes} />}
      </main>

      {showAddRecipe && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <RecipeForm onSubmit={handleAddRecipe} onCancel={() => setShowAddRecipe(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;