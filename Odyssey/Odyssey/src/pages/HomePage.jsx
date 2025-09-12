import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import './HomePage.css';


const SpiritualHomepage = () => {
  const [currentBlessing, setCurrentBlessing] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  const blessings = [
    "May your journey through Sikkim bring you peace and enlightenment",
    "Experience the sacred mountains and blessed valleys of Demojong",
    "Discover the ancient wisdom preserved in our monasteries",
    "Walk in the footsteps of spiritual masters and find inner tranquility"
  ];

  useEffect(() => {
    setShowWelcome(true);
    const interval = setInterval(() => {
      setCurrentBlessing((prev) => (prev + 1) % blessings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const spiritualPages = [
    {
      id: 'monasteries',
      title: 'Sacred Monasteries',
      subtitle: 'Gompas of Enlightenment',
      description: 'Journey through the holy monasteries where ancient wisdom meets divine tranquility. Navigate to sacred sites with real-time guidance.',
      mantra: 'Om Mani Padme Hum',
      icon: '🏯',
      route: '/monasteries-navigation',
      color: '#D2691E',
      blessing: 'May the Three Jewels guide your path'
    },
    {
      id: 'heritage',
      title: 'Sacred Heritage',
      subtitle: 'Manuscripts, Murals & Texts',
      description: 'Explore the precious manuscripts, divine murals, and sacred texts that preserve the spiritual wisdom of Sikkim.',
      mantra: 'Om Ah Hum Vajra Guru Padma Siddhi Hum',
      icon: '📜',
      route: '/cultural-heritage',
      color: '#8B4513',
      blessing: 'May ancient wisdom illuminate your mind'
    },
    {
      id: 'festivals',
      title: 'Sacred Calendar',
      subtitle: 'Festivals & Holy Days',
      description: 'Witness the celestial calendar of festivals, ceremonies, and auspicious occasions throughout the sacred land of Sikkim.',
      mantra: 'Gate Gate Paragate Parasamgate Bodhi Svaha',
      icon: '🗓️',
      route: '/festival-calendar',
      color: '#CD853F',
      blessing: 'May every moment be blessed with joy'
    },
    {
      id: 'general-calendar',
      title: 'Blessed Days',
      subtitle: 'Hindu & Buddhist Observances',
      description: 'Honor the sacred days with our comprehensive calendar featuring Hindu festivals and Buddhist holy days.',
      mantra: 'Sarve Bhavantu Sukhinah',
      icon: '📅',
      route: '/general-calendar',
      color: '#A0522D',
      blessing: 'May all beings be happy and peaceful'
    }
  ];

  return (
    <div className="spiritual-homepage">
      {/* Sacred Header */}
      <header className="sacred-header">
        <div className="prayer-flags"></div>
        <div className="header-content">
          <div className={`main-title ${showWelcome ? 'animate-in' : ''}`}>
            <h1 className="sacred-title">
              <span className="title-sanskrit">🕉️</span>
              Sikkim Spiritual Journey
              <span className="title-sanskrit">☸️</span>
            </h1>
            <h2 className="subtitle">བདེ་མོ་ཇོང་ • Demojong • The Hidden Valley of Peace</h2>
          </div>
          
          <div className="blessing-carousel">
            <p className="blessing-text">{blessings[currentBlessing]}</p>
          </div>

          <div className="sacred-symbols">
            <span className="symbol">🙏</span>
            <span className="divider">•</span>
            <span className="symbol">☸️</span>
            <span className="divider">•</span>
            <span className="symbol">🕉️</span>
            <span className="divider">•</span>
            <span className="symbol">⚡</span>
          </div>
        </div>
        <div className="sacred-mountain-bg"></div>
      </header>

      {/* Sacred Navigation */}
      <main className="sacred-main">
        <div className="spiritual-intro">
          <h3 className="intro-title">Begin Your Sacred Journey</h3>
          <p className="intro-text">
            Welcome to the mystical land of Sikkim, where every mountain peak touches the heavens, 
            every monastery echoes with ancient prayers, and every festival celebrates the divine. 
            Choose your path of spiritual discovery.
          </p>
        </div>

        <div className="spiritual-grid">
          {spiritualPages.map((page, index) => (
            <div 
              key={page.id} 
              className={`spiritual-card card-${index + 1}`}
              style={{'--card-color': page.color}}
            >
              <div className="card-header">
                <div className="card-icon">{page.icon}</div>
                <div className="card-titles">
                  <h3 className="card-title">{page.title}</h3>
                  <h4 className="card-subtitle">{page.subtitle}</h4>
                </div>
              </div>
              
              <div className="card-content">
                <p className="card-description">{page.description}</p>
                
                <div className="mantra-section">
                  <p className="mantra-label">Sacred Mantra:</p>
                  <p className="mantra-text">{page.mantra}</p>
                </div>
                
                <div className="blessing-section">
                  <p className="blessing-text">{page.blessing}</p>
                </div>
              </div>
              
              <div className="card-footer">
                <Link to={page.route} className="sacred-button">
                  <span>Begin Sacred Journey</span>
                  <span className="button-icon">🚪</span>
                </Link>
              </div>
              
              <div className="card-border-glow"></div>
            </div>
          ))}
        </div>

        {/* Sacred Footer */}
        <footer className="sacred-footer">
          <div className="footer-content">
            <div className="sacred-quote">
              <p className="quote-text">
                "Just as a thousand candles can be lit from one candle, and the life of the candle will not be shortened, 
                happiness is never decreased by being shared."
              </p>
              <p className="quote-author">- Buddha</p>
            </div>
            
            <div className="prayer-wheel">
              <div className="wheel-outer">
                <div className="wheel-inner">
                  <span className="wheel-mantra">ॐ मणि पद्मे हूँ</span>
                </div>
              </div>
            </div>
            
            <div className="dedication">
              <p>May all sentient beings find peace, happiness, and liberation from suffering</p>
              <div className="dedication-symbols">
                <span>🙏</span> <span>☸️</span> <span>🕉️</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default SpiritualHomepage;
