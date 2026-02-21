'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMealContext } from '@/hooks/useMealContext'
import { searchRecipes } from '@/services/mealdb'
import { Loader2, Search as SearchIcon } from 'lucide-react'
import { RecipeCard } from '@/components/recipe-card'
import type { Recipe } from '@/types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface SelectMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  day: string
  onSelectMeal: (recipe: Recipe) => void
  recipe?: Recipe
}

export function SelectMealDialog({
  open,
  onOpenChange,
  day,
  onSelectMeal,
  recipe,
}: SelectMealDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDay, setSelectedDay] = useState(day)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { addToPlan, customRecipes } = useMealContext()

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setRecipes([])
      return
    }

    setIsLoading(true)
    try {
      const results = await searchRecipes(query)
      setRecipes(results)
    } catch {
      setRecipes([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = (value: string) => {
    setSearchQuery(value)
    const timer = setTimeout(() => {
      handleSearch(value)
    }, 500)
    return () => clearTimeout(timer)
  }

  const allRecipes = useMemo(() => {
    return [...recipes, ...customRecipes]
  }, [recipes, customRecipes])

  const handleSelectAndAdd = (selected: Recipe) => {
    if (day) {
      addToPlan(selectedDay || day, selected)
      onOpenChange(false)
      onSelectMeal(selected)
    } else if (recipe) {
      onSelectMeal(selected)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Meal to Plan</DialogTitle>
          <DialogDescription>
            Search for recipes or select from your custom recipes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {day && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Day
              </label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Search Recipes
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          )}

          {!isLoading && allRecipes.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {allRecipes.slice(0, 8).map((r) => (
                <div key={r.id} className="cursor-pointer" onClick={() => handleSelectAndAdd(r)}>
                  <RecipeCard recipe={r} isFavorite={false} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && searchQuery && allRecipes.length === 0 && (
            <p className="text-center text-gray-500 py-8">No recipes found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
