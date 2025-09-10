import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calender.css';

const importantDates = [
  new Date(2025, 8, 10), // Sept 10, 2025 (month is 0-indexed)
  new Date(2025, 8, 15),
  new Date(2025, 9, 2)
];

function isSameDay(a, b) {
  return a.getDate() === b.getDate() &&
         a.getMonth() === b.getMonth() &&
         a.getFullYear() === b.getFullYear();
}
function MyCalendar() {
  const [value, onChange] = useState(new Date());
  return (
    <Calendar
      onChange={onChange}
      value={value}
      tileClassName={({ date, view }) => {
        if (
          view === 'month' &&
          importantDates.find(d => isSameDay(d, date))
        ) {
          return 'highlight';
        }
      }}
    />
  );
}

export default MyCalendar;
