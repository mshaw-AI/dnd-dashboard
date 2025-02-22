import React, { useState } from 'react';
import './App.css';

// Initial resources data with mutable values
const initialResourcesData = [
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
    bonus: { resource: 'Stone', value: 50 } // Stone production bonus
  },
  {
    name: 'Seraphina Brightwind',
    occupation: 'Priest/Medic',
    species: 'Half-Elf',
    age: 32,
    bonus: { resource: 'Gold (gp)', value: 30 } // Medicinal supplies bonus
  },
  {
    name: 'Marcellus Quillwright',
    occupation: 'Scribe',
    species: 'Human',
    age: 47,
    bonus: { resource: 'Lumber', value: -20 } // Improved logistics (reduces consumption)
  },
  {
    name: 'Tilda Brambleshanks',
    occupation: 'Chef',
    species: 'Halfling',
    age: 38,
    bonus: { resource: 'Gold (gp)', value: 20 } // Food morale boost
  },
  {
    name: 'Roderick Ledgerhart',
    occupation: 'Quartermaster',
    species: 'Human',
    age: 42,
    bonus: { resource: 'Lumber', value: -10 } // Reduces consumption by 10%
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('resources');
  const [currentMonth, setCurrentMonth] = useState(0);
  const [resources, setResources] = useState(initialResourcesData);

  // Function to simulate the passage of a month
  const stepMonth = () => {
    // Create a copy of resources to avoid mutating state directly
    const updatedResources = resources.map(resource => ({ ...resource }));

    // Apply worker bonuses to resources
    workersData.forEach(worker => {
      const resource = updatedResources.find(r => r.resource === worker.bonus.resource);
      if (resource) {
        resource.production += worker.bonus.value;
        resource.net = resource.production - resource.base;
      }
    });

    // Update the state with the new resource values
    setResources(updatedResources);
    setCurrentMonth(prevMonth => prevMonth + 1);
  };

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
          <p>Current Month: {currentMonth}</p>
          <button onClick={stepMonth}>Advance Month</button>
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
              {resources.map((row, idx) => (
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
                  <strong>Bonus:</strong> {worker.bonus.resource} {worker.bonus.value >= 0 ? '+' : ''}
                  {worker.bonus.value}
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
