'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { useMealContext } from '@/hooks/useMealContext'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Recipe } from '@/types'

interface RecipeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialRecipe?: Recipe | null
}

export function RecipeFormDialog({
  open,
  onOpenChange,
  initialRecipe,
}: RecipeFormDialogProps) {
  const { addCustomRecipe, updateCustomRecipe } = useMealContext()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([''])
  const [instructions, setInstructions] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialRecipe) {
      setName(initialRecipe.name)
      setCategory(initialRecipe.category || '')
      setImage(initialRecipe.image || '')
      setIngredients(initialRecipe.ingredients || [''])
      setInstructions(initialRecipe.instructions || '')
    } else {
      resetForm()
    }
  }, [initialRecipe, open])

  const resetForm = () => {
    setName('')
    setCategory('')
    setImage('')
    setIngredients([''])
    setInstructions('')
  }

  const addIngredient = () => {
    setIngredients([...ingredients, ''])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Recipe name is required')
      return
    }

    if (ingredients.every(i => !i.trim())) {
      toast.error('Add at least one ingredient')
      return
    }

    if (!instructions.trim()) {
      toast.error('Instructions are required')
      return
    }

    setIsSaving(true)
    try {
      const filteredIngredients = ingredients.filter(i => i.trim())
      const recipe: Recipe = {
        id: initialRecipe?.id || Date.now().toString(),
        name: name.trim(),
        category: category.trim() || 'Uncategorized',
        image: image.trim() || '/placeholder-recipe.jpg',
        ingredients: filteredIngredients,
        instructions: instructions.trim(),
        area: 'Custom',
      }

      if (initialRecipe) {
        updateCustomRecipe(recipe)
        toast.success('Recipe updated!')
      } else {
        addCustomRecipe(recipe)
        toast.success('Recipe created!')
      }

      onOpenChange(false)
      resetForm()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialRecipe ? 'Edit Recipe' : 'Create New Recipe'}</DialogTitle>
          <DialogDescription>
            Add your own recipes to use in your meal plans
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipe Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Recipe Name *
            </label>
            <Input
              placeholder="e.g., Homemade Pasta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Category
            </label>
            <Input
              placeholder="e.g., Pasta, Dessert, Soup"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Image URL
            </label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Ingredients *
            </label>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Ingredient ${index + 1}`}
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    className="flex-1 border-orange-200 focus:border-orange-400"
                  />
                  {ingredients.length > 1 && (
                    <Button
                      onClick={() => removeIngredient(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                onClick={addIngredient}
                variant="outline"
                size="sm"
                className="w-full gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <Plus className="h-4 w-4" />
                Add Ingredient
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Instructions *
            </label>
            <Textarea
              placeholder="Step-by-step cooking instructions..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={6}
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {isSaving ? 'Saving...' : initialRecipe ? 'Update Recipe' : 'Create Recipe'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
