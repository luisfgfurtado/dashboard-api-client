// src/renderer/src/dashboard/DashboardManager.ts
import { DashboardData } from '../globalStore/GlobalStoreProvider'

type Subscriber = (dashboards: DashboardData[]) => void

class DashboardManager {
  private dashboards: DashboardData[] = []
  private subscribers: Subscriber[] = []

  // Retorna uma cópia da lista atual de dashboards.
  public getList(): DashboardData[] {
    return [...this.dashboards]
  }

  // Permite que componentes se inscrevam para receber atualizações.
  public subscribe(callback: Subscriber): void {
    this.subscribers.push(callback)
  }

  public unsubscribe(callback: Subscriber): void {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback)
  }

  // Notifica todos os inscritos sempre que a lista for atualizada.
  private notify(): void {
    const listCopy = this.getList()
    this.subscribers.forEach((cb) => cb(listCopy))
  }

  // Adiciona um novo dashboard à lista e notifica os inscritos.
  public add(newDashboard: DashboardData): void {
    this.dashboards.push(newDashboard)
    this.notify()
  }

  // Remove um dashboard pela ID e notifica os inscritos.
  public remove(dashboardId: string): void {
    this.dashboards = this.dashboards.filter((d) => d.dashboardSettings.id !== dashboardId)
    this.notify()
  }

  // Cria e adiciona um novo dashboard. Retorna o dashboard criado.
  public newDashboard(): DashboardData {
    const newDashboardId = `dashboard-${Date.now()}`
    const newDashboard: DashboardData = {
      dashboardSettings: {
        id: newDashboardId,
        title: 'Novo Dashboard',
        layout: 'grid'
      },
      containers: []
    }
    this.add(newDashboard)
    return newDashboard
  }
}

// Exporta a instância única (singleton)
export default new DashboardManager()
