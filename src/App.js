// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const resourcesData = [
  { resource: 'Gold (gp)', base: 500, production: 650, net: 150 },
  { resource: 'Lumber', base: 300, production: 250, net: -50 },
  { resource: 'Stone', base: 200, production: 300, net: 100 }
];

const workersData = [
  {
    name: 'Morrick Stoneshield',
    occupation: 'Stonemason',
    species: 'Mountain Dwarf',
    age: 65,
    bonus: 'Stone +50/month'
  },
  {
    name: 'Seraphina Brightwind',
    occupation: 'Priest/Medic',
    species: 'Half-Elf',
    age: 32,
    bonus: 'Medicinal supplies +30/month'
  },
  {
    name: 'Marcellus Quillwright',
    occupation: 'Scribe',
    species: 'Human',
    age: 47,
    bonus: 'Improved logistics'
  },
  {
    name: 'Tilda Brambleshanks',
    occupation: 'Chef',
    species: 'Halfling',
    age: 38,
    bonus: 'Food morale boost'
  },
  {
    name: 'Roderick Ledgerhart',
    occupation: 'Quartermaster',
    species: 'Human',
    age: 42,
    bonus: 'Reduces consumption by 10%'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('resources');

  // Example of integrating API calls:
  // useEffect(() => {
  //   fetch('/api/resources')
  //     .then(res => res.json())
  //     .then(data => setResources(data));
  // }, []);

  return (
    <div className="container">
      <h1>Base Management Dashboard</h1>
      <div className="tabs">
        <button
          onClick={() => setActiveTab('resources')}
          className={activeTab === 'resources' ? 'active' : ''}
        >
          Resources
        </button>
        <button
          onClick={() => setActiveTab('workers')}
          className={activeTab === 'workers' ? 'active' : ''}
        >
          Workers
        </button>
      </div>

      {activeTab === 'resources' && (
        <div className="resources">
          <h2>Resource Needs vs. Outputs</h2>
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Base Consumption</th>
                <th>Production / Output</th>
                <th>Net Result</th>
              </tr>
            </thead>
            <tbody>
              {resourcesData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.resource}</td>
                  <td>{row.base}</td>
                  <td>{row.production}</td>
                  <td className={row.net >= 0 ? 'positive' : 'negative'}>
                    {row.net >= 0 ? `+${row.net}` : row.net}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'workers' && (
        <div className="workers">
          <h2>Workers Overview</h2>
          <div className="worker-cards">
            {workersData.map((worker, idx) => (
              <div key={idx} className="worker-card">
                <h3>{worker.name}</h3>
                <p>
                  <strong>Occupation:</strong> {worker.occupation}
                </p>
                <p>
                  <strong>Species:</strong> {worker.species}
                </p>
                <p>
                  <strong>Age:</strong> {worker.age}
                </p>
                <p>
                  <strong>Bonus:</strong> {worker.bonus}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
