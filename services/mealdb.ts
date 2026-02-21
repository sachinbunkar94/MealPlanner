import { Recipe } from '@/types'

interface MealDBMeal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string
  strArea: string
  strInstructions: string
  [key: string]: string | null | undefined
}

interface MealDBResponse {
  meals: MealDBMeal[] | null
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const data: MealDBResponse = await response.json()
    
    if (!data.meals) {
      return []
    }

    return data.meals.map(meal => parseMealDBMeal(meal))
  } catch (error) {
    console.error('Error searching recipes:', error)
    return []
  }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const data: MealDBResponse = await response.json()
    
    if (!data.meals || data.meals.length === 0) {
      return null
    }

    return parseMealDBMeal(data.meals[0])
  } catch (error) {
    console.error('Error fetching recipe by ID:', error)
    return null
  }
}

function parseMealDBMeal(meal: MealDBMeal): Recipe {
  const ingredients: string[] = []

  // Extract ingredients (API has up to 20 ingredient slots)
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]

    if (ingredient && ingredient.trim()) {
      const fullIngredient = measure ? `${ingredient.trim()} - ${measure.trim()}` : ingredient.trim()
      ingredients.push(fullIngredient)
    }
  }

  return {
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory || 'Uncategorized',
    area: meal.strArea || '',
    instructions: meal.strInstructions || '',
    ingredients,
    source: 'api',
  }
}
