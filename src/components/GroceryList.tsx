import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, Check } from 'lucide-react';
import { Recipe, GroceryItem } from '../types';

interface Props {
  recipes: Recipe[];
}

export default function GroceryList({ recipes }: Props) {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', amount: 1, unit: '' });

  useEffect(() => {
    // Generate grocery items from recipes cooked in the last 7 days
    const recentRecipes = recipes.filter(recipe => 
      recipe.dateCooked?.some(date => 
        new Date(date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      )
    );

    const items: GroceryItem[] = recentRecipes.flatMap(recipe =>
      recipe.ingredients.map(ing => ({
        id: `${recipe.id}-${ing.name}`,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        checked: false,
        recipeId: recipe.id
      }))
    );

    setGroceryItems(items);
  }, [recipes]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name) {
      setGroceryItems([
        ...groceryItems,
        {
          id: Date.now().toString(),
          ...newItem,
          checked: false
        }
      ]);
      setNewItem({ name: '', amount: 1, unit: '' });
    }
  };

  const toggleItem = (id: string) => {
    setGroceryItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setGroceryItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Add Item Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Grocery List
        </h2>
        <form onSubmit={handleAddItem} className="flex gap-2">
          <input
            type="text"
            placeholder="Item name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            className="w-24 px-3 py-2 border border-gray-300 rounded-md"
            value={newItem.amount}
            onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
            min="1"
          />
          <input
            type="text"
            placeholder="Unit"
            className="w-24 px-3 py-2 border border-gray-300 rounded-md"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            <Plus className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Grocery Items */}
      <div className="bg-white rounded-lg shadow divide-y">
        {groceryItems.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Your grocery list is empty</p>
          </div>
        ) : (
          groceryItems.map(item => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 ${
                item.checked ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    item.checked
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}
                >
                  {item.checked && <Check className="h-4 w-4 text-white" />}
                </button>
                <span className={item.checked ? 'line-through text-gray-500' : ''}>
                  {item.amount} {item.unit} {item.name}
                </span>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}