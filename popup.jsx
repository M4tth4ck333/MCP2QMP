import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

function ColabQMPApp() {
  const [queryPath, setQueryPath] = useState('client.q.status.running');
  const [result, setResult] = useState('Bereit für Dunder-Abfrage...');
  const [isConnected, setIsConnected] = useState(false);

  // Verbindung zum lokalen Kontext / Gateway prüfen
  useEffect(() => {
    // Hier wird die Brücke zur Python-Laufzeit (ContextForge / QMP) simuliert
    setIsConnected(true);
  }, []);

  const handleExecuteQuery = () => {
    setResult(`Führe aus: ${queryPath} ... [SystemT OK]`);
    // Hier greift später die Brücke zur Python Dunder-DSL
  };

  return (
    <div style={{ width: '320px', padding: '16px', fontFamily: 'monospace', background: '#1e1e1e', color: '#d4d4d4', boxSizing: 'border-box' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#4ec9b0', fontSize: '14px' }}>MCP2QMP // Colab Bridge</h3>
      
      <div style={{ fontSize: '11px', marginBottom: '12px', color: isConnected ? '#b5cea8' : '#f44747' }}>
        Status: {isConnected ? '● Gateway Verbunden' : '○ Getrennt'}
      </div>

      <label style={{ fontSize: '11px', color: '#9cdcfe' }}>Dunder-DSL Query:</label>
      <input 
        type="text" 
        value={queryPath} 
        onInput={(e) => setQueryPath(e.target.value)}
        style={{ width: '100%', background: '#2d2d2d', color: '#fff', border: '1px solid #444', padding: '6px', margin: '4px 0 10px 0', borderRadius: '3px', boxSizing: 'border-box', fontSize: '12px' }}
      />

      <button 
        onClick={handleExecuteQuery}
        style={{ width: '100%', padding: '8px', background: '#0e639c', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Query ausführen
      </button>

      <div style={{ marginTop: '12px' }}>
        <span style={{ fontSize: '11px', color: '#858585' }}>Ergebnis:</span>
        <pre style={{ background: '#252526', padding: '8px', border: '1px solid #333', borderRadius: '3px', fontSize: '11px', overflowX: 'auto', margin: '4px 0 0 0', color: '#ce9178' }}>
          {result}
        </pre>
      </div>
    </div>
  );
}

render(<ColabQMPApp />, document.getElementById('app'));
