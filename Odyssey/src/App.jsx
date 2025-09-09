// src/App.js
import React from 'react';
import MonasteryLoader from './pages/MonasteryLoader';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sikkim Monasteries and Culture</h1>
      </header>
      <main>
        <MonasteryLoader />
      </main>
    </div>
  );
}

export default App;