// src/renderer/src/dashboard/DashboardInstanceManager.ts
import { DashboardData, ContainerData } from '../globalStore/GlobalStoreProvider'

export class DashboardInstanceManager {
  private dashboard: DashboardData
  private subscribers: Array<(dashboard: DashboardData) => void> = []

  constructor(dashboard: DashboardData) {
    this.dashboard = dashboard
  }

  // Permite subscrever para ser notificado quando o dashboard mudar
  public subscribe(callback: (dashboard: DashboardData) => void): void {
    this.subscribers.push(callback)
  }

  public unsubscribe(callback: (dashboard: DashboardData) => void): void {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback)
  }

  private notify(): void {
    // Notifica todos os assinantes com o dashboard atualizado
    this.subscribers.forEach((cb) => cb(this.dashboard))
  }

  // Lista os containers do dashboard
  public listContainers(): ContainerData[] {
    return this.dashboard.containers
  }

  // Adiciona um novo container e notifica os assinantes
  public addContainer(newContainer: ContainerData): void {
    this.dashboard.containers.push(newContainer)
    this.notify()
  }

  // Remove um container pelo ID e notifica os assinantes
  public removeContainer(containerId: string): void {
    this.dashboard.containers = this.dashboard.containers.filter(
      (container) => container.containerSettings.id !== containerId
    )
    this.notify()
  }

  // Atualiza um container e notifica os assinantes
  public updateContainer(containerId: string, updatedData: Partial<ContainerData>): void {
    this.dashboard.containers = this.dashboard.containers.map((container) => {
      if (container.containerSettings.id === containerId) {
        return { ...container, ...updatedData }
      }
      return container
    })
    this.notify()
  }

  // Método para atualizar o título do dashboard
  public updateTitle(newTitle: string): void {
    this.dashboard.dashboardSettings.title = newTitle
    this.notify()
  }

  // Retorna o dashboard atual (pode ser usado para persistência, etc.)
  public getDashboard(): DashboardData {
    return this.dashboard
  }
}
