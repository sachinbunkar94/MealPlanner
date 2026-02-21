// Recipe and meal types
export interface Recipe {
  id: string
  name: string
  image: string
  category: string
  area?: string
  instructions?: string
  ingredients?: string[]
  source?: string // 'api' | 'custom'
}

export interface MealEntry extends Recipe {
  addedAt?: number
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export interface WeeklyPlan {
  Monday: MealEntry[]
  Tuesday: MealEntry[]
  Wednesday: MealEntry[]
  Thursday: MealEntry[]
  Friday: MealEntry[]
  Saturday: MealEntry[]
  Sunday: MealEntry[]
}

export interface MealContextType {
  weeklyPlan: WeeklyPlan
  addToPlan: (day: string, recipe: Recipe) => void
  removeFromPlan: (day: string, recipeId: string) => void
  customRecipes: Recipe[]
  addCustomRecipe: (recipe: Recipe) => void
  updateCustomRecipe: (recipe: Recipe) => void
  deleteCustomRecipe: (recipeId: string) => void
  favorites: string[]
  toggleFavorite: (recipeId: string) => void
}
