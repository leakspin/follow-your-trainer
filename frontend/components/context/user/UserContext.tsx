'use client'

import { User } from '@/utils/backend/client'
import React from 'react'

/**
 * Application state interface
 */
export interface AppState {
  user?: User|null
  favs?: number[]|null
  updateState: (newState: Partial<AppState>) => void,
  loading: boolean,
  updateLoading: (newLoading: boolean) => void,
}

/**
 * Default application state
 */
const defaultState: AppState = {
  user: null,
  favs: null,
  updateState: (newState?: Partial<AppState>) => {},
  loading: true,
  updateLoading: (newLoading: boolean) => {},
}

/**
 * Creating the Application state context for the provider
 */
export const UserContext = React.createContext<AppState>(defaultState)