import React from 'react'
import { useGlobalStore } from './GlobalStoreProvider'

const GlobalStoreViewer: React.FC = () => {
  const { globalStore } = useGlobalStore()

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    right: 0,
    top: 0,
    width: '300px',
    height: '100vh',
    overflowY: 'auto',
    backgroundColor: '#f7f7f7',
    borderLeft: '1px solid #ccc',
    padding: '10px',
    boxSizing: 'border-box',
    fontSize: '0.9rem'
  }

  const sectionStyle: React.CSSProperties = {
    marginBottom: '20px'
  }

  return (
    <aside style={panelStyle}>
      <h2>Global Store</h2>
      {globalStore ? (
        <div>
          <section style={sectionStyle}>
            <h3>App Config</h3>
            <pre>{JSON.stringify(globalStore.appConfig, null, 2)}</pre>
          </section>
          <section style={sectionStyle}>
            <h3>Project Config</h3>
            <pre>{JSON.stringify(globalStore.projectConfig, null, 2)}</pre>
          </section>
        </div>
      ) : (
        <p>Carregando dados...</p>
      )}
    </aside>
  )
}

export default GlobalStoreViewer
