// src/components/MonasteryGrid.js

import React, { useState, useMemo } from 'react';
import './MonasteryGrid.css'; // Make sure to create/style this CSS file

function getStatusClass(status) {
  if (!status) return 'status-active';
  const lower = status.toLowerCase();
  if (lower.includes('heritage')) return 'status-heritage';
  if (lower.includes('inactive')) return 'status-inactive';
  return 'status-active';
}

function getRegion(location) {
  if (!location) return '';
  const str = location.toLowerCase();
  if (str.includes('east')) return 'East Sikkim';
  if (str.includes('west')) return 'West Sikkim';
  if (str.includes('north')) return 'North Sikkim';
  if (str.includes('south')) return 'South Sikkim';
  return '';
}

function MonasteryCard({ monastery }) {
  const [expanded, setExpanded] = useState(false);
  const description = monastery['Historical Background'] || '';
  const shouldTruncate = description.length > 250;
  const displayDescription =
    expanded || !shouldTruncate
      ? description
      : `${description.substring(0, 250)}...`;

  const features =
    monastery['Architectural Features']?.split(',').map(v => v.trim()).filter(Boolean) || [];
  const festivals =
    monastery['Festivals']?.split(',').map(v => v.trim()).filter(Boolean) || [];

  return (
    <div className="monastery-card">
      <div className="monastery-header">
        <h3>{monastery['Monastery Name'] || <i>No name</i>}</h3>
        <span className={`status-badge ${getStatusClass(monastery['Current Status'])}`}>
          {monastery['Current Status']}
        </span>
      </div>
      <div className="monastery-meta">
        <span>
          <b>📍 {monastery.Location || 'Unknown'}</b>{' '}
          {getRegion(monastery.Location) && (
            <span className="region-badge">{getRegion(monastery.Location)}</span>
          )}
        </span>
        {monastery['GPS Coordinates'] && (
          <span style={{ marginLeft: 10, fontSize: '0.92em' }}>🗺️ {monastery['GPS Coordinates']}</span>
        )}
      </div>
      <div style={{ margin: '10px 0' }}>
        <b>Year:</b> {monastery['Year Established'] || 'Unknown'}<br />
        <b>Founder/Lineage:</b> {monastery['Founder/Lineage'] || 'Unknown'}
      </div>
      <div className="monastery-description">
        <b>History:</b> {displayDescription}
        {shouldTruncate && (
          <button className="expand-btn" onClick={() => setExpanded(e => !e)}>
            {expanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>
      {features.length > 0 && (
        <div>
          <b>Architecture:</b>
          <ul>
            {features.map((f, idx) => (
              <li key={idx}>{f}</li>
            ))}
          </ul>
        </div>
      )}
      {festivals.length > 0 && (
        <div>
          <b>Festivals:</b> {festivals.slice(0, 5).join(', ')}
        </div>
      )}
      <div className="reference-row">
        {monastery.Reference && (
          <a
            href={
              monastery.Reference.startsWith('http')
                ? monastery.Reference
                : `https://${monastery.Reference}`
            }
            target="_blank" rel="noopener noreferrer"
          >
            Reference 🔗
          </a>
        )}
      </div>
    </div>
  );
}

function MonasteryGrid({ monasteries }) {
  // Search and filter state
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  // Search/filter logic
  const filtered = useMemo(() => {
    let data = monasteries;
    // Search
    if (search) {
      data = data.filter(m =>
        (
          (m['Monastery Name'] || '') +
          (m.Location || '') +
          (m['Founder/Lineage'] || '')
        )
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }
    // Region filter
    if (region) {
      data = data.filter(m => getRegion(m.Location) === region);
    }
    return data;
  }, [monasteries, search, region]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Unique region dropdown values
  const regionOpts = useMemo(() => {
    const set = new Set();
    monasteries.forEach(m => {
      const reg = getRegion(m.Location);
      if (reg) set.add(reg);
    });
    return Array.from(set);
  }, [monasteries]);

  return (
    <div>
      <div className="grid-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search monasteries, founders..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="region-select"
          value={region}
          onChange={e => {
            setRegion(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Regions</option>
          {regionOpts.map(reg => (
            <option key={reg} value={reg}>{reg}</option>
          ))}
        </select>
      </div>

      <div className="paged-info">
        Showing {paged.length} of {filtered.length} monasteries
      </div>

      <div className="monastery-grid">
        {paged.map((m, idx) => (
          <MonasteryCard key={m['Monastery Name'] || idx} monastery={m} />
        ))}
      </div>

      <div className="pagination-bar">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-indicator">
          Page {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MonasteryGrid;
