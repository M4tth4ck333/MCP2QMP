import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

function Popup() {
  const [count, setCount] = useState(0);
  const [currentTabUrl, setCurrentTabUrl] = useState('');

  useEffect(() => {
    // Aktuelle Tab-URL über die Chrome Extensions API auslesen
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentTabUrl(tabs[0].url);
      }
    });
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Preact Extension</h2>
      <p style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
        Aktuelle Seite: {currentTabUrl}
      </p>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={() => setCount(count + 1)}
          style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Klicks: {count}
        </button>
      </div>
    </div>
  );
}

render(<Popup />, document.getElementById('app'));
