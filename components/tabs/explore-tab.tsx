'use client'

import { useState, useCallback, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search as SearchIcon, Loader2, AlertCircle } from 'lucide-react'
import { searchRecipes } from '@/services/mealdb'
import { useMealContext } from '@/hooks/useMealContext'
import { RecipeCard } from '@/components/recipe-card'
import type { Recipe } from '@/types'

export function ExploreTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { favorites } = useMealContext()

  // Debounced search
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setRecipes([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const results = await searchRecipes(query)
      setRecipes(results)
      if (results.length === 0) {
        setError(`No recipes found for "${query}". Try another search.`)
      }
    } catch (err) {
      setError('Failed to search recipes. Please try again.')
      setRecipes([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce search input
  const handleInputChange = useCallback((value: string) => {
    setSearchQuery(value)
    const timer = setTimeout(() => {
      handleSearch(value)
    }, 500)
    return () => clearTimeout(timer)
  }, [handleSearch])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover Recipes</h2>
        <p className="text-gray-600">Search from thousands of recipes and add your favorites to your weekly plan</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search recipes (e.g., 'chicken', 'pasta', 'dessert')..."
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-10 h-12 text-base border-orange-200 focus:border-orange-400 focus:ring-orange-400"
        />
      </div>

      {/* Error State */}
      {error && !isLoading && (
        <Card className="bg-red-50 border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-64 bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recipes.length === 0 && !error && (
        <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {searchQuery ? 'Search for recipes to get started' : 'Enter a recipe name to explore'}
          </p>
        </Card>
      )}

      {/* Results Grid */}
      {recipes.length > 0 && !isLoading && (
        <>
          <div className="text-sm text-gray-600">
            Found <span className="font-semibold text-gray-900">{recipes.length}</span> recipes
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe}
                isFavorite={favorites.includes(recipe.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
