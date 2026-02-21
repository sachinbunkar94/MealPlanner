'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useMealContext } from '@/hooks/useMealContext'
import { Download, Printer, Trash2 } from 'lucide-react'

interface GroceryItem {
  name: string
  checked: boolean
}

export function GroceryTab() {
  const { weeklyPlan, customRecipes } = useMealContext()
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  // Generate grocery list from weekly plan
  const groceryList = useMemo(() => {
    const items: Map<string, number> = new Map()

    // Add ingredients from weekly plan
    Object.values(weeklyPlan).forEach((dayMeals) => {
      dayMeals?.forEach((meal) => {
        meal.ingredients?.forEach((ing) => {
          const key = ing.toLowerCase().trim()
          items.set(key, (items.get(key) || 0) + 1)
        })
      })
    })

    // Add ingredients from custom recipes (if used in weekly plan)
    const usedRecipeIds = new Set<string>()
    Object.values(weeklyPlan).forEach((dayMeals) => {
      dayMeals?.forEach((meal) => {
        usedRecipeIds.add(meal.id)
      })
    })

    // Convert to sorted array
    return Array.from(items.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [weeklyPlan])

  const totalItems = groceryList.length
  const checkedCount = checkedItems.size

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(item)) {
      newChecked.delete(item)
    } else {
      newChecked.add(item)
    }
    setCheckedItems(newChecked)
  }

  const downloadList = () => {
    const text = groceryList
      .map(({ name, count }) => {
        const checked = checkedItems.has(name) ? '✓' : ' '
        const countStr = count > 1 ? ` (x${count})` : ''
        return `[${checked}] ${name}${countStr}`
      })
      .join('\n')

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', 'grocery-list.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const printList = () => {
    const printWindow = window.open('', '', 'height=400,width=600')
    if (printWindow) {
      const html = `
        <html>
          <head>
            <title>Grocery List</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #f97316; margin-bottom: 20px; }
              .item { margin: 8px 0; }
              .checked { text-decoration: line-through; color: #999; }
            </style>
          </head>
          <body>
            <h1>📋 Grocery List</h1>
            ${groceryList.map(({ name, count }) => {
              const checked = checkedItems.has(name) ? 'checked' : ''
              const countStr = count > 1 ? ` (x${count})` : ''
              return `<div class="item ${checked}">☐ ${name}${countStr}</div>`
            }).join('')}
          </body>
        </html>
      `
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const clearList = () => {
    if (confirm('Clear all items?')) {
      setCheckedItems(new Set())
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Shopping List</h2>
          <p className="text-gray-600">Auto-generated from your weekly meal plan</p>
        </div>
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 px-4 py-2">
          <p className="text-sm text-gray-600">Items</p>
          <p className="text-2xl font-bold text-orange-600">{checkedCount}/{totalItems}</p>
        </Card>
      </div>

      {groceryList.length === 0 ? (
        <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <Download className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No meals planned yet</p>
          <p className="text-gray-500 text-sm">Add meals to your weekly plan to generate a shopping list</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={downloadList}
              variant="outline"
              className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button 
              onClick={printList}
              variant="outline"
              className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            {checkedCount > 0 && (
              <Button 
                onClick={clearList}
                variant="outline"
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50 ml-auto"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Grocery Items */}
          <Card className="border-orange-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {groceryList.map(({ name, count }) => {
                const isChecked = checkedItems.has(name)
                return (
                  <div 
                    key={name}
                    onClick={() => toggleItem(name)}
                    className="p-4 flex items-center gap-3 hover:bg-orange-50 cursor-pointer transition-colors"
                  >
                    <Checkbox 
                      checked={isChecked}
                      onCheckedChange={() => toggleItem(name)}
                      className="border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isChecked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {name}
                      </p>
                    </div>
                    {count > 1 && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold flex-shrink-0">
                        x{count}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-gray-900">{Math.round((checkedCount / totalItems) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all"
                style={{ width: `${(checkedCount / totalItems) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
