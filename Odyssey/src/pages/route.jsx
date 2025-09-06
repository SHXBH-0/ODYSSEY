import React, { useState, useEffect, useRef } from 'react';

// NOTE: A Google Maps API key is REQUIRED.
// Get one from the Google Cloud Console: https://console.cloud.google.com/
const GOOGLE_MAPS_API_KEY = 'AIzaSyAjn0zNdcfGudm3hKB-mXp-C_A1GMcWqQ8';

// --- Data for Monasteries of Sikkim ---
// This data is now structured directly in the code for clarity.
const monasteriesData = [
    {
        id: 1,
        name: "Rumtek Dharma Chakra Centre",
        location: "Rumtek, East Sikkim",
        lat: 27.3258,
        lng: 88.6011,
        year: 1962,
        founder: "16th Gyalwa Karmapa",
        background: "Main seat-in-exile of the Karmapa lineage, housing precious relics of the 16th Karmapa within a magnificent golden stupa.",
        features: "A grand 4-story structure built in traditional Tibetan design, it's the largest monastery in Sikkim.",
        image: "https://placehold.co/600x400/818cf8/ffffff?text=Rumtek+Dharma"
    },
    {
        id: 2,
        name: "Enchey Monastery",
        location: "Gangtok, East Sikkim",
        lat: 27.3358,
        lng: 88.6192,
        year: 1840,
        founder: "Lama Drupthob Karpo",
        background: "Believed to be built on a site blessed by Guru Padmasambhava, where the founder, Lama Drupthob Karpo, flew from Maenam Hill.",
        features: "Distinctive Chinese pagoda-style architecture, rebuilt in 1909 and surrounded by a serene pine forest.",
        image: "https://placehold.co/600x400/f472b6/ffffff?text=Enchey"
    },
    {
        id: 3,
        name: "Pemayangtse Monastery",
        location: "Pelling, West Sikkim",
        lat: 27.3000,
        lng: 88.2536,
        year: 1705,
        founder: "Lhatsun Namkha Jigme",
        background: "One of the oldest and most premier monasteries in Sikkim, belonging to the Nyingma order of Tibetan Buddhism.",
        features: "A three-storied structure adorned with intricate paintings and sculptures, famous for its seven-tiered wooden model of Guru Rinpoche's Heavenly Palace.",
        image: "https://placehold.co/600x400/fb923c/ffffff?text=Pemayangtse"
    },
    {
        id: 4,
        name: "Tashiding Monastery",
        location: "Tashiding, West Sikkim",
        lat: 27.2719,
        lng: 88.2864,
        year: 1641,
        founder: "Ngadak Sempa Chemp",
        background: "Considered the spiritual heart of Sikkim, built on a site that was consecrated by Guru Padmasambhava himself.",
        features: "Features a main temple with a golden roof, surrounded by numerous chortens and stupas, and contains the sacred Thongwa Rangdrol chorten.",
        image: "https://placehold.co/600x400/4ade80/ffffff?text=Tashiding"
    },
];


function Routes() {
    const [startLat, setStartLat] = useState('');
    const [startLon, setStartLon] = useState('');
    const [selectedMonastery, setSelectedMonastery] = useState(monasteriesData[0]);
    const [view, setView] = useState('list'); // 'list' or 'detail'
    
    const [errorMessage, setErrorMessage] = useState('');
    const [isApiLoaded, setIsApiLoaded] = useState(false);

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const directionsService = useRef(null);
    const directionsRenderer = useRef(null);

    // Effect for loading the Google Maps API script
    useEffect(() => {
        const loadGoogleMapsScript = () => {
            if (window.google && window.google.maps) {
                setIsApiLoaded(true);
                return;
            }
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => setIsApiLoaded(true);
            script.onerror = () => setErrorMessage('Failed to load Google Maps. Please check your API key and network connection.');
            document.head.appendChild(script);
        };

        if (GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
            setErrorMessage('Please replace "YOUR_GOOGLE_MAPS_API_KEY_HERE" with your actual API key.');
        } else {
             loadGoogleMapsScript();
        }
    }, []);

    // Effect for initializing the map and setting the initial start location
    useEffect(() => {
        if (isApiLoaded && mapRef.current && !mapInstance.current) {
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: { lat: 27.5330, lng: 88.5122 }, // Centered on Sikkim
                zoom: 9,
                mapTypeControl: false,
                streetViewControl: false,
            });

            directionsService.current = new window.google.maps.DirectionsService();
            directionsRenderer.current = new window.google.maps.DirectionsRenderer();
            directionsRenderer.current.setMap(mapInstance.current);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setStartLat(String(position.coords.latitude));
                        setStartLon(String(position.coords.longitude));
                    },
                    () => {
                        setErrorMessage('Could not access location. Using a default location.');
                        setStartLat('19.0760'); // Default to Mumbai
                        setStartLon('72.8777');
                    }
                );
            } else {
                setErrorMessage('Geolocation is not supported. Using a default location.');
                setStartLat('19.0760');
                setStartLon('72.8777');
            }
        }
    }, [isApiLoaded]);
    
    // Effect to calculate the route whenever the start or destination changes
    useEffect(() => {
        if (startLat && startLon && selectedMonastery && mapInstance.current) {
            calculateRoute();
        }
    }, [startLat, startLon, selectedMonastery, isApiLoaded]);

    const calculateRoute = () => {
        if (!isApiLoaded || !startLat || !startLon || !selectedMonastery) {
            return;
        }
        setErrorMessage('');
        const request = {
            origin: new window.google.maps.LatLng(parseFloat(startLat), parseFloat(startLon)),
            destination: new window.google.maps.LatLng(selectedMonastery.lat, selectedMonastery.lng),
            travelMode: window.google.maps.TravelMode.DRIVING,
        };
        directionsService.current.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.current.setDirections(result);
            } else {
                setErrorMessage('Directions request failed due to ' + status);
                directionsRenderer.current.setDirections({ routes: [] });
            }
        });
    };

    const handleSelectMonastery = (monastery) => {
        setSelectedMonastery(monastery);
        setView('detail');
    };
    
    const handleBackToList = () => {
        setView('list');
    };
    
    const MonasteryListView = () => (
        <>
            <header className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Monasteries of Sikkim</h1>
                <p className="text-gray-500 mt-1">Select a monastery to see its details and route.</p>
            </header>
            <div className="space-y-4">
                {monasteriesData.map(monastery => (
                    <div 
                        key={monastery.id} 
                        onClick={() => handleSelectMonastery(monastery)}
                        className="flex items-center p-3 rounded-lg border-2 bg-white border-gray-200 hover:bg-gray-50 hover:border-indigo-400 cursor-pointer transition-all duration-200"
                    >
                        <img src={monastery.image} alt={monastery.name} className="w-20 h-20 rounded-md object-cover mr-4"/>
                        <div>
                            <h3 className="font-semibold text-gray-800">{monastery.name}</h3>
                            <p className="text-sm text-gray-500">{monastery.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    const MonasteryDetailView = () => (
        <div className="flex flex-col h-full">
            <button onClick={handleBackToList} className="mb-4 font-semibold text-indigo-600 hover:text-indigo-800 self-start">
                &larr; Back to List
            </button>
            <div className="flex-grow overflow-y-auto">
                <img src={selectedMonastery.image} alt={selectedMonastery.name} className="w-full h-48 object-cover rounded-lg shadow-lg mb-4"/>
                <h2 className="text-2xl font-bold text-gray-900">{selectedMonastery.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{selectedMonastery.location}</p>
                
                <div className="space-y-4 text-gray-700">
                    <div>
                        <h4 className="font-semibold text-gray-800">Established</h4>
                        <p>{selectedMonastery.year} by {selectedMonastery.founder}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Historical Background</h4>
                        <p>{selectedMonastery.background}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Architectural Features</h4>
                        <p>{selectedMonastery.features}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col lg:flex-row font-sans">
            <aside className="w-full lg:w-1/3 xl:w-1/4 p-6 bg-white shadow-lg overflow-y-auto" style={{maxHeight: '100vh'}}>
                {view === 'list' ? <MonasteryListView /> : <MonasteryDetailView />}
                <div className="text-red-500 text-sm h-4 text-center mt-4">{errorMessage}</div>
            </aside>
            
            <main className="flex-1 h-screen lg:h-auto">
                 <div ref={mapRef} className="w-full h-full bg-gray-200"></div>
            </main>
        </div>
    );
}

export default Routes;

