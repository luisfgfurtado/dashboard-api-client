// src/renderer/src/container/ContainerManager.ts
import { ContainerData, ComponentDefinition } from '../globalStore/'

export class ContainerManager {
  private container: ContainerData

  constructor(container: ContainerData) {
    this.container = container
  }

  // Retorna a lista de componentes (endpoints) do container
  public listComponents(): ComponentDefinition[] {
    return this.container.components.map((comp) => comp.componentDefinition)
  }

  // Dentro de ContainerManager.ts
  public updateTitle(newTitle: string): void {
    this.container.containerSettings.title = newTitle
  }

  // Adiciona um novo endpoint (componente) ao container
  public addEndpoint(newComponentData: Partial<ComponentDefinition>): void {
    const newComponent: ComponentDefinition = {
      id: `component-${Date.now()}`,
      endpointUrl: newComponentData.endpointUrl || '/new-endpoint',
      verb: newComponentData.verb || 'GET',
      type: newComponentData.type || 'Text',
      order: this.container.components.length + 1,
      pinned: newComponentData.pinned ?? false,
      otherSettings: newComponentData.otherSettings || {}
    }
    this.container.components.push({ componentDefinition: newComponent })
  }

  // Atualiza um endpoint existente com novos dados
  public updateEndpoint(componentId: string, newData: Partial<ComponentDefinition>): void {
    const index = this.container.components.findIndex(
      (comp) => comp.componentDefinition.id === componentId
    )
    if (index !== -1) {
      this.container.components[index].componentDefinition = {
        ...this.container.components[index].componentDefinition,
        ...newData
      }
    }
  }

  // Remove um endpoint com base no seu ID
  public deleteEndpoint(componentId: string): void {
    this.container.components = this.container.components.filter(
      (comp) => comp.componentDefinition.id !== componentId
    )
  }

  // Atualiza a definição da API do container
  public importAPIDefinition(apiDefinition: any): void {
    this.container.containerSettings.apiDefinition = apiDefinition
    // Sincronize essa alteração com o estado global se necessário.
  }
}
