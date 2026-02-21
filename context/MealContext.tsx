'use client'

import React, { createContext, useCallback } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { 
  Recipe, 
  MealContextType, 
  WeeklyPlan,
  MealEntry,
} from '@/types'
import { toast } from 'sonner'

export const MealContext = createContext<MealContextType | undefined>(undefined)

const emptyWeeklyPlan: WeeklyPlan = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
}

export function MealProvider({ children }: { children: React.ReactNode }) {
  const [weeklyPlan, setWeeklyPlan] = useLocalStorage<WeeklyPlan>('meal_weekly_plan', emptyWeeklyPlan)
  const [customRecipes, setCustomRecipes] = useLocalStorage<Recipe[]>('meal_custom_recipes', [])
  const [favorites, setFavorites] = useLocalStorage<string[]>('meal_favorites', [])

  const addToPlan = useCallback((day: string, recipe: Recipe) => {
    setWeeklyPlan((prev) => {
      const dayKey = day as keyof WeeklyPlan
      const mealEntry: MealEntry = {
        ...recipe,
        addedAt: Date.now(),
      }
      return {
        ...prev,
        [dayKey]: [...(prev[dayKey] || []), mealEntry],
      }
    })
    toast.success(`Added to ${day}`)
  }, [setWeeklyPlan])

  const removeFromPlan = useCallback((day: string, recipeId: string) => {
    setWeeklyPlan((prev) => {
      const dayKey = day as keyof WeeklyPlan
      return {
        ...prev,
        [dayKey]: (prev[dayKey] || []).filter((m) => m.id !== recipeId),
      }
    })
    toast.success('Removed from plan')
  }, [setWeeklyPlan])

  const addCustomRecipe = useCallback((recipe: Recipe) => {
    setCustomRecipes((prev) => [...prev, recipe])
  }, [setCustomRecipes])

  const updateCustomRecipe = useCallback((recipe: Recipe) => {
    setCustomRecipes((prev) =>
      prev.map((r) => (r.id === recipe.id ? recipe : r))
    )
  }, [setCustomRecipes])

  const deleteCustomRecipe = useCallback((recipeId: string) => {
    setCustomRecipes((prev) => prev.filter((r) => r.id !== recipeId))
    setWeeklyPlan((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((day) => {
        const dayKey = day as keyof WeeklyPlan
        updated[dayKey] = (updated[dayKey] || []).filter((m) => m.id !== recipeId)
      })
      return updated
    })
  }, [setCustomRecipes, setWeeklyPlan])

  const toggleFavorite = useCallback((recipeId: string) => {
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    )
  }, [setFavorites])

  const value: MealContextType = {
    weeklyPlan,
    addToPlan,
    removeFromPlan,
    customRecipes,
    addCustomRecipe,
    updateCustomRecipe,
    deleteCustomRecipe,
    favorites,
    toggleFavorite,
  }

  return (
    <MealContext.Provider value={value}>
      {children}
    </MealContext.Provider>
  )
}
