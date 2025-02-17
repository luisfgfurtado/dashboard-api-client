// src/renderer/src/components/globalStore/GlobalStoreProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'

// Tipos para a estrutura do JSON
type GeneralSettings = {
  theme: string
  language: string
  version: string
}

type DashboardBaseSettings = {
  layout: string
  defaultWidgets: any[]
  refreshInterval: number
}

type ContainerBaseSettings = {
  borderColor: string
  padding: string
  defaultApiDefinition: {
    baseUrl: string
    authRequired: boolean
  }
}

export type AppConfig = {
  generalSettings: GeneralSettings
  dashboardBaseSettings: DashboardBaseSettings
  containerBaseSettings: ContainerBaseSettings
}

type ProjectDetails = {
  name: string
  description: string
}

type AuthSettings = {
  authUrl: string
  clientId: string
  responseType: string
  scope: string
}

type ProjectSettings = {
  details: ProjectDetails
  authSettings: AuthSettings
}

export type ComponentDefinition = {
  id: string
  endpointUrl: string
  verb: string
  type: 'Button' | 'ComboSelect' | 'List'
  order: number
  pinned: boolean
  otherSettings: { [key: string]: any }
}

export type ContainerSettings = {
  id: string
  title: string
  apiDefinition: {
    baseUrl: string
    authRequired: boolean
  }
}

export type ComponentData = {
  componentDefinition: ComponentDefinition
  dynamicData?: any // Dados retornados da chamada do endpoint, por exemplo.
}

export type ContainerData = {
  containerSettings: ContainerSettings
  components: ComponentData[]
  dynamicData?: any // Dados dinâmicos do container
}

export type DashboardSettings = {
  id: string
  title: string
  layout: string
}

export type DashboardData = {
  dashboardSettings: DashboardSettings
  containers: ContainerData[]
}

export type ProjectConfig = {
  projectSettings: ProjectSettings
  dashboards: DashboardData[]
}

export type GlobalStoreData = {
  appConfig: AppConfig
  projectConfig: ProjectConfig
}

type GlobalStoreContextType = {
  globalStore: GlobalStoreData | null
  updateAppConfig: (newConfig: Partial<AppConfig>) => void
  updateProjectConfig: (newProjectConfig: Partial<ProjectConfig>) => void
  updateDashboard: (dashboardId: string, data: Partial<DashboardData>) => void
  updateContainer: (dashboardId: string, containerId: string, data: Partial<ContainerData>) => void
  updateComponent: (
    dashboardId: string,
    containerId: string,
    componentId: string,
    data: Partial<ComponentDefinition> & { dynamicData?: any }
  ) => void
  updateDynamicData: (
    dashboardId: string,
    containerId: string,
    componentId: string,
    dynamicData: any
  ) => void
  addDashboard: (newDashboard: DashboardData) => void
}

const GlobalStoreContext = createContext<GlobalStoreContextType | undefined>(undefined)

const PROJECT_CONFIG_PATH = '/project-config.json'

export const GlobalStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalStore, setGlobalStore] = useState<GlobalStoreData | null>(null)

  useEffect(() => {
    async function loadProjectConfig() {
      try {
        const response = await fetch(PROJECT_CONFIG_PATH)
        if (!response.ok) {
          throw new Error('Falha ao carregar o arquivo de configuração do projeto.')
        }
        const data: GlobalStoreData = await response.json()
        setGlobalStore(data)
      } catch (error) {
        console.error('Erro ao carregar o project config:', error)
      }
    }
    loadProjectConfig()
  }, [])

  const updateAppConfig = (newConfig: Partial<AppConfig>): void => {
    setGlobalStore((prev) =>
      prev ? { ...prev, appConfig: { ...prev.appConfig, ...newConfig } } : prev
    )
  }

  const updateProjectConfig = (newProjectConfig: Partial<ProjectConfig>): void => {
    setGlobalStore((prev) =>
      prev ? { ...prev, projectConfig: { ...prev.projectConfig, ...newProjectConfig } } : prev
    )
  }

  const updateDashboard = (dashboardId: string, data: Partial<DashboardData>): void => {
    setGlobalStore((prev) => {
      if (!prev) return prev
      const updatedDashboards = prev.projectConfig.dashboards.map((dashboard) => {
        if (dashboard.dashboardSettings.id === dashboardId) {
          return { ...dashboard, ...data }
        }
        return dashboard
      })
      return {
        ...prev,
        projectConfig: { ...prev.projectConfig, dashboards: updatedDashboards }
      }
    })
  }

  const updateContainer = (
    dashboardId: string,
    containerId: string,
    data: Partial<ContainerData>
  ): void => {
    setGlobalStore((prev) => {
      if (!prev) return prev
      const updatedDashboards = prev.projectConfig.dashboards.map((dashboard) => {
        if (dashboard.dashboardSettings.id === dashboardId) {
          const updatedContainers = dashboard.containers.map((container) => {
            if (container.containerSettings.id === containerId) {
              return { ...container, ...data }
            }
            return container
          })
          return { ...dashboard, containers: updatedContainers }
        }
        return dashboard
      })
      return {
        ...prev,
        projectConfig: { ...prev.projectConfig, dashboards: updatedDashboards }
      }
    })
  }

  const updateComponent = (
    dashboardId: string,
    containerId: string,
    componentId: string,
    data: Partial<ComponentDefinition> & { dynamicData?: any }
  ): void => {
    setGlobalStore((prev) => {
      if (!prev) return prev
      const updatedDashboards = prev.projectConfig.dashboards.map((dashboard) => {
        if (dashboard.dashboardSettings.id === dashboardId) {
          const updatedContainers = dashboard.containers.map((container) => {
            if (container.containerSettings.id === containerId) {
              const updatedComponents = container.components.map((component) => {
                if (component.componentDefinition.id === componentId) {
                  return {
                    ...component,
                    componentDefinition: {
                      ...component.componentDefinition,
                      ...data
                    },
                    dynamicData: data.dynamicData || component.dynamicData
                  }
                }
                return component
              })
              return { ...container, components: updatedComponents }
            }
            return container
          })
          return { ...dashboard, containers: updatedContainers }
        }
        return dashboard
      })
      return {
        ...prev,
        projectConfig: { ...prev.projectConfig, dashboards: updatedDashboards }
      }
    })
  }

  const updateDynamicData = (
    dashboardId: string,
    containerId: string,
    componentId: string,
    dynamicData: any
  ): void => {
    updateComponent(dashboardId, containerId, componentId, { dynamicData })
  }

  const addDashboard = (newDashboard: DashboardData): void => {
    setGlobalStore((prev) => {
      if (!prev) return prev
      const currentDashboards = prev.projectConfig.dashboards || []
      return {
        ...prev,
        projectConfig: {
          ...prev.projectConfig,
          dashboards: [...currentDashboards, newDashboard]
        }
      }
    })
  }

  const contextValue: GlobalStoreContextType = {
    globalStore,
    updateAppConfig,
    updateProjectConfig,
    updateDashboard,
    updateContainer,
    updateComponent,
    updateDynamicData,
    addDashboard
  }

  return <GlobalStoreContext.Provider value={contextValue}>{children}</GlobalStoreContext.Provider>
}

export const useGlobalStore = (): GlobalStoreContextType => {
  const context = useContext(GlobalStoreContext)
  if (!context) {
    throw new Error('useGlobalStore deve ser usado dentro de um GlobalStoreProvider')
  }
  return context
}
