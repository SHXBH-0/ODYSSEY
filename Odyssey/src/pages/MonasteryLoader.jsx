// src/components/MonasteryLoader.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Navigation from './Navigation';
import MonasteryGrid from './MonasteryGrid';
import MyCalendar from './calender';

function MonasteryLoader() {
  const [monasteries, setMonasteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('navigation'); // 'navigation' or 'grid'

  useEffect(() => {
    const loadCSV = async () => {
      try {
        const response = await fetch('/monasteries.csv');
        const csvText = await response.text();
        Papa.parse(csvText, {
          complete: (results) => {
            setMonasteries(results.data);
            setLoading(false);
          },
          header: true,
          skipEmptyLines: true
        });
      } catch (error) {
        console.error('Error loading CSV:', error);
        setLoading(false);
      }
    };

    loadCSV();
  }, []);

  if (loading) return <div>Loading monasteries...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setView('navigation')}>Navigation View</button>
        <button onClick={() => setView('grid')}>Monastery Grid</button>
        <button onClick={() => setView('calendar')}>Calendar View</button>
      </div>
      {view === 'navigation' ? (
        <Navigation monasteries={monasteries} />
      ) : view === 'grid' ? (
        <MonasteryGrid monasteries={monasteries} />
      ) : (
        <MyCalendar />
      )}
    </div>
  );
}

export default MonasteryLoader;