'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Users, ChefHat, Info } from 'lucide-react'
import Image from 'next/image'
import { useMealContext } from '@/hooks/useMealContext'
import { useState } from 'react'
import { SelectMealDialog } from './select-meal-dialog'
import type { Recipe } from '@/types'

interface RecipeDetailsDialogProps {
  recipe: Recipe | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isFavorite: boolean
}

export function RecipeDetailsDialog({
  recipe,
  open,
  onOpenChange,
  isFavorite,
}: RecipeDetailsDialogProps) {
  const { toggleFavorite } = useMealContext()
  const [showAddDialog, setShowAddDialog] = useState(false)

  if (!recipe) return null

  // Estimate cooking time based on instructions length
  const estimatedTime = recipe.instructions 
    ? Math.max(15, Math.min(120, Math.ceil(recipe.instructions.length / 50)))
    : 30

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl h-[90vh] flex flex-col gap-0 p-0">
          <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-2xl">{recipe.name}</DialogTitle>
              <DialogDescription>
                View detailed recipe information including ingredients, instructions, and cooking time.
              </DialogDescription>
            </DialogHeader>
          </div>

          <ScrollArea className="flex-1 overflow-hidden">
            <div className="space-y-6 px-6 py-4 pb-20">
              {/* Hero Image */}
              {recipe.image && (
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={recipe.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-semibold text-gray-600">Cooking Time</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">~{estimatedTime} min</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <ChefHat className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-semibold text-gray-600">Category</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{recipe.category}</p>
                </div>

                {recipe.area && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold text-gray-600">Cuisine</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{recipe.area}</p>
                  </div>
                )}

                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-semibold text-gray-600">Servings</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">2-4</p>
                </div>
              </div>

              {/* Ingredients Section */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-orange-600" />
                    Ingredients
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 cursor-pointer"
                            aria-label={`Check ${ingredient}`}
                          />
                          <span className="text-gray-700">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Instructions Section */}
              {recipe.instructions && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Instructions
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {recipe.instructions}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recipe Stats */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
                <h4 className="font-semibold text-gray-900 mb-2">Recipe Stats</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Ingredients</span>
                    <p className="text-lg font-bold text-orange-600">{recipe.ingredients?.length || 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Complexity</span>
                    <p className="text-lg font-bold text-blue-600">
                      {recipe.instructions && recipe.instructions.length > 500 ? 'Advanced' : 'Moderate'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Prep Steps</span>
                    <p className="text-lg font-bold text-green-600">
                      {recipe.instructions ? recipe.instructions.split('.').filter(s => s.trim()).length : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex gap-2 p-6 border-t border-gray-200 bg-white flex-shrink-0">
            <Button
              onClick={() => toggleFavorite(recipe.id)}
              variant={isFavorite ? 'default' : 'outline'}
              className={isFavorite ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {isFavorite ? '♥ Favorited' : '♡ Add to Favorites'}
            </Button>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              Add to Weekly Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SelectMealDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        day=""
        recipe={recipe}
        onSelectMeal={() => setShowAddDialog(false)}
      />
    </>
  )
}
