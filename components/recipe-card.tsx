'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMealContext } from '@/hooks/useMealContext'
import { Heart, Plus, Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { SelectMealDialog } from '@/components/dialogs/select-meal-dialog'
import { RecipeDetailsDialog } from '@/components/dialogs/recipe-details-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Recipe } from '@/types'

interface RecipeCardProps {
  recipe: Recipe
  isFavorite: boolean
  onEdit?: () => void
}

export function RecipeCard({ recipe, isFavorite, onEdit }: RecipeCardProps) {
  const { toggleFavorite, deleteCustomRecipe, customRecipes } = useMealContext()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const isCustom = customRecipes.some(r => r.id === recipe.id)

  const handleDelete = () => {
    deleteCustomRecipe(recipe.id)
    setShowDeleteAlert(false)
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col border-orange-100">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden group">
          {recipe.image && (
            <Image
              src={recipe.image}
              alt={recipe.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          
          {/* Category Badge */}
          {recipe.category && (
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {recipe.category}
            </div>
          )}

          {/* Area Badge */}
          {recipe.area && (
            <div className="absolute top-2 right-2 bg-orange-500/90 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {recipe.area}
            </div>
          )}

          {/* Heart Button */}
          <button
            onClick={() => toggleFavorite(recipe.id)}
            className="absolute bottom-2 right-2 bg-white rounded-full p-2 hover:bg-orange-100 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{recipe.name}</h3>
          
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <p className="text-xs text-gray-600 mb-3">
              {recipe.ingredients.length} ingredient{recipe.ingredients.length > 1 ? 's' : ''}
            </p>
          )}

          {/* Description/Instructions snippet */}
          {recipe.instructions && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
              {recipe.instructions.substring(0, 100)}...
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Button
              onClick={() => setShowDetails(true)}
              variant="outline"
              size="sm"
              className="flex-1 gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              View Details
            </Button>
            {isCustom ? (
              <>
                {onEdit && (
                  <Button
                    onClick={onEdit}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  onClick={() => setShowDeleteAlert(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowAddDialog(true)}
                variant="outline"
                size="sm"
                className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            )}
          </div>
        </div>
      </Card>

      <RecipeDetailsDialog
        recipe={recipe}
        open={showDetails}
        onOpenChange={setShowDetails}
        isFavorite={isFavorite}
      />

      <SelectMealDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        day=""
        onSelectMeal={() => setShowAddDialog(false)}
        recipe={recipe}
      />

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The recipe "{recipe.name}" will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
