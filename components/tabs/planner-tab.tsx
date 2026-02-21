'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMealContext } from '@/hooks/useMealContext'
import { MealEntry } from '@/components/meal-entry'
import { SelectMealDialog } from '@/components/dialogs/select-meal-dialog'
import { Trash2, Plus } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function PlannerTab() {
  const { weeklyPlan, removeFromPlan, addToPlan } = useMealContext()
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const handleAddMeal = (day: string) => {
    setSelectedDay(day)
    setOpenDialog(true)
  }

  const handleClearDay = (day: string) => {
    if (confirm(`Clear all meals for ${day}?`)) {
      weeklyPlan[day as keyof typeof weeklyPlan]?.forEach((meal) => {
        removeFromPlan(day, meal.id)
      })
    }
  }

  const totalMeals = DAYS.reduce((acc, day) => {
    return acc + (weeklyPlan[day as keyof typeof weeklyPlan]?.length || 0)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Weekly Meal Plan</h2>
          <p className="text-gray-600">Plan your meals for the week ahead</p>
        </div>
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 px-4 py-2">
          <p className="text-sm text-gray-600">Total Meals</p>
          <p className="text-2xl font-bold text-orange-600">{totalMeals}</p>
        </Card>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DAYS.map((day) => (
          <Card 
            key={day} 
            className="overflow-hidden flex flex-col border-orange-100 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-400 to-amber-400 px-4 py-3">
              <h3 className="font-semibold text-white">{day}</h3>
            </div>

            {/* Meals List */}
            <div className="flex-1 p-4 space-y-3 bg-white">
              {weeklyPlan[day as keyof typeof weeklyPlan]?.length ? (
                <div className="space-y-2">
                  {weeklyPlan[day as keyof typeof weeklyPlan]?.map((meal) => (
                    <MealEntry 
                      key={meal.id} 
                      meal={meal}
                      day={day}
                      onRemove={() => removeFromPlan(day, meal.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No meals planned</p>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 p-3 bg-gray-50 flex gap-2">
              <Button
                onClick={() => handleAddMeal(day)}
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
              {weeklyPlan[day as keyof typeof weeklyPlan]?.length ? (
                <Button
                  onClick={() => handleClearDay(day)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      {selectedDay && (
        <SelectMealDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          day={selectedDay}
          onSelectMeal={(recipe) => {
            addToPlan(selectedDay, recipe)
            setOpenDialog(false)
          }}
        />
      )}
    </div>
  )
}
