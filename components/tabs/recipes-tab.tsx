'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMealContext } from '@/hooks/useMealContext'
import { RecipeCard } from '@/components/recipe-card'
import { RecipeFormDialog } from '@/components/dialogs/recipe-form-dialog'
import { Plus } from 'lucide-react'

export function RecipesTab() {
  const { customRecipes, favorites } = useMealContext()
  const [openForm, setOpenForm] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const handleCreateNew = () => {
    setSelectedRecipe(null)
    setOpenForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Recipes</h2>
          <p className="text-gray-600">Create and manage your custom recipes</p>
        </div>
        <Button 
          onClick={handleCreateNew}
          className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          <Plus className="h-4 w-4" />
          Create Recipe
        </Button>
      </div>

      {customRecipes.length === 0 ? (
        <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <Plus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">No custom recipes yet</p>
          <Button 
            onClick={handleCreateNew}
            className="gap-2 bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Create Your First Recipe
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.id)}
              onEdit={() => {
                setSelectedRecipe(recipe as any)
                setOpenForm(true)
              }}
            />
          ))}
        </div>
      )}

      <RecipeFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        initialRecipe={selectedRecipe}
      />
    </div>
  )
}
