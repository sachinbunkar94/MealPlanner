'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Calendar, ShoppingCart, UtensilsCrossed } from 'lucide-react'
import { ExploreTab } from '@/components/tabs/explore-tab'
import { PlannerTab } from '@/components/tabs/planner-tab'
import { GroceryTab } from '@/components/tabs/grocery-tab'
import { RecipesTab } from '@/components/tabs/recipes-tab'

export default function Home() {
  const [activeTab, setActiveTab] = useState('explore')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 p-2">
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RecipeFlow</h1>
              <p className="text-sm text-gray-500">Plan, discover & cook</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs 
          defaultValue="explore" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Explore</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Plan</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              <span className="hidden sm:inline">My Recipes</span>
            </TabsTrigger>
            <TabsTrigger value="grocery" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Grocery</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="explore" className="space-y-4">
              <ExploreTab />
            </TabsContent>

            <TabsContent value="planner" className="space-y-4">
              <PlannerTab />
            </TabsContent>

            <TabsContent value="recipes" className="space-y-4">
              <RecipesTab />
            </TabsContent>

            <TabsContent value="grocery" className="space-y-4">
              <GroceryTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
