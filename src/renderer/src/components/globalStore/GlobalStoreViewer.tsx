// src/renderer/src/components/globalStore/GlobalStoreViewer.tsx
import React from 'react'
import { useGlobalStore } from './'

const GlobalStoreViewer: React.FC = () => {
  const { state } = useGlobalStore()

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
      <section style={sectionStyle}>
        <h3>Auth</h3>
        <pre>{JSON.stringify(state.authSettings, null, 2)}</pre>
        <h3>Dashboards</h3>
        <pre>{JSON.stringify(state.dashboards, null, 2)}</pre>
      </section>
    </aside>
  )
}

export default GlobalStoreViewer
