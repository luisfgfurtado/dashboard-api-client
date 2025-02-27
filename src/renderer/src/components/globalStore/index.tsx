// src/components/globalStore/index.tsx
import React, { createContext, useReducer, useContext, useEffect, useState } from 'react'

export interface DashboardSettings {
  id: string
  title: string
  layout: string
}

export interface ContainerSettings {
  id: string
  title: string
  apiDefinition: any
}

export interface ComponentDefinition {
  id: string
  title?: string
  endpointUrl: string
  verb: string
  type: 'Text' | 'Table' | 'Button' | 'List' | 'ComboSelect'
  order: number
  pinned: boolean
  otherSettings: any
}

export interface ContainerData {
  containerSettings: ContainerSettings
  components: { componentDefinition: ComponentDefinition }[]
}

export interface DashboardData {
  dashboardSettings: DashboardSettings
  containers: ContainerData[]
}

export interface AuthSettings {
  authUrl: string
  clientId: string
  responseType: string
  scope: string
}

export interface GlobalState {
  dashboards: DashboardData[]
  authSettings: AuthSettings
}

export type Action =
  | { type: 'ADD_DASHBOARD'; payload: DashboardData }
  | { type: 'UPDATE_DASHBOARD_TITLE'; payload: { dashboardId: string; title: string } }
  | { type: 'ADD_CONTAINER'; payload: { dashboardId: string; container: ContainerData } }
  | { type: 'REMOVE_CONTAINER'; payload: { dashboardId: string; containerId: string } } // Nova ação
  | { type: 'UPDATE_AUTH_SETTINGS'; payload: Partial<AuthSettings> }
  | { type: 'LOAD_STATE'; payload: Partial<GlobalState> }

const initialState: GlobalState = {
  dashboards: [],
  authSettings: {
    authUrl: 'https://example.com/oauth2/authorize',
    clientId: 'your-client-id',
    responseType: 'token',
    scope: 'read write'
  }
}

function reducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case 'ADD_DASHBOARD':
      return { ...state, dashboards: [...state.dashboards, action.payload] }
    case 'UPDATE_DASHBOARD_TITLE':
      return {
        ...state,
        dashboards: state.dashboards.map((d) =>
          d.dashboardSettings.id === action.payload.dashboardId
            ? { ...d, dashboardSettings: { ...d.dashboardSettings, title: action.payload.title } }
            : d
        )
      }
    case 'ADD_CONTAINER':
      return {
        ...state,
        dashboards: state.dashboards.map((d) =>
          d.dashboardSettings.id === action.payload.dashboardId
            ? { ...d, containers: [...d.containers, action.payload.container] }
            : d
        )
      }
    case 'REMOVE_CONTAINER':
      return {
        ...state,
        dashboards: state.dashboards.map((d) =>
          d.dashboardSettings.id === action.payload.dashboardId
            ? {
                ...d,
                containers: d.containers.filter(
                  (container) => container.containerSettings.id !== action.payload.containerId
                )
              }
            : d
        )
      }
    case 'UPDATE_AUTH_SETTINGS':
      return {
        ...state,
        authSettings: { ...state.authSettings, ...action.payload }
      }
    case 'LOAD_STATE':
      // Mescla o estado persistido com o estado atual
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const GlobalStoreContext = createContext<{
  state: GlobalState
  dispatch: React.Dispatch<Action>
} | null>(null)

export const GlobalStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  // Flag para saber se o estado persistido foi carregado
  const [initialized, setInitialized] = useState(false)

  // Carrega o estado persistido (via IPC) na inicialização
  useEffect(() => {
    ;(async (): Promise<void> => {
      const persisted = await window.electron.loadGlobalStore()
      if (persisted) {
        dispatch({ type: 'LOAD_STATE', payload: persisted })
      }
      setInitialized(true)
    })()
  }, [])

  // Salva o estado sempre que ele mudar, mas somente depois que o estado foi carregado
  useEffect(() => {
    if (initialized) {
      window.electron.saveGlobalStore(state)
    }
  }, [state, initialized])

  return (
    <GlobalStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStoreContext.Provider>
  )
}

export function useGlobalStore(): { state: GlobalState; dispatch: React.Dispatch<Action> } {
  const context = useContext(GlobalStoreContext)
  if (!context) {
    throw new Error('useGlobalStore must be used within a GlobalStoreProvider')
  }
  return context
}
