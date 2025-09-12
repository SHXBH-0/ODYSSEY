import React, { useState } from 'react';
import './Cultural.css';

const CulturalHeritageData = () => {
  const [selectedCategory, setSelectedCategory] = useState('manuscripts');
  const [searchTerm, setSearchTerm] = useState('');

  // Manuscripts data
  const manuscripts = [
    {
      name: "Lepcha Namtho-Naamthaar",
      script: "Róng (Lepcha Script)",
      period: "17th-18th Century",
      description: "Ancient Lepcha manuscripts written in the indigenous Róng script, containing creation myths, nature worship practices, and traditional folklore",
      significance: "Repository of indigenous Lepcha culture and pre-Buddhist animistic traditions",
      location: "Leiden University (largest collection), local monasteries",
      language: "Lepcha/Róng",
      content: "Creation stories, medicinal knowledge, tribal governance, cosmology"
    },
    {
      name: "Namthars (Spiritual Biographies)",
      script: "Tibetan",
      period: "8th-17th Century",
      description: "Biographical accounts of important spiritual figures including Lamas and Rinpoches",
      significance: "Documents the lives of significant Buddhist teachers in Sikkim",
      location: "Pemayangtse, Tashiding monasteries",
      language: "Classical Tibetan",
      content: "Life of Lhatsun Chenpo, monastery establishment records"
    },
    {
      name: "Chos-rTsa-ba (Religious Histories)",
      script: "Tibetan",
      period: "8th-17th Century", 
      description: "Religious historical texts documenting the spread of Buddhism in Sikkim",
      significance: "Chronicles the interaction between indigenous beliefs and Buddhist practices",
      location: "Major monasteries across Sikkim",
      language: "Classical Tibetan",
      content: "Buddhist establishment, sacred site construction, cultural synthesis"
    },
    {
      name: "Royal Chronicles of Namgyal Dynasty",
      script: "Tibetan",
      period: "1642 onwards",
      description: "Genealogical records and political history of Sikkim's royal families",
      significance: "Documents the establishment of Buddhist kingdom in 1642",
      location: "Palace archives, Tsuk La Khang",
      language: "Classical Tibetan",
      content: "Royal genealogies, political treaties, administrative records"
    },
    {
      name: "Dejong Ney-yig",
      script: "Tibetan",
      period: "14th-15th Century",
      description: "Sacred guidebook describing Sikkim as a hidden valley blessed by Guru Padmasambhava",
      significance: "Establishes Sikkim as Bayul-Demozong (hidden valley of rice)",
      location: "Rumtek, Pemayangtse monasteries",
      language: "Classical Tibetan",
      content: "Sacred geography, prophecies, spiritual instructions"
    },
    {
      name: "Ter-ma (Treasure Texts)",
      script: "Tibetan",
      period: "8th Century onwards (discovered later)",
      description: "Hidden spiritual treasures concealed by Guru Padmasambhava and rediscovered by Tertons",
      significance: "Contains esoteric Buddhist teachings and practices",
      location: "Tashiding, various monasteries",
      language: "Classical Tibetan",
      content: "Meditation practices, ritual instructions, prophecies"
    }
  ];

  // Murals data  
  const murals = [
    {
      name: "Wheel of Life (Bhavachakra)",
      monastery: "Multiple monasteries",
      period: "17th-20th Century",
      description: "Large wall paintings depicting the Buddhist concept of existence and rebirth",
      technique: "Natural pigments on clay walls with gypsum coating",
      significance: "Essential Buddhist teaching tool found at monastery entrances",
      themes: "Six realms of existence, karma, liberation path",
      location: "Rumtek, Pemayangtse, Tashiding"
    },
    {
      name: "Guru Padmasambhava Murals",
      monastery: "Various Nyingma monasteries",
      period: "8th Century depictions, painted later",
      description: "Wall paintings of Guru Rinpoche in various manifestations",
      technique: "Traditional thangka-style painting on walls",
      significance: "Honors the founder of Vajrayana Buddhism in the Himalayas",
      themes: "Eight manifestations, tantric teachings, blessing of Sikkim",
      location: "Pemayangtse, Sangachoeling, Dubdi"
    },
    {
      name: "Tantric Deity Murals",
      monastery: "Rumtek, Pemayangtse",
      period: "17th-20th Century",
      description: "Complex wall paintings of Buddhist tantric deities and mandalas",
      technique: "Mineral pigments, gold leaf application",
      significance: "Support advanced meditation and ritual practices",
      themes: "Protective deities, dakinis, mandala cosmology",
      location: "Main prayer halls, private chapels"
    },
    {
      name: "Jataka Tale Murals",
      monastery: "Enchey, Gangtok monasteries",
      period: "19th-20th Century",
      description: "Narrative wall paintings depicting Buddha's previous lives",
      technique: "Sequential storytelling format",
      significance: "Teaching aids for Buddhist moral and ethical instruction",
      themes: "Buddha's past lives, karma, moral lessons",
      location: "Monastery corridors, assembly halls"
    },
    {
      name: "Kanchenjunga Deity Paintings",
      monastery: "Pemayangtse, Tashiding",
      period: "17th Century onwards",
      description: "Murals depicting the sacred mountain as a protective deity",
      technique: "Traditional Tibetan style with local elements",
      significance: "Synthesis of indigenous mountain worship with Buddhism",
      themes: "Mountain deity worship, local protective spirits",
      location: "Main temples, shrine rooms"
    },
    {
      name: "Nine Chakra Ceiling Paintings",
      monastery: "Various prayer halls",
      period: "18th-19th Century",
      description: "Elaborate ceiling murals representing cosmic energy centers",
      technique: "Geometric patterns, symbolic colors",
      significance: "Advanced tantric meditation support",
      themes: "Energy centers, spiritual transformation",
      location: "Central sections of monastery prayer halls"
    }
  ];

  // Religious texts data
  const religiousTexts = [
    {
      name: "Kanjur (Buddha's Teachings)",
      volumes: "108 volumes",
      script: "Tibetan",
      period: "8th Century (translated later)",
      description: "Complete collection of Buddha's direct teachings translated into Tibetan",
      significance: "Primary Buddhist scripture collection in Sikkim monasteries",
      content: "Sutras, Vinaya, Abhidharma",
      location: "Rumtek, Pemayangtse, major monasteries",
      preservation: "Wooden block prints, manuscript copies"
    },
    {
      name: "Tenjur (Commentarial Literature)",  
      volumes: "Over 200 volumes",
      script: "Tibetan",
      period: "8th-17th Century",
      description: "Commentaries and treatises by Indian and Tibetan masters",
      significance: "Scholarly foundation for Buddhist studies in Sikkim",
      content: "Philosophical treatises, ritual manuals, medical texts",
      location: "Major monastic libraries",
      preservation: "Traditional manuscript form, some printed editions"
    },
    {
      name: "Nyingma Tantras",
      volumes: "Multiple collections",
      script: "Tibetan",
      period: "8th Century onwards",
      description: "Esoteric Buddhist texts of the Nyingma school",
      significance: "Foundation of Sikkimese Buddhism (oldest school)",
      content: "Dzogchen teachings, ritual practices, deity yoga",
      location: "Pemayangtse, Tashiding, Dubdi",
      preservation: "Carefully guarded monastery collections"
    },
    {
      name: "Kagyu Texts",
      volumes: "Extensive collections",
      script: "Tibetan", 
      period: "11th Century onwards",
      description: "Meditation and philosophical texts of the Kagyu school",
      significance: "Second major Buddhist school in Sikkim",
      content: "Mahamudra teachings, Six Yogas of Naropa",
      location: "Rumtek, Ralong, Phodong",
      preservation: "Rumtek maintains complete collections"
    },
    {
      name: "Bon Texts",
      volumes: "Limited collections",
      script: "Tibetan",
      period: "Pre-Buddhist, written later",
      description: "Ancient Bon religion texts preserved in some locations",
      significance: "Represents pre-Buddhist spiritual traditions",
      content: "Nature worship, shamanic practices, indigenous beliefs",
      location: "Remote monasteries, private collections",
      preservation: "Rare, carefully preserved manuscripts"
    },
    {
      name: "Lepcha Buddhist Texts",
      volumes: "Various",
      script: "Róng script",
      period: "18th Century onwards",
      description: "Buddhist texts translated into Lepcha language",
      significance: "Bridge between indigenous culture and Buddhism",
      content: "Basic Buddhist teachings, prayer books, ritual texts",
      location: "Lepcha communities, some monasteries",
      preservation: "Endangered, digitization efforts ongoing"
    },
    {
      name: "Ritual Manuals (Choga)",
      volumes: "Numerous specialized texts",
      script: "Tibetan",
      period: "Various periods",
      description: "Detailed instructions for Buddhist ceremonies and rituals",
      significance: "Essential for maintaining proper religious practices",
      content: "Consecration rituals, festival procedures, meditation instructions",
      location: "All major monasteries",
      preservation: "Actively used, regularly copied"
    }
  ];

  // Filter function
  const filterItems = (items) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getCurrentData = () => {
    switch(selectedCategory) {
      case 'manuscripts': return filterItems(manuscripts);
      case 'murals': return filterItems(murals);
      case 'religious-texts': return filterItems(religiousTexts);
      default: return [];
    }
  };

  return (
    <div className="cultural-heritage-container">
      <div className="heritage-header">
        <h1>Sikkim Cultural Heritage</h1>
        <p>Explore the rich manuscript, mural, and religious text traditions of Sikkim</p>
      </div>
      
      <div className="heritage-controls">
        <div className="category-selector">
          <button 
            className={selectedCategory === 'manuscripts' ? 'active' : ''} 
            onClick={() => setSelectedCategory('manuscripts')}
          >
            Manuscripts
          </button>
          <button 
            className={selectedCategory === 'murals' ? 'active' : ''} 
            onClick={() => setSelectedCategory('murals')}
          >
            Murals
          </button>
          <button 
            className={selectedCategory === 'religious-texts' ? 'active' : ''} 
            onClick={() => setSelectedCategory('religious-texts')}
          >
            Religious Texts
          </button>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search cultural heritage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="heritage-search"
          />
        </div>
      </div>

      <div className="heritage-content">
        <div className="heritage-grid">
          {getCurrentData().map((item, index) => (
            <div key={index} className="heritage-card">
              <div className="card-header">
                <h3>{item.name}</h3>
                {item.script && <span className="script-tag">{item.script}</span>}
                {item.monastery && <span className="location-tag">{item.monastery}</span>}
              </div>
              
              <div className="card-content">
                <p className="description">{item.description}</p>
                
                <div className="details">
                  {item.period && (
                    <div className="detail-item">
                      <strong>Period:</strong> {item.period}
                    </div>
                  )}
                  
                  {item.language && (
                    <div className="detail-item">
                      <strong>Language:</strong> {item.language}
                    </div>
                  )}
                  
                  {item.technique && (
                    <div className="detail-item">
                      <strong>Technique:</strong> {item.technique}
                    </div>
                  )}
                  
                  {item.volumes && (
                    <div className="detail-item">
                      <strong>Collection:</strong> {item.volumes}
                    </div>
                  )}
                  
                  {item.themes && (
                    <div className="detail-item">
                      <strong>Themes:</strong> {item.themes}
                    </div>
                  )}
                  
                  {item.content && (
                    <div className="detail-item">
                      <strong>Content:</strong> {item.content}
                    </div>
                  )}
                  
                  <div className="detail-item">
                    <strong>Location:</strong> {item.location}
                  </div>
                  
                  <div className="significance">
                    <strong>Significance:</strong> {item.significance}
                  </div>
                  
                  {item.preservation && (
                    <div className="preservation">
                      <strong>Preservation:</strong> {item.preservation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CulturalHeritageData;
