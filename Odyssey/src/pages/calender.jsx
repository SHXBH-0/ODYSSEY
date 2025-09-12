import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calender.css';

const SikkimFestivalCalendar = () => {
  const [value, onChange] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Comprehensive list of Sikkim festivals and events for 2025
  const sikkimEvents = [
    // January
    { date: new Date(2025, 0, 1), name: "New Year's Day", category: "national", type: "Public Holiday", description: "National holiday celebrating the new year" },
    { date: new Date(2025, 0, 5), name: "Nyenpa Guzom", category: "buddhist", type: "Buddhist Festival", description: "Buddhist festival observed by the Lepcha community", location: "Monasteries across Sikkim" },
    { date: new Date(2025, 0, 14), name: "Maghe Sankranti", category: "hindu", type: "Hindu Festival", description: "Hindu festival marking the beginning of warmer weather, major celebration at Jorethang", location: "Jorethang, river confluences", highlights: "Jorethang Maghe Mela, holy baths at Tista-Rangit confluence" },
    { date: new Date(2025, 0, 17), name: "Red Panda Winter Carnival (Start)", category: "cultural", type: "Tourism Festival", description: "Sikkim's biggest cultural festival showcasing unity in diversity", location: "Gangtok (MG Marg, Titanic Park)", highlights: "9-day carnival, adventure sports, cultural parade, food festival" },
    { date: new Date(2025, 0, 25), name: "Red Panda Winter Carnival (End)", category: "cultural", type: "Tourism Festival", description: "Closing ceremonies of the winter carnival", location: "Gangtok", highlights: "Cultural shows, DJ nights, traditional cuisine" },
    { date: new Date(2025, 0, 26), name: "Republic Day", category: "national", type: "Public Holiday", description: "National holiday celebrating India's constitution" },
    { date: new Date(2025, 0, 30), name: "Sonam Lochar", category: "buddhist", type: "Tamang New Year", description: "Tamang community New Year celebration with Damphu dances", location: "Tamang settlements", highlights: "Traditional attire, masked dances, Tamang Selo folk songs" },

    // February
    { date: new Date(2025, 1, 28), name: "Losar (Tibetan New Year)", category: "buddhist", type: "Buddhist Festival", description: "Tibetan New Year celebration, harvest festival", location: "All Buddhist monasteries", highlights: "5-day celebration, Gutor Chaam at Rumtek, family gatherings" },

    // March
    { date: new Date(2025, 2, 2), name: "Losar Celebration (End)", category: "buddhist", type: "Buddhist Festival", description: "Final day of Losar celebrations", location: "Monasteries", highlights: "Traditional offerings, butter lamp lighting" },
    { date: new Date(2025, 2, 14), name: "Holi", category: "hindu", type: "Hindu Festival", description: "Festival of colors celebrated by Hindu communities" },

    // April
    { date: new Date(2025, 3, 15), name: "Saga Dawa (Start)", category: "buddhist", type: "Triple Blessed Festival", description: "Holiest Buddhist festival celebrating Buddha's birth, enlightenment, and nirvana", location: "All monasteries, especially Gangtok", highlights: "Month-long observance, processions, Om Mani Padme Hum chanting" },
    { date: new Date(2025, 3, 25), name: "Rhododendron Festival (Start)", category: "nature", type: "Flower Festival", description: "Celebration of Sikkim's 36+ rhododendron species in full bloom", location: "Barsey & Singba Rhododendron Sanctuaries, Yumthang Valley", highlights: "3-week festival, trekking, photography, nature walks" },

    // May
    { date: new Date(2025, 4, 1), name: "Kuzu Cultural Festival (Start)", category: "cultural", type: "50 Years Statehood Celebration", description: "Grand cultural festival celebrating 50 years of Sikkim statehood", location: "Manan Kendra, Gangtok", highlights: "10-day festival showcasing 21 ethnic communities" },
    { date: new Date(2025, 4, 10), name: "Kuzu Cultural Festival (End)", category: "cultural", type: "Statehood Celebration", description: "Closing of the statehood celebration festival", location: "Gangtok", highlights: "Cultural exchange, traditional performances" },
    { date: new Date(2025, 4, 12), name: "Buddha Purnima", category: "buddhist", type: "Buddha Jayanti", description: "Buddha's birth anniversary celebration", location: "All monasteries", highlights: "Butter lamp lighting, scripture reading, prayers" },
    { date: new Date(2025, 4, 14), name: "Rhododendron Festival (End)", category: "nature", type: "Flower Festival", description: "End of rhododendron blooming season celebration", location: "Mountain sanctuaries", highlights: "Peak blooming season concludes" },
    { date: new Date(2025, 4, 16), name: "Sikkim State Day", category: "state", type: "Statehood Day", description: "Celebration of Sikkim becoming India's 22nd state in 1975", location: "Throughout Sikkim", highlights: "Official ceremonies, cultural programs" },
    { date: new Date(2025, 4, 30), name: "International Flower Festival (Start)", category: "nature", type: "Flower Exhibition", description: "Month-long international flower and garden festival", location: "Flower Exhibition Center, White Hall Complex, Gangtok", highlights: "600+ orchid species, 46 rhododendron varieties, 240 tree species" },

    // June
    { date: new Date(2025, 5, 14), name: "Saga Dawa Duchen", category: "buddhist", type: "Full Moon Festival", description: "Climax of Saga Dawa month on full moon day", location: "Gangtok procession from Tsuk-La-Khang", highlights: "Grand procession, holy scripture carrying, community blessings" },
    { date: new Date(2025, 5, 30), name: "International Flower Festival (End)", category: "nature", type: "Flower Exhibition", description: "Conclusion of the international flower festival", location: "Gangtok", highlights: "Garden retail, botanical seminars, adventure sports" },

    // July
    { date: new Date(2025, 6, 13), name: "Bhanu Jayanti", category: "cultural", type: "Literary Festival", description: "Birth anniversary of Nepali poet Bhanubhakta Acharya", location: "Nepali communities", highlights: "Literary programs, cultural events honoring Nepali literature" },
    { date: new Date(2025, 6, 28), name: "Drukpa Tshechi", category: "buddhist", type: "Buddhist Festival", description: "Celebrates Buddha's first sermon at Deer Park, Sarnath", location: "Druk Sangag Choling Monastery, Muguthang", highlights: "Masked dances, yak races, religious rituals" },

    // August
    { date: new Date(2025, 7, 4), name: "Guru Rinpoche's Birthday", category: "buddhist", type: "Guru Padmasambhava Celebration", description: "Birth anniversary of Guru Padmasambhava, founder of Vajrayana Buddhism", location: "All monasteries, especially Nyingma", highlights: "Special prayers, teachings, spiritual ceremonies" },
    { date: new Date(2025, 7, 8), name: "Tendong Lho Rum Faat", category: "indigenous", type: "Lepcha Festival", description: "Ancient Lepcha festival honoring Mount Tendong for saving ancestors from flood", location: "Namchi, South Sikkim", highlights: "Trek from Ravangla to Tendong Hill, traditional ceremonies" },
    { date: new Date(2025, 7, 15), name: "Independence Day", category: "national", type: "Public Holiday", description: "National holiday celebrating India's independence" },

    // September
    { date: new Date(2025, 8, 6), name: "Indrajatra", category: "hindu", type: "Hindu Festival", description: "Festival honoring Lord Indra, god of rain and harvest", location: "Hindu communities", highlights: "Colorful processions, traditional dances, community celebrations" },
    { date: new Date(2025, 8, 18), name: "Pang Lhabsol", category: "unique", type: "Guardian Deity Festival", description: "Unique festival worshipping Mount Kanchenjunga as guardian deity", location: "Pemayangtse Monastery", highlights: "Masked Lama dances, Lepcha-Bhutia unity celebration, red deity with snow lion" },

    // October
    { date: new Date(2025, 9, 2), name: "Gandhi Jayanti", category: "national", type: "Public Holiday", description: "Mahatma Gandhi's birth anniversary" },
    { date: new Date(2025, 9, 12), name: "Durga Puja/Dasain (Start)", category: "hindu", type: "Hindu Festival", description: "Major Hindu festival celebrating victory of good over evil", location: "Hindu communities, colorful pandals", highlights: "10-day celebration, cultural performances, traditional rituals" },
    { date: new Date(2025, 9, 21), name: "Durga Puja/Dasain (End)", category: "hindu", type: "Hindu Festival", description: "Conclusion of Durga Puja festivities", highlights: "Vijaya Dashami celebrations" },

    // November
    { date: new Date(2025, 10, 1), name: "Diwali/Tihar (Start)", category: "hindu", type: "Festival of Lights", description: "5-day festival of lights, known as Tihar in Nepal regions", location: "Throughout Sikkim", highlights: "Kaag Tihar (crows), Kukur Tihar (dogs), Gai Tihar (cows), Bhai Tika" },
    { date: new Date(2025, 10, 5), name: "Diwali/Tihar (End)", category: "hindu", type: "Festival of Lights", description: "Final day with Bhai Tika celebrations" },
    { date: new Date(2025, 10, 11), name: "Lhabab Duechen", category: "buddhist", type: "Buddha's Descent Festival", description: "Commemorates Buddha's descent from Trayastrimsa heaven", location: "All monasteries", highlights: "Butter lamps, painted ladders on monastery rocks, special merit day" },
    { date: new Date(2025, 10, 23), name: "Sakewa", category: "indigenous", type: "Kirat Rai Festival", description: "Harvest festival of Kirat Khambu Rai community honoring Mother Earth", location: "Rai communities", highlights: "Bhumi Puja, community dances, drums and cymbals, nature worship" },

    // December
    { date: new Date(2025, 11, 4), name: "Puhgal Parim", category: "buddhist", type: "Buddhist Festival", description: "Buddhist festival observed in Sikkim monasteries" },
    { date: new Date(2025, 11, 10), name: "Losoong/Namsoong (Start)", category: "cultural", type: "Sikkimese New Year", description: "Traditional Sikkimese New Year and harvest festival", location: "Gangtok, Rumtek, Phodong monasteries", highlights: "4-day celebration, Chaam dances, traditional cuisine, archery" },
    { date: new Date(2025, 11, 13), name: "Losoong/Namsoong (End)", category: "cultural", type: "New Year Celebration", description: "Conclusion of Sikkimese New Year festivities", highlights: "Family gatherings, sel roti, tongba drinks" },
    { date: new Date(2025, 11, 15), name: "Teyongsi Sirijunga", category: "indigenous", type: "Limbu Festival", description: "Limbu community festival honoring legendary leader Sirijunga", location: "Limbu settlements", highlights: "Cultural performances, traditional music, community rituals" },
    { date: new Date(2025, 11, 18), name: "Kagyed Dance (Start)", category: "buddhist", type: "Masked Dance Festival", description: "Sacred masked dance performances symbolizing victory over evil", location: "Rumtek, Phodong monasteries, Tshuklakhang Palace", highlights: "3-day rigorous masked dances, Buddhist mythology enactment" },
    { date: new Date(2025, 11, 20), name: "Kagyed Dance (End)", category: "buddhist", type: "Masked Dance Festival", description: "Final day of Kagyed masked dance performances", highlights: "Burning of evil effigies, blessing ceremonies" },
    { date: new Date(2025, 11, 25), name: "Christmas", category: "christian", type: "Christian Festival", description: "Christmas celebration by Christian communities" },
    { date: new Date(2025, 11, 30), name: "Tamu Lochar", category: "indigenous", type: "Gurung New Year", description: "Gurung community New Year celebration", location: "Gurung settlements", highlights: "Traditional Gurung culture, folk dances" }
  ];

  // Helper function to check if dates are the same
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return sikkimEvents.filter(event => isSameDay(event.date, date));
  };

  // Filter events by category
  const getFilteredEvents = () => {
    if (filterCategory === 'all') return sikkimEvents;
    return sikkimEvents.filter(event => event.category === filterCategory);
  };

  // Get events for current month
  const getCurrentMonthEvents = () => {
    const currentMonth = value.getMonth();
    const currentYear = value.getFullYear();
    return sikkimEvents.filter(event => 
      event.date.getMonth() === currentMonth && 
      event.date.getFullYear() === currentYear
    );
  };

  const categoryColors = {
    buddhist: '#FF6B35',
    hindu: '#F7931E',
    cultural: '#8E44AD', 
    nature: '#27AE60',
    indigenous: '#E74C3C',
    national: '#3498DB',
    state: '#2ECC71',
    christian: '#9B59B6',
    unique: '#E67E22'
  };

  const categoryNames = {
    buddhist: 'Buddhist Festivals',
    hindu: 'Hindu Festivals', 
    cultural: 'Cultural Events',
    nature: 'Nature Festivals',
    indigenous: 'Indigenous Festivals',
    national: 'National Holidays',
    state: 'State Events',
    christian: 'Christian Festivals',
    unique: 'Unique to Sikkim'
  };

  return (
    <div className="sikkim-calendar-container">
      <div className="calendar-header">
        <h1>Sikkim Festivals & Events Calendar 2025</h1>
        <p>Discover the rich cultural tapestry of Sikkim through its vibrant festivals and celebrations</p>
      </div>

      <div className="calendar-controls">
        <div className="category-filters">
          <button 
            className={filterCategory === 'all' ? 'active' : ''}
            onClick={() => setFilterCategory('all')}
          >
            All Events
          </button>
          {Object.entries(categoryNames).map(([key, name]) => (
            <button
              key={key}
              className={filterCategory === key ? 'active' : ''}
              onClick={() => setFilterCategory(key)}
              style={{borderColor: categoryColors[key]}}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="calendar-main">
        <div className="calendar-section">
          <Calendar
            onChange={onChange}
            value={value}
            tileClassName={({ date, view }) => {
              if (view === 'month') {
                const events = getEventsForDate(date);
                const filteredEvents = filterCategory === 'all' ? events : events.filter(e => e.category === filterCategory);
                if (filteredEvents.length > 0) {
                  return `has-event ${filteredEvents[0].category}`;
                }
              }
            }}
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const events = getEventsForDate(date);
                const filteredEvents = filterCategory === 'all' ? events : events.filter(e => e.category === filterCategory);
                if (filteredEvents.length > 0) {
                  return <div className="event-dot">{filteredEvents.length}</div>;
                }
              }
            }}
            onClickDay={(date) => {
              const dayEvents = getEventsForDate(date);
              if (dayEvents.length > 0) {
                setSelectedEvent(dayEvents[0]);
              }
            }}
          />
        </div>

        <div className="events-sidebar">
          <h3>Events in {value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
          <div className="month-events">
            {getCurrentMonthEvents()
              .filter(event => filterCategory === 'all' || event.category === filterCategory)
              .sort((a, b) => a.date - b.date)
              .map((event, index) => (
              <div 
                key={index} 
                className={`event-card ${event.category}`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="event-date">
                  {event.date.getDate()}
                </div>
                <div className="event-info">
                  <h4>{event.name}</h4>
                  <span className="event-type">{event.type}</span>
                </div>
                <div 
                  className="event-category-dot" 
                  style={{backgroundColor: categoryColors[event.category]}}
                ></div>
              </div>
            ))}
            {getCurrentMonthEvents().filter(event => filterCategory === 'all' || event.category === filterCategory).length === 0 && (
              <p className="no-events">No events found for this month</p>
            )}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="event-modal" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedEvent(null)}>×</button>
            <div className="modal-header" style={{borderTopColor: categoryColors[selectedEvent.category]}}>
              <h2>{selectedEvent.name}</h2>
              <span className="event-category">{categoryNames[selectedEvent.category]}</span>
            </div>
            <div className="modal-body">
              <div className="event-details">
                <p><strong>Date:</strong> {selectedEvent.date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p><strong>Type:</strong> {selectedEvent.type}</p>
                {selectedEvent.location && (
                  <p><strong>Location:</strong> {selectedEvent.location}</p>
                )}
                <p><strong>Description:</strong> {selectedEvent.description}</p>
                {selectedEvent.highlights && (
                  <p><strong>Highlights:</strong> {selectedEvent.highlights}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="legend">
        <h4>Festival Categories</h4>
        <div className="legend-items">
          {Object.entries(categoryNames).map(([key, name]) => (
            <div key={key} className="legend-item">
              <div 
                className="legend-color" 
                style={{backgroundColor: categoryColors[key]}}
              ></div>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SikkimFestivalCalendar;
