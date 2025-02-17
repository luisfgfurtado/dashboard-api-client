// src/renderer/src/dashboard/useDashboardInstance.ts
import { useState, useEffect } from 'react'
import { DashboardData } from '../globalStore/GlobalStoreProvider'
import { DashboardInstanceManager } from './DashboardInstanceManager'

export function useDashboardInstance(manager: DashboardInstanceManager): DashboardData {
  const [dashboard, setDashboard] = useState<DashboardData>(manager.getDashboard())

  useEffect(() => {
    const subscriber = (updatedDashboard: DashboardData): void => {
      // Atualiza o estado; usamos uma cópia para garantir re-render
      setDashboard({ ...updatedDashboard })
    }
    manager.subscribe(subscriber)
    return (): void => {
      manager.unsubscribe(subscriber)
    }
  }, [manager])

  return dashboard
}
