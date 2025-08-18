import { useState } from 'react';

export default function Dashboard() {
  // Settings state
  const [settings, setSettings] = useState({
    apiKey: '',
    darkMode: false,
    refreshInterval: 30
  });

  // Save to browser storage
  const saveSettings = () => {
    localStorage.setItem('pulseSettings', JSON.stringify(settings));
    alert('Settings saved!');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
        Platform Configuration
      </h1>

      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {/* API Key Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
            API Key
          </label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="Enter your API key"
          />
        </div>

        {/* Dark Mode Toggle */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
              style={{ marginRight: '8px' }}
            />
            Dark Mode
          </label>
        </div>

        {/* Refresh Interval */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
            Refresh Data Every (minutes)
          </label>
          <select
            value={settings.refreshInterval}
            onChange={(e) => setSettings({...settings, refreshInterval: e.target.value})}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="60">60</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
