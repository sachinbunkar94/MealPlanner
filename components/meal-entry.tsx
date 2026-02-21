'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import type { MealEntry as MealEntryType } from '@/types'

interface MealEntryProps {
  meal: MealEntryType
  day: string
  onRemove: () => void
}

export function MealEntry({ meal, onRemove }: MealEntryProps) {
  return (
    <Card className="p-3 border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm text-gray-900 truncate">{meal.name}</p>
        {meal.ingredients && meal.ingredients.length > 0 && (
          <p className="text-xs text-gray-500">{meal.ingredients.length} ingredients</p>
        )}
      </div>
      <Button
        onClick={onRemove}
        variant="ghost"
        size="sm"
        className="text-red-600 hover:bg-red-100 hover:text-red-700 flex-shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  )
}
