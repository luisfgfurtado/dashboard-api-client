// src/renderer/src/container/ContainerManager.ts
import { ContainerData, ComponentDefinition } from '../globalStore/GlobalStoreProvider'

export class ContainerManager {
  private container: ContainerData

  constructor(container: ContainerData) {
    this.container = container
  }

  // Retorna a lista de componentes (endpoints) do container
  public listComponents(): ComponentDefinition[] {
    return this.container.components.map((comp) => comp.componentDefinition)
  }

  // Adiciona um novo endpoint (componente) ao container
  public addEndpoint(): void {
    const newComponent: ComponentDefinition = {
      id: `component-${Date.now()}`,
      endpointUrl: '/new-endpoint',
      verb: 'GET',
      type: 'Button', // ou 'List', 'ComboSelect' conforme a necessidade
      order: this.container.components.length + 1,
      pinned: false,
      otherSettings: {}
    }

    // Adiciona o novo componente ao array de componentes do container
    this.container.components.push({ componentDefinition: newComponent })
    // Em uma aplicação real, aqui você acionaria a atualização do estado global.
  }

  // Atualiza a definição da API do container
  public importAPIDefinition(apiDefinition: any): void {
    this.container.containerSettings.apiDefinition = apiDefinition
    // Aqui também você sincronizaria essa alteração com o estado global, se necessário.
  }
}
