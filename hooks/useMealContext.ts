'use client';

import { useContext } from 'react';
import { MealContext } from '@/context/MealContext';
import { MealContextType } from '@/types';

export function useMealContext(): MealContextType {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMealContext must be used within MealProvider');
  }
  return context;
}
