// src/components/MonasteryLoader.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import MonasteryGrid from './MonasteryGrid'; // You'll need this component too

function MonasteryLoader() {
  const [monasteries, setMonasteries] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
  
  return <MonasteryGrid monasteries={monasteries} />;
}

export default MonasteryLoader;
