import React, { useState, useEffect } from 'react';
import './App.css';

// D&D Fantasy Months
const fantasyMonths = [
  'Hammer', 'Alturiak', 'Ches', 'Tarsakh', 'Mirtul', 'Kythorn',
  'Flamerule', 'Eleasis', 'Eleint', 'Marpenoth', 'Uktar', 'Nightal'
];

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
    bonus: { resource: 'Stone', value: 50 }
  },
  {
    name: 'Seraphina Brightwind',
    occupation: 'Priest/Medic',
    species: 'Half-Elf',
    age: 32,
    bonus: { resource: 'Gold (gp)', value: 30 }
  },
  {
    name: 'Marcellus Quillwright',
    occupation: 'Scribe',
    species: 'Human',
    age: 47,
    bonus: { resource: 'Lumber', value: -20 }
  },
  {
    name: 'Tilda Brambleshanks',
    occupation: 'Chef',
    species: 'Halfling',
    age: 38,
    bonus: { resource: 'Gold (gp)', value: 20 }
  },
  {
    name: 'Roderick Ledgerhart',
    occupation: 'Quartermaster',
    species: 'Human',
    age: 42,
    bonus: { resource: 'Lumber', value: -10 }
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('resources');
  const [currentYear, setCurrentYear] = useState(0); // Start at Year 0
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // Start at Hammer (index 0)
  const [resources, setResources] = useState(initialResourcesData);

  // Get the current month name
  const currentMonth = fantasyMonths[currentMonthIndex];

  // Fetch resources for the current month when the component mounts or the month changes
  useEffect(() => {
    fetch(`http://localhost:5000/api/resources/${currentYear}/${currentMonth}`)
      .then(res => {
        if (!res.ok) return [];
        return res.json();
      })
      .then(data => {
        if (data.length > 0) {
          setResources(data);
        } else {
          setResources(initialResourcesData);
        }
      })
      .catch(err => console.error('Error fetching resources:', err));
  }, [currentYear, currentMonth]);

  // Function to simulate the passage of a month
  const stepMonth = (direction) => {
    let newYear = currentYear;
    let newMonthIndex = currentMonthIndex;

    if (direction === 'next') {
      newMonthIndex += 1;
      if (newMonthIndex >= fantasyMonths.length) {
        newMonthIndex = 0;
        newYear += 1;
      }
    } else if (direction === 'prev') {
      newMonthIndex -= 1;
      if (newMonthIndex < 0) {
        newMonthIndex = fantasyMonths.length - 1;
        newYear -= 1;
      }
    }

    // Prevent going before Year 0
    if (newYear < 0) {
      alert('Cannot go before Year 0');
      return;
    }

    setCurrentYear(newYear);
    setCurrentMonthIndex(newMonthIndex);
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
          <p>Month: {currentMonth} Year: {currentYear}</p>
          <div className="month-controls">
            <button onClick={() => stepMonth('prev')}>Previous Month</button>
            <button onClick={() => stepMonth('next')}>Next Month</button>
          </div>
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
