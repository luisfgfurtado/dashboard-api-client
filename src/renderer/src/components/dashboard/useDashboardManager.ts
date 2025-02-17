// src/renderer/src/dashboard/useDashboardManager.ts
import { useEffect, useState } from 'react'
import DashboardManager from './DashboardManager'
import { DashboardData } from '../globalStore/GlobalStoreProvider'

export function useDashboardManager(): DashboardData[] {
  const [dashboards, setDashboards] = useState<DashboardData[]>(DashboardManager.getList())

  useEffect(() => {
    const subscriber = (newDashboards: DashboardData[]): void => setDashboards(newDashboards)
    DashboardManager.subscribe(subscriber)
    return (): void => {
      DashboardManager.unsubscribe(subscriber)
    }
  }, [])

  return dashboards
}
