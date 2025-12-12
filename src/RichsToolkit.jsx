import React, { useState, useEffect, useRef } from 'react';
import { Calculator, ChevronRight, ChevronLeft, Home, Camera, ClipboardList, PaintBucket, Ruler, Grid3X3, Package, Layers, Plus, Building2, Sun, Landmark, Image, FileText, X, Clock, MapPin, Calendar, Phone, Square, AlertTriangle, CheckCircle, Check, Flag, Send, ArrowLeftRight, Receipt, Car, Trash2, Star, MessageSquare, Copy, PhoneCall, Search, Users, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, Wind, Droplets, Thermometer, Umbrella, AlertCircle, CloudSun, Moon, Sunrise, Sunset, Eye, Loader2, DollarSign, TrendingUp, PiggyBank, CreditCard, Download, Settings, Fish, Waves, Trophy, ShoppingCart, Map, BookOpen, Target, Zap, Lock, Unlock } from 'lucide-react';
import { useWeather } from './useWeather';
import { useLocalStorage } from './useLocalStorage';

export default function RichsToolkit() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCalc, setSelectedCalc] = useState(null);
  const [heritageSection, setHeritageSection] = useState(null);
  
  // Snagging state
  const [selectedSnaggingProject, setSelectedSnaggingProject] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showNewSnag, setShowNewSnag] = useState(false);
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showProjectPhotos, setShowProjectPhotos] = useState(false);
  const [newSnagData, setNewSnagData] = useState({ description: '', priority: 'medium', notes: '' });
  const [newRoomName, setNewRoomName] = useState('');
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    grade: 'Grade II',
    address: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    startDate: '',
    notes: ''
  });
  
  // Conversions state
  const [conversionType, setConversionType] = useState('length');
  const [feetInput, setFeetInput] = useState('');
  const [inchesInput, setInchesInput] = useState('');
  
  // Time & Expenses state
  const [timeTab, setTimeTab] = useState('time');
  const [showAddTime, setShowAddTime] = useState(false);
  const [showAddReceipt, setShowAddReceipt] = useState(false);
  const [showAddMileage, setShowAddMileage] = useState(false);
  
  // Suppliers state
  const [supplierCategory, setSupplierCategory] = useState('all');
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showMaterialList, setShowMaterialList] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [materialListItems, setMaterialListItems] = useLocalStorage('richs-toolkit-material-list', [{ id: 1, item: '', qty: '', unit: 'bags' }]);
  
  // Weather state
  const [weatherView, setWeatherView] = useState('today'); // today, week, alerts

  // Live weather data for Bath, UK
  const { weatherData, loading: weatherLoading, error: weatherError } = useWeather();

  // Invoicing & Budget state
  const [invoices, setInvoices] = useLocalStorage('richs-toolkit-invoices', []);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [newInvoiceData, setNewInvoiceData] = useState({
    project: '',
    hourlyRate: '25',
    markup: '15',
    includeTime: true,
    includeReceipts: true,
    includeMileage: true
  });

  const [budgets, setBudgets] = useLocalStorage('richs-toolkit-budgets', {
    projects: {},
    personal: {
      monthly: 2000,
      categories: [
        { id: 'materials', name: 'Materials', budget: 500, spent: 0, color: 'bg-blue-500' },
        { id: 'fuel', name: 'Fuel & Travel', budget: 300, spent: 0, color: 'bg-green-500' },
        { id: 'tools', name: 'Tools & Hire', budget: 200, spent: 0, color: 'bg-purple-500' },
        { id: 'food', name: 'Food & Drink', budget: 400, spent: 0, color: 'bg-orange-500' },
        { id: 'other', name: 'Other', budget: 600, spent: 0, color: 'bg-gray-500' }
      ]
    }
  });
  const [budgetTab, setBudgetTab] = useState('personal');
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', budget: '', spent: '', color: 'bg-blue-500' });

  // Current time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Register service worker for offline functionality (PWA)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('ServiceWorker registered:', registration);
          })
          .catch((error) => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }
  }, []);

  // Greeting popup state
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState('');

  // Check for time-based greeting (morning 7-9am, night 9-11:30pm)
  useEffect(() => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const today = currentTime.toDateString();

    // Check if we've already shown a greeting today
    const lastGreeting = localStorage.getItem('richs-toolkit-last-greeting');

    if (lastGreeting !== today) {
      // Morning greeting: 7:00am - 8:59am
      if (hour >= 7 && hour < 9) {
        setGreetingMessage('morning :) x');
        setShowGreeting(true);
        localStorage.setItem('richs-toolkit-last-greeting', today);

        // Hide after 5 seconds
        setTimeout(() => {
          setShowGreeting(false);
        }, 5000);
      }
      // Night greeting: 9:00pm - 11:30pm
      else if (hour === 21 || hour === 22 || (hour === 23 && minute < 30)) {
        setGreetingMessage('night x');
        setShowGreeting(true);
        localStorage.setItem('richs-toolkit-last-greeting', today);

        // Hide after 5 seconds
        setTimeout(() => {
          setShowGreeting(false);
        }, 5000);
      }
    }
  }, [currentTime]);

  // Gallery state
  const [photos, setPhotos] = useLocalStorage('richs-toolkit-gallery', []);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showAnnotation, setShowAnnotation] = useState(false);

  // ==================== FISHING GAME DATA ====================

  // Fishing Game Locations (All 12 locations)
  const FISHING_LOCATIONS = {
    bath: {
      id: 'bath',
      name: 'River Avon, Bath',
      country: '🇬🇧',
      unlockLevel: 1,
      description: 'Your home waters. Misty mornings and peaceful afternoons on the historic River Avon.',
      skyGradient: 'from-emerald-800 via-emerald-600 to-sky-400',
      waterGradient: 'from-emerald-700/80 to-emerald-900/90',
      particles: ['🍃', '🦆'],
      fish: ['roach', 'perch', 'bream', 'chub', 'pike', 'carp', 'tench', 'ghostpike']
    },
    thailand: {
      id: 'thailand',
      name: 'Chao Phraya River, Thailand',
      country: '🇹🇭',
      unlockLevel: 5,
      description: 'Golden temples reflect on warm tropical waters. Giant fish lurk in the depths.',
      skyGradient: 'from-amber-500 via-orange-400 to-yellow-300',
      waterGradient: 'from-amber-700/70 to-amber-900/80',
      particles: ['🪷', '✨'],
      fish: ['tilapia', 'stripedcatfish', 'giantsnakehead', 'giantgourami', 'siamesecarp', 'mekongcatfish', 'nagaking']
    },
    lochness: {
      id: 'lochness',
      name: 'Loch Ness, Scottish Highlands',
      country: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      unlockLevel: 10,
      description: 'Ancient lochs shrouded in mist and legend. Something big lurks below.',
      skyGradient: 'from-slate-700 via-slate-500 to-slate-400',
      waterGradient: 'from-slate-700/90 to-slate-900/95',
      particles: ['🌧️', '🦅'],
      fish: ['browntrout', 'rainbowtrout', 'atlanticsalmon', 'arcticchar', 'feroxtrout', 'thelaird']
    },
    bulgaria: {
      id: 'bulgaria',
      name: 'River Danube, Bulgaria',
      country: '🇧🇬',
      unlockLevel: 15,
      description: 'Second-longest river in Europe. Ancient waters flowing through green valleys.',
      skyGradient: 'from-green-700 via-green-500 to-sky-300',
      waterGradient: 'from-green-800/70 to-green-950/85',
      particles: ['🌿', '🦢'],
      fish: ['europeanperch', 'zander', 'wels', 'danubecarp', 'danubesalmon', 'sterlet', 'beluga']
    },
    norway: {
      id: 'norway',
      name: 'Lofoten Islands, Norway',
      country: '🇳🇴',
      unlockLevel: 20,
      description: 'Arctic waters beneath dramatic peaks. Northern lights dance above frigid seas.',
      skyGradient: 'from-indigo-900 via-blue-700 to-cyan-500',
      waterGradient: 'from-blue-900/90 to-slate-950/95',
      particles: ['❄️', '🌌'],
      fish: ['cod', 'haddock', 'halibut', 'wolffish', 'redfish', 'coalfish', 'skrei', 'arcticchar_norway']
    },
    florida: {
      id: 'florida',
      name: 'Everglades, Florida',
      country: '🇺🇸',
      unlockLevel: 25,
      description: 'Swamps teeming with prehistoric predators. Sun-scorched waters hide monsters.',
      skyGradient: 'from-orange-600 via-yellow-500 to-blue-400',
      waterGradient: 'from-green-700/60 to-green-900/80',
      particles: ['🐊', '🦩'],
      fish: ['largemouthbass', 'snook', 'tarpon', 'redfish_florida', 'garfish', 'peacockbass', 'floridagator', 'bullshark']
    },
    amazon: {
      id: 'amazon',
      name: 'Amazon River, Brazil',
      country: '🇧🇷',
      unlockLevel: 30,
      description: 'The lungs of Earth. Dense jungle conceals the most biodiverse waters on the planet.',
      skyGradient: 'from-green-800 via-lime-600 to-yellow-400',
      waterGradient: 'from-amber-800/60 to-amber-950/75',
      particles: ['🦜', '🌺'],
      fish: ['piranha', 'peacockbass_amazon', 'payara', 'arapaima', 'redtailcatfish', 'tambaqui', 'electriceel', 'pirarucu']
    },
    australia: {
      id: 'australia',
      name: 'Great Barrier Reef, Australia',
      country: '🇦🇺',
      unlockLevel: 35,
      description: 'Crystal-clear coral reefs. Vibrant fish dance through underwater rainbows.',
      skyGradient: 'from-cyan-400 via-blue-400 to-teal-300',
      waterGradient: 'from-cyan-600/50 to-blue-800/70',
      particles: ['🐠', '🪸'],
      fish: ['barramundi', 'queenfish', 'giantrevally', 'goldentrevally', 'coraltrout', 'mackerel', 'blackmarlin', 'greatwhiteshark']
    },
    japan: {
      id: 'japan',
      name: 'Lake Biwa, Japan',
      country: '🇯🇵',
      unlockLevel: 40,
      description: 'Ancient lake of Japan. Cherry blossoms fall on sacred waters holding legendary fish.',
      skyGradient: 'from-pink-400 via-purple-300 to-blue-400',
      waterGradient: 'from-purple-700/60 to-indigo-900/80',
      particles: ['🌸', '🎋'],
      fish: ['biwasalmon', 'blackbass', 'bluegill', 'crucian', 'ayufish', 'biwatrout', 'catfish_japan', 'masteroi']
    },
    vietnam: {
      id: 'vietnam',
      name: 'Mekong Delta, Vietnam',
      country: '🇻🇳',
      unlockLevel: 45,
      description: 'Muddy waters flow past floating markets. The Mekong bounty feeds millions.',
      skyGradient: 'from-amber-600 via-yellow-500 to-orange-400',
      waterGradient: 'from-yellow-800/65 to-amber-950/80',
      particles: ['🍜', '⛵'],
      fish: ['mekongcatfish_vietnam', 'giantcarp', 'stripedcatfish_vietnam', 'snakehead', 'giantgourami_vietnam', 'tigerfish', 'mekongdragon']
    },
    southafrica: {
      id: 'southafrica',
      name: 'Cape Point, South Africa',
      country: '🇿🇦',
      unlockLevel: 50,
      description: 'Where two oceans meet. Wild Atlantic waves crash against African shores.',
      skyGradient: 'from-orange-700 via-red-500 to-yellow-400',
      waterGradient: 'from-blue-700/70 to-blue-950/90',
      particles: ['🦭', '🐳'],
      fish: ['yellowfintuna', 'snoek', 'kabeljou', 'kingfish', 'steenbras', 'bonito', 'greatwhite', 'capeleviathan']
    },
    iceland: {
      id: 'iceland',
      name: 'Blue Lagoon, Iceland',
      country: '🇮🇸',
      unlockLevel: 55,
      description: 'Geothermal pools beneath glaciers. Steam rises from waters warmed by the core of Earth.',
      skyGradient: 'from-blue-300 via-cyan-200 to-white',
      waterGradient: 'from-cyan-400/40 to-blue-600/60',
      particles: ['💎', '🌊'],
      fish: ['atlanticsalmon_iceland', 'arcticchar_iceland', 'browntrout_iceland', 'seabass', 'wolffish_iceland', 'icelandictreasure']
    }
  };

  // Fish Database
  const FISH_DATA = {
    // River Avon, Bath
    roach: { id: 'roach', emoji: '🐟', name: 'Roach', rarity: 'common', minWeight: 0.2, maxWeight: 1.5, fight: 20, value: 10, xp: 15, location: 'bath' },
    perch: { id: 'perch', emoji: '🐠', name: 'Perch', rarity: 'common', minWeight: 0.3, maxWeight: 2.8, fight: 30, value: 15, xp: 20, location: 'bath' },
    bream: { id: 'bream', emoji: '🐟', name: 'Bream', rarity: 'uncommon', minWeight: 0.8, maxWeight: 5, fight: 25, value: 25, xp: 30, location: 'bath' },
    chub: { id: 'chub', emoji: '🐠', name: 'Chub', rarity: 'uncommon', minWeight: 1, maxWeight: 6, fight: 40, value: 35, xp: 40, location: 'bath' },
    pike: { id: 'pike', emoji: '🦈', name: 'Pike', rarity: 'rare', minWeight: 2, maxWeight: 15, fight: 70, value: 100, xp: 80, location: 'bath' },
    carp: { id: 'carp', emoji: '🐡', name: 'Common Carp', rarity: 'rare', minWeight: 3, maxWeight: 25, fight: 60, value: 120, xp: 100, location: 'bath' },
    tench: { id: 'tench', emoji: '🐠', name: 'Tench', rarity: 'epic', minWeight: 1, maxWeight: 8, fight: 45, value: 150, xp: 120, location: 'bath' },
    ghostpike: { id: 'ghostpike', emoji: '👻', name: 'Ghost Pike', rarity: 'legendary', minWeight: 15, maxWeight: 30, fight: 95, value: 1000, xp: 500, location: 'bath', description: 'The albino legend of the Avon' },

    // Chao Phraya River, Thailand
    tilapia: { id: 'tilapia', emoji: '🐟', name: 'Tilapia', rarity: 'common', minWeight: 0.3, maxWeight: 2, fight: 15, value: 8, xp: 12, location: 'thailand' },
    stripedcatfish: { id: 'stripedcatfish', emoji: '🐠', name: 'Striped Catfish', rarity: 'common', minWeight: 1, maxWeight: 15, fight: 35, value: 30, xp: 35, location: 'thailand' },
    giantsnakehead: { id: 'giantsnakehead', emoji: '🐍', name: 'Giant Snakehead', rarity: 'uncommon', minWeight: 2, maxWeight: 12, fight: 55, value: 60, xp: 50, location: 'thailand' },
    giantgourami: { id: 'giantgourami', emoji: '🐠', name: 'Giant Gourami', rarity: 'uncommon', minWeight: 3, maxWeight: 20, fight: 40, value: 80, xp: 70, location: 'thailand' },
    siamesecarp: { id: 'siamesecarp', emoji: '🐡', name: 'Siamese Carp', rarity: 'rare', minWeight: 10, maxWeight: 100, fight: 80, value: 200, xp: 150, location: 'thailand' },
    mekongcatfish: { id: 'mekongcatfish', emoji: '🦈', name: 'Mekong Giant Catfish', rarity: 'epic', minWeight: 20, maxWeight: 150, fight: 90, value: 400, xp: 200, location: 'thailand' },
    nagaking: { id: 'nagaking', emoji: '🐉', name: 'Naga King', rarity: 'legendary', minWeight: 80, maxWeight: 200, fight: 100, value: 2000, xp: 600, location: 'thailand', description: 'Serpent deity of the river' },

    // Loch Ness, Scotland
    browntrout: { id: 'browntrout', emoji: '🐟', name: 'Brown Trout', rarity: 'common', minWeight: 0.5, maxWeight: 8, fight: 45, value: 40, xp: 35, location: 'lochness' },
    rainbowtrout: { id: 'rainbowtrout', emoji: '🌈', name: 'Rainbow Trout', rarity: 'common', minWeight: 0.4, maxWeight: 6, fight: 50, value: 35, xp: 30, location: 'lochness' },
    atlanticsalmon: { id: 'atlanticsalmon', emoji: '🐠', name: 'Atlantic Salmon', rarity: 'uncommon', minWeight: 3, maxWeight: 25, fight: 70, value: 150, xp: 100, location: 'lochness' },
    arcticchar: { id: 'arcticchar', emoji: '❄️', name: 'Arctic Char', rarity: 'rare', minWeight: 1, maxWeight: 10, fight: 55, value: 120, xp: 90, location: 'lochness' },
    feroxtrout: { id: 'feroxtrout', emoji: '🦈', name: 'Ferox Trout', rarity: 'epic', minWeight: 5, maxWeight: 15, fight: 75, value: 250, xp: 150, location: 'lochness' },
    thelaird: { id: 'thelaird', emoji: '👑', name: 'The Laird', rarity: 'legendary', minWeight: 30, maxWeight: 50, fight: 98, value: 2500, xp: 700, location: 'lochness', description: 'Ancient salmon, older than the castle' },

    // River Danube, Bulgaria
    europeanperch: { id: 'europeanperch', emoji: '🐠', name: 'European Perch', rarity: 'common', minWeight: 0.4, maxWeight: 3, fight: 35, value: 20, xp: 25, location: 'bulgaria' },
    zander: { id: 'zander', emoji: '🐟', name: 'Zander', rarity: 'common', minWeight: 1, maxWeight: 12, fight: 50, value: 45, xp: 40, location: 'bulgaria' },
    wels: { id: 'wels', emoji: '🐋', name: 'Wels Catfish', rarity: 'uncommon', minWeight: 10, maxWeight: 80, fight: 75, value: 150, xp: 120, location: 'bulgaria' },
    danubecarp: { id: 'danubecarp', emoji: '🐡', name: 'Danube Carp', rarity: 'rare', minWeight: 5, maxWeight: 30, fight: 65, value: 180, xp: 140, location: 'bulgaria' },
    danubesalmon: { id: 'danubesalmon', emoji: '🐟', name: 'Danube Salmon', rarity: 'epic', minWeight: 8, maxWeight: 40, fight: 85, value: 350, xp: 200, location: 'bulgaria' },
    sterlet: { id: 'sterlet', emoji: '🐠', name: 'Sterlet Sturgeon', rarity: 'epic', minWeight: 5, maxWeight: 15, fight: 70, value: 400, xp: 250, location: 'bulgaria' },
    beluga: { id: 'beluga', emoji: '🐋', name: 'Beluga Sturgeon', rarity: 'legendary', minWeight: 50, maxWeight: 300, fight: 100, value: 5000, xp: 800, location: 'bulgaria', description: 'Ancient giant of the deep' },

    // Lofoten Islands, Norway
    cod: { id: 'cod', emoji: '🐟', name: 'Atlantic Cod', rarity: 'common', minWeight: 1, maxWeight: 15, fight: 40, value: 35, xp: 30, location: 'norway' },
    haddock: { id: 'haddock', emoji: '🐠', name: 'Haddock', rarity: 'common', minWeight: 0.8, maxWeight: 10, fight: 35, value: 30, xp: 25, location: 'norway' },
    halibut: { id: 'halibut', emoji: '🐡', name: 'Halibut', rarity: 'uncommon', minWeight: 10, maxWeight: 100, fight: 80, value: 200, xp: 150, location: 'norway' },
    wolffish: { id: 'wolffish', emoji: '🦈', name: 'Atlantic Wolffish', rarity: 'uncommon', minWeight: 5, maxWeight: 25, fight: 70, value: 150, xp: 120, location: 'norway' },
    redfish: { id: 'redfish', emoji: '🐟', name: 'Redfish', rarity: 'rare', minWeight: 3, maxWeight: 20, fight: 60, value: 180, xp: 140, location: 'norway' },
    coalfish: { id: 'coalfish', emoji: '🐠', name: 'Coalfish', rarity: 'rare', minWeight: 2, maxWeight: 15, fight: 55, value: 140, xp: 110, location: 'norway' },
    skrei: { id: 'skrei', emoji: '👑', name: 'Skrei Cod', rarity: 'epic', minWeight: 10, maxWeight: 30, fight: 75, value: 450, xp: 280, location: 'norway' },
    arcticchar_norway: { id: 'arcticchar_norway', emoji: '❄️', name: 'Arctic Char', rarity: 'legendary', minWeight: 15, maxWeight: 40, fight: 90, value: 3000, xp: 750, location: 'norway', description: 'Northern lights guardian' },

    // Everglades, Florida
    largemouthbass: { id: 'largemouthbass', emoji: '🐟', name: 'Largemouth Bass', rarity: 'common', minWeight: 1, maxWeight: 8, fight: 50, value: 40, xp: 35, location: 'florida' },
    snook: { id: 'snook', emoji: '🐠', name: 'Snook', rarity: 'common', minWeight: 2, maxWeight: 15, fight: 60, value: 60, xp: 50, location: 'florida' },
    tarpon: { id: 'tarpon', emoji: '🐡', name: 'Tarpon', rarity: 'uncommon', minWeight: 10, maxWeight: 100, fight: 90, value: 250, xp: 180, location: 'florida' },
    redfish_florida: { id: 'redfish_florida', emoji: '🐠', name: 'Redfish', rarity: 'uncommon', minWeight: 3, maxWeight: 20, fight: 55, value: 120, xp: 100, location: 'florida' },
    garfish: { id: 'garfish', emoji: '🦈', name: 'Alligator Gar', rarity: 'rare', minWeight: 20, maxWeight: 120, fight: 85, value: 300, xp: 220, location: 'florida' },
    peacockbass: { id: 'peacockbass', emoji: '🦚', name: 'Peacock Bass', rarity: 'epic', minWeight: 3, maxWeight: 12, fight: 70, value: 350, xp: 250, location: 'florida' },
    floridagator: { id: 'floridagator', emoji: '🐊', name: 'Florida Gator', rarity: 'epic', minWeight: 50, maxWeight: 200, fight: 95, value: 600, xp: 400, location: 'florida' },
    bullshark: { id: 'bullshark', emoji: '🦈', name: 'Bull Shark', rarity: 'legendary', minWeight: 80, maxWeight: 250, fight: 100, value: 4000, xp: 850, location: 'florida', description: 'Apex predator of the swamps' },

    // Amazon River, Brazil
    piranha: { id: 'piranha', emoji: '🐟', name: 'Red Piranha', rarity: 'common', minWeight: 0.5, maxWeight: 3, fight: 40, value: 25, xp: 20, location: 'amazon' },
    peacockbass_amazon: { id: 'peacockbass_amazon', emoji: '🦚', name: 'Peacock Bass', rarity: 'common', minWeight: 2, maxWeight: 10, fight: 55, value: 50, xp: 45, location: 'amazon' },
    payara: { id: 'payara', emoji: '🦷', name: 'Payara', rarity: 'uncommon', minWeight: 3, maxWeight: 15, fight: 70, value: 120, xp: 100, location: 'amazon' },
    arapaima: { id: 'arapaima', emoji: '🐋', name: 'Arapaima', rarity: 'rare', minWeight: 50, maxWeight: 200, fight: 90, value: 450, xp: 300, location: 'amazon' },
    redtailcatfish: { id: 'redtailcatfish', emoji: '🐠', name: 'Redtail Catfish', rarity: 'rare', minWeight: 10, maxWeight: 60, fight: 75, value: 280, xp: 200, location: 'amazon' },
    tambaqui: { id: 'tambaqui', emoji: '🐡', name: 'Tambaqui', rarity: 'epic', minWeight: 15, maxWeight: 40, fight: 65, value: 400, xp: 280, location: 'amazon' },
    electriceel: { id: 'electriceel', emoji: '⚡', name: 'Electric Eel', rarity: 'epic', minWeight: 5, maxWeight: 20, fight: 80, value: 500, xp: 350, location: 'amazon' },
    pirarucu: { id: 'pirarucu', emoji: '🐉', name: 'Pirarucu', rarity: 'legendary', minWeight: 100, maxWeight: 300, fight: 100, value: 6000, xp: 900, location: 'amazon', description: 'Living fossil of the Amazon' },

    // Great Barrier Reef, Australia
    barramundi: { id: 'barramundi', emoji: '🐟', name: 'Barramundi', rarity: 'common', minWeight: 2, maxWeight: 20, fight: 60, value: 70, xp: 60, location: 'australia' },
    queenfish: { id: 'queenfish', emoji: '🐠', name: 'Queenfish', rarity: 'common', minWeight: 1, maxWeight: 12, fight: 55, value: 50, xp: 45, location: 'australia' },
    giantrevally: { id: 'giantrevally', emoji: '💎', name: 'Giant Trevally', rarity: 'uncommon', minWeight: 5, maxWeight: 50, fight: 85, value: 200, xp: 150, location: 'australia' },
    goldentrevally: { id: 'goldentrevally', emoji: '✨', name: 'Golden Trevally', rarity: 'rare', minWeight: 3, maxWeight: 15, fight: 65, value: 250, xp: 180, location: 'australia' },
    coraltrout: { id: 'coraltrout', emoji: '🐡', name: 'Coral Trout', rarity: 'rare', minWeight: 2, maxWeight: 10, fight: 60, value: 220, xp: 160, location: 'australia' },
    mackerel: { id: 'mackerel', emoji: '🐟', name: 'Spanish Mackerel', rarity: 'epic', minWeight: 5, maxWeight: 25, fight: 75, value: 400, xp: 280, location: 'australia' },
    blackmarlin: { id: 'blackmarlin', emoji: '🗡️', name: 'Black Marlin', rarity: 'epic', minWeight: 100, maxWeight: 500, fight: 95, value: 800, xp: 500, location: 'australia' },
    greatwhiteshark: { id: 'greatwhiteshark', emoji: '🦈', name: 'Great White Shark', rarity: 'legendary', minWeight: 200, maxWeight: 1000, fight: 100, value: 10000, xp: 1000, location: 'australia', description: 'King of the reef' },

    // Lake Biwa, Japan
    biwasalmon: { id: 'biwasalmon', emoji: '🐟', name: 'Biwa Salmon', rarity: 'common', minWeight: 0.8, maxWeight: 6, fight: 45, value: 50, xp: 40, location: 'japan' },
    blackbass: { id: 'blackbass', emoji: '🐠', name: 'Black Bass', rarity: 'common', minWeight: 1, maxWeight: 8, fight: 50, value: 55, xp: 45, location: 'japan' },
    bluegill: { id: 'bluegill', emoji: '🐟', name: 'Bluegill', rarity: 'uncommon', minWeight: 0.3, maxWeight: 2, fight: 30, value: 40, xp: 35, location: 'japan' },
    crucian: { id: 'crucian', emoji: '🐡', name: 'Crucian Carp', rarity: 'uncommon', minWeight: 0.5, maxWeight: 4, fight: 35, value: 60, xp: 50, location: 'japan' },
    ayufish: { id: 'ayufish', emoji: '✨', name: 'Ayu Fish', rarity: 'rare', minWeight: 0.2, maxWeight: 0.5, fight: 40, value: 180, xp: 120, location: 'japan' },
    biwatrout: { id: 'biwatrout', emoji: '🌸', name: 'Biwa Trout', rarity: 'epic', minWeight: 3, maxWeight: 15, fight: 70, value: 450, xp: 300, location: 'japan' },
    catfish_japan: { id: 'catfish_japan', emoji: '😺', name: 'Japanese Catfish', rarity: 'epic', minWeight: 5, maxWeight: 25, fight: 65, value: 400, xp: 280, location: 'japan' },
    masteroi: { id: 'masteroi', emoji: '🎌', name: 'Master Koi', rarity: 'legendary', minWeight: 20, maxWeight: 50, fight: 85, value: 8000, xp: 950, location: 'japan', description: 'Sacred guardian of Lake Biwa' },

    // Mekong Delta, Vietnam
    mekongcatfish_vietnam: { id: 'mekongcatfish_vietnam', emoji: '🐟', name: 'Mekong Catfish', rarity: 'common', minWeight: 5, maxWeight: 40, fight: 60, value: 80, xp: 70, location: 'vietnam' },
    giantcarp: { id: 'giantcarp', emoji: '🐡', name: 'Giant Carp', rarity: 'uncommon', minWeight: 10, maxWeight: 60, fight: 70, value: 150, xp: 120, location: 'vietnam' },
    stripedcatfish_vietnam: { id: 'stripedcatfish_vietnam', emoji: '🐠', name: 'Striped Catfish', rarity: 'uncommon', minWeight: 2, maxWeight: 20, fight: 50, value: 100, xp: 85, location: 'vietnam' },
    snakehead: { id: 'snakehead', emoji: '🐍', name: 'Snakehead', rarity: 'rare', minWeight: 3, maxWeight: 18, fight: 65, value: 200, xp: 150, location: 'vietnam' },
    giantgourami_vietnam: { id: 'giantgourami_vietnam', emoji: '🐠', name: 'Giant Gourami', rarity: 'rare', minWeight: 5, maxWeight: 25, fight: 55, value: 180, xp: 140, location: 'vietnam' },
    tigerfish: { id: 'tigerfish', emoji: '🐅', name: 'Tiger Catfish', rarity: 'epic', minWeight: 15, maxWeight: 80, fight: 85, value: 550, xp: 380, location: 'vietnam' },
    mekongdragon: { id: 'mekongdragon', emoji: '🐉', name: 'Mekong Dragon', rarity: 'legendary', minWeight: 100, maxWeight: 400, fight: 100, value: 7500, xp: 1000, location: 'vietnam', description: 'Ancient spirit of the river' },

    // Cape Point, South Africa
    yellowfintuna: { id: 'yellowfintuna', emoji: '🐟', name: 'Yellowfin Tuna', rarity: 'common', minWeight: 10, maxWeight: 80, fight: 75, value: 100, xp: 90, location: 'southafrica' },
    snoek: { id: 'snoek', emoji: '🐠', name: 'Snoek', rarity: 'common', minWeight: 2, maxWeight: 10, fight: 50, value: 60, xp: 50, location: 'southafrica' },
    kabeljou: { id: 'kabeljou', emoji: '🐟', name: 'Kabeljou', rarity: 'uncommon', minWeight: 5, maxWeight: 35, fight: 65, value: 150, xp: 120, location: 'southafrica' },
    kingfish: { id: 'kingfish', emoji: '👑', name: 'Kingfish', rarity: 'uncommon', minWeight: 8, maxWeight: 50, fight: 80, value: 200, xp: 160, location: 'southafrica' },
    steenbras: { id: 'steenbras', emoji: '🐡', name: 'Steenbras', rarity: 'rare', minWeight: 3, maxWeight: 20, fight: 60, value: 220, xp: 170, location: 'southafrica' },
    bonito: { id: 'bonito', emoji: '🐠', name: 'Bonito', rarity: 'rare', minWeight: 5, maxWeight: 25, fight: 70, value: 250, xp: 190, location: 'southafrica' },
    greatwhite: { id: 'greatwhite', emoji: '🦈', name: 'Great White Shark', rarity: 'epic', minWeight: 200, maxWeight: 800, fight: 98, value: 900, xp: 600, location: 'southafrica' },
    capeleviathan: { id: 'capeleviathan', emoji: '🐋', name: 'Cape Leviathan', rarity: 'legendary', minWeight: 500, maxWeight: 1500, fight: 100, value: 12000, xp: 1100, location: 'southafrica', description: 'Where oceans collide' },

    // Blue Lagoon, Iceland
    atlanticsalmon_iceland: { id: 'atlanticsalmon_iceland', emoji: '🐟', name: 'Atlantic Salmon', rarity: 'common', minWeight: 3, maxWeight: 20, fight: 65, value: 90, xp: 75, location: 'iceland' },
    arcticchar_iceland: { id: 'arcticchar_iceland', emoji: '❄️', name: 'Arctic Char', rarity: 'uncommon', minWeight: 1, maxWeight: 12, fight: 55, value: 130, xp: 100, location: 'iceland' },
    browntrout_iceland: { id: 'browntrout_iceland', emoji: '🐠', name: 'Brown Trout', rarity: 'uncommon', minWeight: 0.8, maxWeight: 10, fight: 50, value: 110, xp: 90, location: 'iceland' },
    seabass: { id: 'seabass', emoji: '🐡', name: 'Sea Bass', rarity: 'rare', minWeight: 2, maxWeight: 15, fight: 60, value: 200, xp: 150, location: 'iceland' },
    wolffish_iceland: { id: 'wolffish_iceland', emoji: '🐺', name: 'Wolffish', rarity: 'epic', minWeight: 8, maxWeight: 35, fight: 80, value: 500, xp: 350, location: 'iceland' },
    icelandictreasure: { id: 'icelandictreasure', emoji: '💎', name: 'Icelandic Treasure', rarity: 'legendary', minWeight: 40, maxWeight: 100, fight: 95, value: 9500, xp: 1050, location: 'iceland', description: 'Gem of the glaciers' }
  };

  // Equipment Data
  const RODS = {
    starter: { id: 'starter', name: 'Starter Rod', castPower: 60, maxLine: '10lb', price: 0, unlockLevel: 1 },
    carbon: { id: 'carbon', name: 'Carbon Light', castPower: 70, maxLine: '20lb', price: 500, unlockLevel: 5 },
    pro: { id: 'pro', name: 'Pro Caster', castPower: 80, maxLine: '40lb', price: 1500, unlockLevel: 15 }
  };

  const REELS = {
    basic: { id: 'basic', name: 'Basic Reel', reelSpeed: 1.0, dragPower: 1.0, price: 0, unlockLevel: 1 },
    smooth: { id: 'smooth', name: 'Smooth Drag', reelSpeed: 1.2, dragPower: 1.3, price: 300, unlockLevel: 8 },
    speed: { id: 'speed', name: 'Speed Reel', reelSpeed: 1.5, dragPower: 1.2, price: 1000, unlockLevel: 20 }
  };

  const LINES = {
    lb4: { id: 'lb4', name: '4lb Test', maxWeight: 4, price: 0, unlockLevel: 1 },
    lb8: { id: 'lb8', name: '8lb Test', maxWeight: 8, price: 200, unlockLevel: 10 },
    lb15: { id: 'lb15', name: '15lb Mono', maxWeight: 20, price: 600, unlockLevel: 20 }
  };

  const BAITS = {
    worm: { id: 'worm', name: 'Earthworm', rareBonus: 0, price: 0 },
    spinner: { id: 'spinner', name: 'Spinner', rareBonus: 5, price: 50 },
    fly: { id: 'fly', name: 'Fly Lure', rareBonus: 8, price: 100 },
    live: { id: 'live', name: 'Live Bait', rareBonus: 12, price: 200 },
    legendary: { id: 'legendary', name: 'Legendary Lure', rareBonus: 20, price: 500 }
  };

  // Fishing Game State
  const [fishingGame, setFishingGame] = useLocalStorage('richsFishingAdventure', {
    level: 1,
    xp: 0,
    coins: 100,
    currentLocation: 'bath',
    unlockedLocations: ['bath'],
    maxRods: 1,
    equipment: { rod: 'starter', reel: 'basic', line: 'lb4', bait: 'worm' },
    inventory: {
      rods: ['starter'],
      reels: ['basic'],
      lines: ['lb4'],
      baits: { worm: 999, spinner: 0, fly: 0, live: 0, legendary: 0 }
    },
    fishCollection: {},
    personalBests: {},
    stats: {
      totalCaught: 0,
      totalWeight: 0,
      biggestCatch: 0,
      totalCoins: 0,
      speciesDiscovered: 0,
      commonCaught: 0,
      uncommonCaught: 0,
      rareCaught: 0,
      epicCaught: 0,
      legendaryCaught: 0,
      locationsVisited: 1,
      locationsUnlocked: 1,
      maxRodsUsed: 1
    },
    achievements: []
  });

  // Fishing UI State
  const [fishingScreen, setFishingScreen] = useState('title'); // title, game, worldmap, collection, shop, stats
  const [activeRodIndex, setActiveRodIndex] = useState(0);
  const [rodStates, setRodStates] = useState([
    { state: 'idle', power: 0, waitTime: 0, fish: null, tension: 0, progress: 0 }
  ]);
  const [castingPower, setCastingPower] = useState(0);
  const [isCasting, setIsCasting] = useState(false);
  const [catchModal, setCatchModal] = useState(null);
  const [shopCategory, setShopCategory] = useState('rods');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [notification, setNotification] = useState(null);

  // Fishing animation frame
  const fishingAnimationFrame = useRef(null);
  const lastFrameTime = useRef(Date.now());

  // ==================== FISHING GAME HELPER FUNCTIONS ====================

  // Get rarity badge styling
  const getRarityStyle = (rarity) => {
    const styles = {
      common: 'bg-gray-400 text-white',
      uncommon: 'bg-green-500 text-white',
      rare: 'bg-blue-500 text-white',
      epic: 'bg-purple-500 text-white',
      legendary: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
    };
    return styles[rarity] || styles.common;
  };

  // Select random fish based on rarity probabilities
  const selectRandomFish = () => {
    const location = FISHING_LOCATIONS[fishingGame.currentLocation];
    const availableFish = location.fish.map(id => FISH_DATA[id]);
    const baitBonus = BAITS[fishingGame.equipment.bait].rareBonus;

    const rand = Math.random() * 100;
    let targetRarity = 'common';

    if (rand < 1 + (baitBonus * 0.05)) targetRarity = 'legendary';
    else if (rand < 5 + (baitBonus * 0.2)) targetRarity = 'epic';
    else if (rand < 15 + (baitBonus * 0.5)) targetRarity = 'rare';
    else if (rand < 40) targetRarity = 'uncommon';

    const rarityFish = availableFish.filter(f => f.rarity === targetRarity);
    if (rarityFish.length > 0) {
      return rarityFish[Math.floor(Math.random() * rarityFish.length)];
    }
    return availableFish[Math.floor(Math.random() * availableFish.length)];
  };

  // Generate fish weight
  const generateFishWeight = (fish) => {
    const weight = fish.minWeight + Math.random() * (fish.maxWeight - fish.minWeight);
    return Math.round(weight * 100) / 100;
  };

  // Calculate XP required for level
  const getXPForLevel = (level) => {
    if (level <= 5) return 100;
    if (level <= 10) return 250;
    if (level <= 15) return 500;
    if (level <= 20) return 750;
    if (level <= 30) return 1000;
    return 1500;
  };

  // Add XP and handle level ups
  const addXP = (amount) => {
    setFishingGame(prev => {
      const newXP = prev.xp + amount;
      const xpNeeded = getXPForLevel(prev.level);

      if (newXP >= xpNeeded) {
        const newLevel = prev.level + 1;
        showNotification(`🎉 Level ${newLevel}!`, 'success');

        // Unlock locations
        const newUnlocked = [...prev.unlockedLocations];
        Object.values(FISHING_LOCATIONS).forEach(loc => {
          if (loc.unlockLevel === newLevel && !newUnlocked.includes(loc.id)) {
            newUnlocked.push(loc.id);
            showNotification(`🗺️ ${loc.name} unlocked!`, 'success');
          }
        });

        // Unlock rod slots
        let newMaxRods = prev.maxRods;
        if (newLevel === 5) newMaxRods = 2;
        if (newLevel === 15) newMaxRods = 3;

        return {
          ...prev,
          level: newLevel,
          xp: newXP - xpNeeded,
          unlockedLocations: newUnlocked,
          maxRods: newMaxRods,
          stats: { ...prev.stats, locationsUnlocked: newUnlocked.length, maxRodsUsed: Math.max(prev.stats.maxRodsUsed, newMaxRods) }
        };
      }

      return { ...prev, xp: newXP };
    });
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ==================== FISHING MECHANICS ====================

  // Start casting (hold button)
  const handleCastStart = (rodIndex) => {
    const newRodStates = [...rodStates];
    if (newRodStates[rodIndex].state !== 'idle') return;

    newRodStates[rodIndex] = { ...newRodStates[rodIndex], state: 'charging', power: 0 };
    setRodStates(newRodStates);
    setIsCasting(true);
  };

  // Release cast button
  const handleCastRelease = (rodIndex) => {
    const newRodStates = [...rodStates];
    if (newRodStates[rodIndex].state !== 'charging') return;

    const power = newRodStates[rodIndex].power;
    if (power < 20) {
      // Too weak, cancel cast
      newRodStates[rodIndex] = { state: 'idle', power: 0, waitTime: 0, fish: null, tension: 0, progress: 0 };
    } else {
      // Cast successful, enter waiting state
      const waitTime = 3000 + Math.random() * 5000; // 3-8 seconds wait
      newRodStates[rodIndex] = {
        ...newRodStates[rodIndex],
        state: 'waiting',
        waitTime: waitTime,
        waitStart: Date.now()
      };
    }
    setRodStates(newRodStates);
    setIsCasting(false);
  };

  // Hook fish during bite
  const handleHookFish = (rodIndex) => {
    const newRodStates = [...rodStates];
    if (newRodStates[rodIndex].state !== 'bite') return;

    const fish = selectRandomFish();
    newRodStates[rodIndex] = {
      ...newRodStates[rodIndex],
      state: 'fighting',
      fish: fish,
      tension: 30,
      progress: 10,
      fishPullDirection: (Math.random() - 0.5) * 2 // -1 to 1
    };
    setRodStates(newRodStates);
  };

  // Reel during fight
  const handleReel = (rodIndex) => {
    const newRodStates = [...rodStates];
    const rod = newRodStates[rodIndex];
    if (rod.state !== 'fighting') return;

    // Reeling increases progress but also tension
    rod.progress = Math.min(100, rod.progress + 5);
    rod.tension = Math.min(100, rod.tension + 8);

    // Check if won
    if (rod.progress >= 100) {
      handleCatchFish(rodIndex, rod.fish);
      return;
    }

    // Check if lost
    if (rod.tension >= 100) {
      handleLoseFish(rodIndex);
      return;
    }

    setRodStates(newRodStates);
  };

  // Drag (let line out) during fight
  const handleDrag = (rodIndex) => {
    const newRodStates = [...rodStates];
    const rod = newRodStates[rodIndex];
    if (rod.state !== 'fighting') return;

    // Dragging reduces tension but also progress slightly
    rod.tension = Math.max(0, rod.tension - 10);
    rod.progress = Math.max(0, rod.progress - 2);

    setRodStates(newRodStates);
  };

  // Catch fish successfully
  const handleCatchFish = (rodIndex, fish) => {
    const weight = generateFishWeight(fish);
    const variant = Math.random() < 0.05 ? ['golden', 'albino', 'giant'][Math.floor(Math.random() * 3)] : null;
    let finalWeight = weight;
    if (variant === 'giant') finalWeight = weight * 1.5;

    // Update game state
    setFishingGame(prev => {
      const newCollection = { ...prev.fishCollection };
      newCollection[fish.id] = (newCollection[fish.id] || 0) + 1;

      const newPBs = { ...prev.personalBests };
      if (!newPBs[fish.id] || finalWeight > newPBs[fish.id]) {
        newPBs[fish.id] = finalWeight;
      }

      const coinValue = variant === 'golden' ? fish.value * 2 : fish.value;
      const xpValue = variant === 'albino' ? fish.xp * 1.5 : fish.xp;

      const newStats = { ...prev.stats };
      newStats.totalCaught += 1;
      newStats.totalWeight += finalWeight;
      newStats.biggestCatch = Math.max(newStats.biggestCatch, finalWeight);
      newStats.totalCoins += coinValue;
      if (!prev.fishCollection[fish.id]) newStats.speciesDiscovered += 1;
      newStats[`${fish.rarity}Caught`] = (newStats[`${fish.rarity}Caught`] || 0) + 1;

      return {
        ...prev,
        coins: prev.coins + coinValue,
        fishCollection: newCollection,
        personalBests: newPBs,
        stats: newStats
      };
    });

    addXP(fish.xp);

    // Show catch modal
    setCatchModal({
      fish,
      weight: finalWeight,
      variant,
      isNewSpecies: !fishingGame.fishCollection[fish.id],
      isNewPB: !fishingGame.personalBests[fish.id] || finalWeight > fishingGame.personalBests[fish.id]
    });

    // Reset rod
    const newRodStates = [...rodStates];
    newRodStates[rodIndex] = { state: 'idle', power: 0, waitTime: 0, fish: null, tension: 0, progress: 0 };
    setRodStates(newRodStates);
  };

  // Lose fish (line snapped)
  const handleLoseFish = (rodIndex) => {
    showNotification('💔 Line snapped! Fish escaped!', 'error');
    const newRodStates = [...rodStates];
    newRodStates[rodIndex] = { state: 'idle', power: 0, waitTime: 0, fish: null, tension: 0, progress: 0 };
    setRodStates(newRodStates);
  };

  // Fishing game loop
  useEffect(() => {
    if (fishingScreen !== 'game') return;

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastFrameTime.current;
      lastFrameTime.current = now;

      setRodStates(prev => {
        const newStates = [...prev];
        let changed = false;

        newStates.forEach((rod, i) => {
          if (rod.state === 'charging') {
            // Increase power while charging
            rod.power = Math.min(100, rod.power + deltaTime / 15);
            changed = true;
          } else if (rod.state === 'waiting') {
            // Check if bite should occur
            const elapsed = now - rod.waitStart;
            if (elapsed >= rod.waitTime) {
              rod.state = 'bite';
              rod.biteStart = now;
              showNotification(`🎣 BITE! Tap to hook! (Rod ${i + 1})`, 'success');
              changed = true;
            }
          } else if (rod.state === 'bite') {
            // Auto-miss after 2.5 seconds
            const elapsed = now - rod.biteStart;
            if (elapsed >= 2500) {
              rod.state = 'idle';
              rod.power = 0;
              rod.waitTime = 0;
              showNotification('😞 Missed the bite!', 'error');
              changed = true;
            }
          } else if (rod.state === 'fighting') {
            // Fish fights back over time
            rod.tension = Math.min(100, rod.tension + deltaTime / 200);
            changed = true;

            // Check if lost
            if (rod.tension >= 100) {
              handleLoseFish(i);
              changed = true;
            }
          }
        });

        return changed ? newStates : prev;
      });

      fishingAnimationFrame.current = requestAnimationFrame(gameLoop);
    };

    lastFrameTime.current = Date.now();
    fishingAnimationFrame.current = requestAnimationFrame(gameLoop);

    return () => {
      if (fishingAnimationFrame.current) {
        cancelAnimationFrame(fishingAnimationFrame.current);
      }
    };
  }, [fishingScreen, rodStates]);

  // Work condition assessments
  const getWorkConditions = (temp, rain, wind, condition) => {
    const conditions = [];
    
    // External work
    if (rain < 30 && wind < 20) {
      conditions.push({ activity: 'External Work', status: 'good', icon: '✓', note: 'Good conditions' });
    } else if (rain < 60 && wind < 30) {
      conditions.push({ activity: 'External Work', status: 'caution', icon: '!', note: 'Possible, watch weather' });
    } else {
      conditions.push({ activity: 'External Work', status: 'poor', icon: '✗', note: 'Not recommended' });
    }
    
    // Lime pointing
    if (temp >= 5 && temp <= 25 && rain < 20 && wind < 15) {
      conditions.push({ activity: 'Lime Pointing', status: 'good', icon: '✓', note: 'Ideal conditions' });
    } else if (temp < 5) {
      conditions.push({ activity: 'Lime Pointing', status: 'poor', icon: '✗', note: 'Too cold - frost risk' });
    } else if (temp > 25) {
      conditions.push({ activity: 'Lime Pointing', status: 'caution', icon: '!', note: 'Hot - keep damp' });
    } else {
      conditions.push({ activity: 'Lime Pointing', status: 'caution', icon: '!', note: 'Check conditions' });
    }
    
    // Painting external
    if (temp >= 10 && temp <= 25 && rain < 10 && condition !== 'rain') {
      conditions.push({ activity: 'External Painting', status: 'good', icon: '✓', note: 'Good drying conditions' });
    } else if (temp < 10) {
      conditions.push({ activity: 'External Painting', status: 'caution', icon: '!', note: 'Slow drying' });
    } else {
      conditions.push({ activity: 'External Painting', status: 'poor', icon: '✗', note: 'Not recommended' });
    }
    
    // Scaffolding work
    if (wind < 20 && rain < 40) {
      conditions.push({ activity: 'Scaffolding', status: 'good', icon: '✓', note: 'Safe to work' });
    } else if (wind < 30) {
      conditions.push({ activity: 'Scaffolding', status: 'caution', icon: '!', note: 'Use caution' });
    } else {
      conditions.push({ activity: 'Scaffolding', status: 'poor', icon: '✗', note: 'Unsafe - high wind' });
    }
    
    // Stone cleaning
    if (temp >= 5 && rain < 20) {
      conditions.push({ activity: 'Stone Cleaning', status: 'good', icon: '✓', note: 'DOFF/TORC OK' });
    } else {
      conditions.push({ activity: 'Stone Cleaning', status: 'caution', icon: '!', note: 'Check surface dry' });
    }
    
    return conditions;
  };

  const getWeatherIcon = (condition, size = 24) => {
    const iconProps = { size, className: 'text-current' };
    switch (condition) {
      case 'sunny': return <Sun {...iconProps} />;
      case 'partly-cloudy': return <CloudSun {...iconProps} />;
      case 'cloudy': return <Cloud {...iconProps} />;
      case 'rain': return <CloudRain {...iconProps} />;
      case 'drizzle': return <CloudDrizzle {...iconProps} />;
      case 'snow': return <CloudSnow {...iconProps} />;
      case 'thunder': return <CloudLightning {...iconProps} />;
      case 'storm': return <CloudLightning {...iconProps} />;
      default: return <Sun {...iconProps} />;
    }
  };

  const getWorkScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getWorkScoreLabel = (score) => {
    if (score >= 80) return 'Great';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const [suppliers, setSuppliers] = useLocalStorage('richs-toolkit-suppliers', [
    // Merchants - Builders Merchants
    { id: 1, name: 'Travis Perkins Bath', category: 'merchants', phone: '01225 444555', address: 'Lower Bristol Road, Bath', website: 'travisperkins.co.uk', favorite: true, notes: 'Ask for trade discount - account #TP4421' },
    { id: 2, name: 'Jewson Bath', category: 'merchants', phone: '01225 333666', address: 'Locksbrook Road, Bath', website: 'jewson.co.uk', favorite: true, notes: 'Good for timber, delivers before 7am' },
    { id: 3, name: 'Selco Builders Warehouse', category: 'merchants', phone: '01225 789456', address: 'Brassmill Lane, Bath', website: 'selcobw.com', favorite: false, notes: 'Cash & carry, competitive prices' },
    { id: 4, name: 'Buildbase Bath', category: 'merchants', phone: '01225 424242', address: 'Midland Road, Bath', website: 'buildbase.co.uk', favorite: false, notes: 'Plumbing and heavy materials' },

    // Bath Stone & Masonry
    { id: 5, name: 'Hartham Park Quarry', category: 'stone', phone: '01225 811083', address: 'Corsham, Wiltshire', website: '', favorite: true, notes: 'Best for new Bath stone' },
    { id: 6, name: 'Bath & Portland Stone', category: 'stone', phone: '01225 858555', address: 'Corsham', website: 'bathandportlandstone.co.uk', favorite: true, notes: 'Ashlar, mouldings, restoration stone' },
    { id: 7, name: 'Stoke Ground Stone', category: 'stone', phone: '01225 742488', address: 'Box, Corsham', website: '', favorite: false, notes: 'Premium Bath stone, slow delivery' },
    { id: 8, name: 'Stone Projects', category: 'stone', phone: '01225 315315', address: 'Bath', website: '', favorite: false, notes: 'Stone cutting and bespoke work' },

    // Heritage & Lime Specialists
    { id: 9, name: 'Mike Wye Associates', category: 'heritage', phone: '01409 281644', address: 'Devon (delivers)', website: 'mikewye.co.uk', favorite: true, notes: 'Lime putty, NHL, traditional paints' },
    { id: 10, name: 'Lime Technology', category: 'heritage', phone: '01952 728611', address: 'Shropshire (delivers)', website: 'limetechnology.co.uk', favorite: true, notes: 'Hemp lime, insulation, breathable systems' },
    { id: 11, name: 'Ty-Mawr Lime', category: 'heritage', phone: '01874 658249', address: 'Wales (delivers)', website: 'lime.org.uk', favorite: false, notes: 'Natural hydraulic lime, plasters' },
    { id: 12, name: 'The Bath Stone Company', category: 'heritage', phone: '01225 858444', address: 'Corsham', website: '', favorite: false, notes: 'Conservation and restoration advice' },

    // Tool Hire & Plant
    { id: 13, name: 'Speedy Hire Bath', category: 'hire', phone: '01225 555111', address: 'Lower Bristol Road, Bath', website: 'speedyservices.com', favorite: true, notes: 'Scaffolding, heavy plant' },
    { id: 14, name: 'HSS Hire Bath', category: 'hire', phone: '01225 463636', address: 'Lower Bristol Road, Bath', website: 'hss.com', favorite: false, notes: 'Tools, access equipment' },
    { id: 15, name: 'Brandon Hire Station', category: 'hire', phone: '01225 789000', address: 'Bath', website: 'brandon-hire.co.uk', favorite: false, notes: 'Specialist lifting and access' },

    // Specialists
    { id: 16, name: 'Bath Sash Windows', category: 'specialist', phone: '01225 789123', address: 'Larkhall, Bath', website: '', favorite: true, notes: 'Sash window repairs and draught proofing' },
    { id: 17, name: 'Georgian Joinery', category: 'specialist', phone: '01225 444789', address: 'Bath', website: '', favorite: true, notes: 'Period doors, shutters, panelling' },
    { id: 18, name: 'Bath Architectural Salvage', category: 'specialist', phone: '01225 311174', address: 'Northgate Street, Bath', website: 'bathsalvage.com', favorite: false, notes: 'Period fixtures, fireplaces, doors' },
    { id: 19, name: 'Traditional Ironmongery', category: 'specialist', phone: '01225 318181', address: 'Bath', website: '', favorite: false, notes: 'Georgian locks, handles, hinges' },
    { id: 20, name: 'Heritage Decorative Finishes', category: 'specialist', phone: '01225 505050', address: 'Bath', website: '', favorite: false, notes: 'Specialist plastering and decorative work' },
    { id: 21, name: 'Bath Plastering', category: 'specialist', phone: '01225 767676', address: 'Bath', website: '', favorite: false, notes: 'Lime plastering specialists' },
    { id: 22, name: 'Farrow & Ball Bath', category: 'specialist', phone: '01225 469300', address: 'Walcot Street, Bath', website: 'farrow-ball.com', favorite: false, notes: 'Traditional paints and wallpapers' },
    { id: 23, name: 'Bathroom City Bath', category: 'specialist', phone: '01225 421421', address: 'Lower Bristol Road, Bath', website: '', favorite: false, notes: 'Period-style bathrooms and fittings' },
  ]);

  const [newSupplier, setNewSupplier] = useState({ name: '', category: 'merchants', phone: '', address: '', website: '', notes: '' });

  const [timeEntries, setTimeEntries] = useLocalStorage('richs-toolkit-time-entries', []);
  const [receipts, setReceipts] = useLocalStorage('richs-toolkit-receipts', []);
  const [mileageEntries, setMileageEntries] = useLocalStorage('richs-toolkit-mileage', []);

  const [newTimeEntry, setNewTimeEntry] = useState({ project: '', hours: '', minutes: '', notes: '', break: '30' });
  const [newReceipt, setNewReceipt] = useState({ supplier: '', amount: '', category: 'Materials', project: '', description: '' });
  const [newMileage, setNewMileage] = useState({ from: 'Home', to: '', miles: '', project: '', return: true });

  const [projects, setProjects] = useLocalStorage('richs-toolkit-projects', []);

  const [plasterInputs, setPlasterInputs] = useState({ length: '', width: '', height: '', type: 'multifinish' });
  const [paintInputs, setPaintInputs] = useState({ length: '', width: '', height: '', coats: '2' });
  const [timberInputs, setTimberInputs] = useState({ perimeter: '', doors: '0' });
  const [tileInputs, setTileInputs] = useState({ length: '', width: '', tileLength: '300', tileWidth: '300' });
  const [concreteInputs, setConcreteInputs] = useState({ length: '', width: '', depth: '' });
  const [studInputs, setStudInputs] = useState({ length: '', height: '2400' });

  const calculators = [
    { id: 'plaster', title: 'Plaster & Skim', icon: Layers, color: 'bg-amber-500', desc: 'Bonding, multi-finish, lime' },
    { id: 'paint', title: 'Paint Coverage', icon: PaintBucket, color: 'bg-blue-500', desc: 'Walls, woodwork, coats' },
    { id: 'timber', title: 'Timber Lengths', icon: Ruler, color: 'bg-green-600', desc: 'Skirting, architrave, dado' },
    { id: 'tiles', title: 'Tile Calculator', icon: Grid3X3, color: 'bg-purple-500', desc: 'Floor & wall with wastage' },
    { id: 'concrete', title: 'Concrete & Screed', icon: Package, color: 'bg-gray-600', desc: 'Volume calculations' },
    { id: 'stud', title: 'Stud Wall', icon: Building2, color: 'bg-red-500', desc: 'Timber, board, fixings' },
  ];

  const supplierCategories = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'merchants', label: 'Merchants', icon: Package },
    { id: 'stone', label: 'Bath Stone', icon: Square },
    { id: 'heritage', label: 'Heritage', icon: Landmark },
    { id: 'hire', label: 'Tool Hire', icon: Clock },
    { id: 'specialist', label: 'Specialists', icon: Building2 },
  ];

  const heritageData = {
    proportions: { title: 'Georgian Proportions', icon: Ruler, desc: 'Standard dimensions', sections: [{ title: 'Ceiling Heights', items: [{ label: 'Principal floor', value: '3.4-3.7m' }]}]},
    bathStone: { title: 'Bath Stone Guide', icon: Square, desc: 'Sourcing & mortars', sections: [{ title: 'Stone Types', items: [{ label: 'Stoke Ground', value: 'Creamy white' }]}]},
    listed: { title: 'Listed Building Rules', icon: AlertTriangle, desc: 'What needs consent', sections: [{ title: 'Always Needs LBC', items: [{ label: 'Removing walls', value: 'Required', icon: 'red' }]}]},
    contacts: { title: 'BANES Contacts', icon: Phone, desc: 'Planning & conservation', sections: [{ title: 'Planning', items: [{ label: 'General', value: '01225 477000', action: 'tel' }]}]},
  };

  const quickReferences = {
    georgian: [{ name: 'Standard door height', imperial: '6\' 8"', metric: '2030 mm' }, { name: 'Dado rail height', imperial: '3\' 0"', metric: '914 mm' }]
  };

  // Helper functions
  const formatTime = (hours, minutes) => `${hours}h ${minutes}m`;
  const formatCurrency = (amount) => `£${amount.toFixed(2)}`;
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Budget management functions
  const updateCategoryBudget = (categoryId, field, value) => {
    setBudgets(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        categories: prev.personal.categories.map(cat =>
          cat.id === categoryId ? { ...cat, [field]: field === 'name' || field === 'color' ? value : parseFloat(value) || 0 } : cat
        )
      }
    }));
  };

  const addBudgetCategory = () => {
    if (!newCategoryData.name || !newCategoryData.budget) return;
    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryData.name,
      budget: parseFloat(newCategoryData.budget) || 0,
      spent: parseFloat(newCategoryData.spent) || 0,
      color: newCategoryData.color
    };
    setBudgets(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        categories: [...prev.personal.categories, newCategory]
      }
    }));
    setNewCategoryData({ name: '', budget: '', spent: '', color: 'bg-blue-500' });
    setShowAddCategory(false);
  };

  const deleteBudgetCategory = (categoryId) => {
    setBudgets(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        categories: prev.personal.categories.filter(cat => cat.id !== categoryId)
      }
    }));
  };

  // Day/Night detection based on sunrise/sunset
  const isDaytime = () => {
    if (!weatherData?.current?.sunrise || !weatherData?.current?.sunset) return true; // Default to day

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Parse sunrise time (HH:MM format)
    const [sunriseHour, sunriseMin] = weatherData.current.sunrise.split(':').map(Number);
    const sunriseTime = sunriseHour * 60 + sunriseMin;

    // Parse sunset time (HH:MM format)
    const [sunsetHour, sunsetMin] = weatherData.current.sunset.split(':').map(Number);
    const sunsetTime = sunsetHour * 60 + sunsetMin;

    return currentTime >= sunriseTime && currentTime < sunsetTime;
  };

  const getTheme = () => {
    const isDay = isDaytime();
    return {
      isDay,
      bg: isDay ? 'bg-gray-50' : 'bg-slate-900',
      cardBg: isDay ? 'bg-white' : 'bg-slate-800',
      text: isDay ? 'text-gray-900' : 'text-gray-100',
      textSecondary: isDay ? 'text-gray-500' : 'text-gray-400',
      border: isDay ? 'border-gray-100' : 'border-slate-700',
      headerGradient: isDay
        ? 'from-sky-400 to-blue-500'
        : 'from-indigo-900 via-purple-900 to-slate-900',
      weatherCardGradient: isDay
        ? 'from-sky-400 to-blue-500'
        : 'from-indigo-600 to-purple-700',
    };
  };
  
  const getWeekTotal = (entries, field = 'hours') => {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    return entries.filter(e => new Date(e.date) >= weekAgo).reduce((acc, e) => acc + (field === 'hours' ? e.hours + e.minutes / 60 : field === 'amount' ? e.amount : e.miles * (e.return ? 2 : 1)), 0);
  };

  const groupByDate = (entries) => {
    const grouped = {};
    entries.forEach(entry => { if (!grouped[entry.date]) grouped[entry.date] = []; grouped[entry.date].push(entry); });
    return Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const toggleFavorite = (supplierId) => {
    setSuppliers(suppliers.map(s => s.id === supplierId ? { ...s, favorite: !s.favorite } : s));
  };

  const getFilteredSuppliers = () => {
    let filtered = suppliers;
    if (supplierCategory === 'favorites') filtered = suppliers.filter(s => s.favorite);
    else if (supplierCategory !== 'all') filtered = suppliers.filter(s => s.category === supplierCategory);
    if (searchQuery) filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  };

  const addSupplier = () => {
    if (!newSupplier.name || !newSupplier.phone) return;
    setSuppliers([...suppliers, { id: Date.now(), ...newSupplier, favorite: false }]);
    setNewSupplier({ name: '', category: 'merchants', phone: '', address: '', website: '', notes: '' });
    setShowAddSupplier(false);
  };

  const addMaterialListItem = () => setMaterialListItems([...materialListItems, { id: Date.now(), item: '', qty: '', unit: 'bags' }]);
  const updateMaterialListItem = (id, field, value) => setMaterialListItems(materialListItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  const removeMaterialListItem = (id) => { if (materialListItems.length > 1) setMaterialListItems(materialListItems.filter(item => item.id !== id)); };

  const generateMaterialListText = () => {
    const validItems = materialListItems.filter(item => item.item && item.qty);
    if (validItems.length === 0) return '';
    let text = `Material order for Rich:\n\n`;
    validItems.forEach(item => { text += `• ${item.qty} ${item.unit} - ${item.item}\n`; });
    text += `\nPlease confirm availability and price. Thanks!`;
    return text;
  };

  const convertLength = () => {
    const totalInches = ((parseFloat(feetInput) || 0) * 12) + (parseFloat(inchesInput) || 0);
    const mm = totalInches * 25.4;
    return { mm: mm.toFixed(1), cm: (mm / 10).toFixed(2), m: (mm / 1000).toFixed(3) };
  };

  const calculatePlaster = () => {
    const l = parseFloat(plasterInputs.length) || 0, w = parseFloat(plasterInputs.width) || 0, h = parseFloat(plasterInputs.height) || 0;
    const totalArea = (2 * (l + w) * h) + (l * w);
    const rates = { bonding: 2.5, multifinish: 7.5, lime: 2 };
    return { totalArea: totalArea.toFixed(1), bags: Math.ceil((totalArea / (rates[plasterInputs.type] || 7.5)) * 1.1) };
  };

  const calculatePaint = () => {
    const l = parseFloat(paintInputs.length) || 0, w = parseFloat(paintInputs.width) || 0, h = parseFloat(paintInputs.height) || 0;
    const totalArea = (2 * (l + w) * h) + (l * w);
    const litres = (totalArea / 12) * (parseInt(paintInputs.coats) || 2);
    return { litres: litres.toFixed(1), tins25: Math.ceil(litres / 2.5) };
  };

  const calculateTimber = () => {
    const perimeter = parseFloat(timberInputs.perimeter) || 0;
    const length = perimeter - ((parseInt(timberInputs.doors) || 0) * 0.9);
    return { withWastage: (length * 1.1).toFixed(1), lengths3m: Math.ceil(length * 1.1 / 3) };
  };

  const calculateTiles = () => {
    const areaSqm = ((parseFloat(tileInputs.length) || 0) * (parseFloat(tileInputs.width) || 0)) / 10000;
    const tileSqm = ((parseFloat(tileInputs.tileLength) || 300) * (parseFloat(tileInputs.tileWidth) || 300)) / 1000000;
    return { area: areaSqm.toFixed(2), tilesWithWastage: Math.ceil((areaSqm / tileSqm) * 1.1) };
  };

  const calculateConcrete = () => {
    const vol = ((parseFloat(concreteInputs.length) || 0) * (parseFloat(concreteInputs.width) || 0) * (parseFloat(concreteInputs.depth) || 0)) / 1000000;
    return { volume: vol.toFixed(3), bags25kg: Math.ceil(vol * 1.1 * 48) };
  };

  const calculateStud = () => {
    const lengthM = (parseFloat(studInputs.length) || 0) / 1000, heightM = (parseFloat(studInputs.height) || 2400) / 1000;
    const studs = Math.ceil(lengthM / 0.4) + 1;
    return { studs, boardsNeeded: Math.ceil((lengthM * heightM) / 2.88 * 1.1) };
  };

  const toggleSnagComplete = (projectId, roomId, itemId) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, snagging: p.snagging.map(room => room.id === roomId ? { ...room, items: room.items.map(item => item.id === itemId ? { ...item, complete: !item.complete } : item) } : room) } : p));
  };

  const deleteSnagItem = (projectId, roomId, itemId) => {
    setProjects(projects.map(p =>
      p.id === projectId
        ? { ...p, snagging: p.snagging.map(room =>
            room.id === roomId
              ? { ...room, items: room.items.filter(item => item.id !== itemId) }
              : room
          )}
        : p
    ));
    // Update selectedRoom state if we're viewing it
    if (selectedRoom) {
      setSelectedRoom(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    }
  };

  const addNewProject = () => {
    if (!newProjectData.name) return;
    const newProject = {
      id: Date.now(),
      name: newProjectData.name,
      grade: newProjectData.grade,
      address: newProjectData.address,
      clientName: newProjectData.clientName,
      clientPhone: newProjectData.clientPhone,
      clientEmail: newProjectData.clientEmail,
      startDate: newProjectData.startDate || getTodayDate(),
      notes: newProjectData.notes,
      photos: [],
      snagging: []
    };
    setProjects([...projects, newProject]);
    setNewProjectData({
      name: '',
      grade: 'Grade II',
      address: '',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      startDate: '',
      notes: ''
    });
    setShowNewProject(false);
  };

  const handlePhotoUpload = (projectId, event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Photo too large. Please use photos under 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = {
          id: Date.now() + Math.random(),
          url: reader.result,
          name: file.name,
          date: new Date().toISOString(),
          caption: ''
        };

        setProjects(projects.map(p =>
          p.id === projectId
            ? { ...p, photos: [...(p.photos || []), photoData] }
            : p
        ));
      };
      reader.readAsDataURL(file);
    });
  };

  const deletePhoto = (projectId, photoId) => {
    setProjects(projects.map(p =>
      p.id === projectId
        ? { ...p, photos: (p.photos || []).filter(photo => photo.id !== photoId) }
        : p
    ));
  };

  // Invoice Generation
  const generateInvoice = () => {
    if (!newInvoiceData.project) return;

    const projectTimeEntries = timeEntries.filter(e => e.project === newInvoiceData.project);
    const projectReceipts = receipts.filter(r => r.project === newInvoiceData.project);
    const projectMileage = mileageEntries.filter(m => m.project === newInvoiceData.project);

    const hourlyRate = parseFloat(newInvoiceData.hourlyRate) || 0;
    const markup = parseFloat(newInvoiceData.markup) || 0;

    let laborTotal = 0;
    if (newInvoiceData.includeTime) {
      const totalHours = projectTimeEntries.reduce((sum, entry) =>
        sum + entry.hours + entry.minutes / 60, 0);
      laborTotal = totalHours * hourlyRate;
    }

    let materialsTotal = 0;
    if (newInvoiceData.includeReceipts) {
      materialsTotal = projectReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);
      materialsTotal = materialsTotal * (1 + markup / 100);
    }

    let mileageTotal = 0;
    if (newInvoiceData.includeMileage) {
      const totalMiles = projectMileage.reduce((sum, entry) =>
        sum + entry.miles * (entry.return ? 2 : 1), 0);
      mileageTotal = totalMiles * 0.45; // HMRC rate
    }

    const subtotal = laborTotal + materialsTotal + mileageTotal;
    const vat = subtotal * 0.20;
    const total = subtotal + vat;

    const invoice = {
      id: Date.now(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      project: newInvoiceData.project,
      date: getTodayDate(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'unpaid',
      laborHours: newInvoiceData.includeTime ? projectTimeEntries.reduce((sum, e) => sum + e.hours + e.minutes / 60, 0) : 0,
      hourlyRate,
      laborTotal,
      materialsTotal,
      mileageTotal,
      subtotal,
      vat,
      total,
      items: {
        time: newInvoiceData.includeTime ? projectTimeEntries : [],
        receipts: newInvoiceData.includeReceipts ? projectReceipts : [],
        mileage: newInvoiceData.includeMileage ? projectMileage : []
      }
    };

    setInvoices([invoice, ...invoices]);
    setNewInvoiceData({
      project: '',
      hourlyRate: '25',
      markup: '15',
      includeTime: true,
      includeReceipts: true,
      includeMileage: true
    });
    setShowNewInvoice(false);
    setSelectedInvoice(invoice);
  };

  const toggleInvoiceStatus = (invoiceId) => {
    setInvoices(invoices.map(inv =>
      inv.id === invoiceId
        ? { ...inv, status: inv.status === 'paid' ? 'unpaid' : 'paid' }
        : inv
    ));
  };

  const addTimeEntry = () => {
    if (!newTimeEntry.project || (!newTimeEntry.hours && !newTimeEntry.minutes)) return;
    setTimeEntries([{ id: Date.now(), project: newTimeEntry.project, date: getTodayDate(), hours: parseInt(newTimeEntry.hours) || 0, minutes: parseInt(newTimeEntry.minutes) || 0, notes: newTimeEntry.notes, break: parseInt(newTimeEntry.break) || 0 }, ...timeEntries]);
    setNewTimeEntry({ project: '', hours: '', minutes: '', notes: '', break: '30' });
    setShowAddTime(false);
  };

  const addReceipt = () => {
    if (!newReceipt.supplier || !newReceipt.amount) return;
    setReceipts([{ id: Date.now(), date: getTodayDate(), supplier: newReceipt.supplier, amount: parseFloat(newReceipt.amount), category: newReceipt.category, project: newReceipt.project, description: newReceipt.description, photo: false }, ...receipts]);
    setNewReceipt({ supplier: '', amount: '', category: 'Materials', project: '', description: '' });
    setShowAddReceipt(false);
  };

  const addMileage = () => {
    if (!newMileage.to || !newMileage.miles) return;
    setMileageEntries([{ id: Date.now(), date: getTodayDate(), from: newMileage.from, to: newMileage.to, miles: parseFloat(newMileage.miles), project: newMileage.project, return: newMileage.return }, ...mileageEntries]);
    setNewMileage({ from: 'Home', to: '', miles: '', project: '', return: true });
    setShowAddMileage(false);
  };

  const InputField = ({ label, value, onChange, unit, placeholder, type = 'number' }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input type={type} inputMode={type === 'number' ? 'decimal' : 'text'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || '0'}
          className="flex-1 p-3 bg-gray-100 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {unit && <span className="text-gray-500 font-medium w-12">{unit}</span>}
      </div>
    </div>
  );

  const ResultCard = ({ label, value, unit, highlight }) => (
    <div className={`p-4 rounded-xl ${highlight ? 'bg-green-100' : 'bg-gray-100'}`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-green-700' : 'text-gray-900'}`}>{value} <span className="text-base font-medium">{unit}</span></p>
    </div>
  );

  // Weather Screen
  const renderWeather = () => {
    // Loading state
    if (weatherLoading || !weatherData) {
      return (
        <div className="p-4 pb-24">
          <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4">
            <ChevronLeft size={20} /><span>Home</span>
          </button>
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading weather data for Bath...</p>
          </div>
        </div>
      );
    }

    // Error state
    if (weatherError) {
      return (
        <div className="p-4 pb-24">
          <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4">
            <ChevronLeft size={20} /><span>Home</span>
          </button>
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <p className="text-gray-900 font-semibold mb-2">Unable to load weather</p>
            <p className="text-gray-600 text-center text-sm">{weatherError}</p>
          </div>
        </div>
      );
    }

    const { current, hourly, daily, alerts } = weatherData;
    const todayConditions = getWorkConditions(current.temp, daily[0].rain, current.windSpeed, current.condition);

    return (
      <div className="p-4 pb-24">
        <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4">
          <ChevronLeft size={20} /><span>Home</span>
        </button>

        {/* Current Weather Header */}
        <div className="bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 rounded-2xl p-5 mb-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} />
            <span className="text-sm font-medium">Bath, Somerset</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-6xl font-bold">{current.temp}°</p>
              <p className="text-lg opacity-90">{current.description}</p>
              <p className="text-sm opacity-75">Feels like {current.feelsLike}°</p>
            </div>
            <div className="text-white/90">
              {getWeatherIcon(current.condition, 64)}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <Wind size={18} className="mx-auto mb-1 opacity-75" />
              <p className="text-sm font-medium">{current.windSpeed} mph</p>
              <p className="text-xs opacity-75">{current.windDirection}</p>
            </div>
            <div className="text-center">
              <Droplets size={18} className="mx-auto mb-1 opacity-75" />
              <p className="text-sm font-medium">{current.humidity}%</p>
              <p className="text-xs opacity-75">Humidity</p>
            </div>
            <div className="text-center">
              <Sunrise size={18} className="mx-auto mb-1 opacity-75" />
              <p className="text-sm font-medium">{current.sunrise}</p>
              <p className="text-xs opacity-75">Sunrise</p>
            </div>
            <div className="text-center">
              <Sunset size={18} className="mx-auto mb-1 opacity-75" />
              <p className="text-sm font-medium">{current.sunset}</p>
              <p className="text-xs opacity-75">Sunset</p>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: '7 Day' },
            { id: 'alerts', label: `Alerts${alerts.length ? ` (${alerts.length})` : ''}` },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setWeatherView(tab.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${weatherView === tab.id ? 'bg-white shadow-sm' : 'text-gray-500'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Today View */}
        {weatherView === 'today' && (
          <>
            {/* Work Conditions */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 size={18} className="text-gray-600" />
                Work Conditions Today
              </h3>
              <div className="space-y-2">
                {todayConditions.map((condition, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{condition.activity}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${
                        condition.status === 'good' ? 'text-green-600' : 
                        condition.status === 'caution' ? 'text-amber-600' : 'text-red-600'
                      }`}>{condition.note}</span>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        condition.status === 'good' ? 'bg-green-100 text-green-600' : 
                        condition.status === 'caution' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                      }`}>{condition.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Hourly Forecast</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                {hourly.map((hour, i) => (
                  <div key={i} className="flex-shrink-0 text-center">
                    <p className="text-xs text-gray-500 mb-1">{hour.time}</p>
                    <div className="text-blue-500 mb-1">
                      {getWeatherIcon(hour.condition, 24)}
                    </div>
                    <p className="font-semibold text-gray-900">{hour.temp}°</p>
                    {hour.rain > 0 && (
                      <p className="text-xs text-blue-500">{hour.rain}%</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Week View */}
        {weatherView === 'week' && (
          <div className="space-y-3">
            {daily.map((day, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-500">
                      {getWeatherIcon(day.condition, 32)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{day.day}</p>
                      <p className="text-sm text-gray-500">{day.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{day.high}° / {day.low}°</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Droplets size={12} />{day.rain}%</span>
                        <span className="flex items-center gap-1"><Wind size={12} />{day.wind}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${getWorkScoreColor(day.workScore)}`}>
                      {getWorkScoreLabel(day.workScore)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Work Score</strong> rates each day for external building work based on rain, wind, and temperature conditions.
              </p>
            </div>
          </div>
        )}

        {/* Alerts View */}
        {weatherView === 'alerts' && (
          <div className="space-y-3">
            {alerts.length > 0 ? alerts.map((alert, i) => (
              <div key={i} className={`rounded-xl p-4 ${
                alert.severity === 'danger' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    alert.severity === 'danger' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    <AlertTriangle size={20} className={alert.severity === 'danger' ? 'text-red-600' : 'text-amber-600'} />
                  </div>
                  <div>
                    <p className={`font-semibold ${alert.severity === 'danger' ? 'text-red-800' : 'text-amber-800'}`}>
                      {alert.title}
                    </p>
                    <p className={`text-sm mt-1 ${alert.severity === 'danger' ? 'text-red-700' : 'text-amber-700'}`}>
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-gray-400">
                <CheckCircle size={48} className="mx-auto mb-3 opacity-50" />
                <p>No weather alerts</p>
                <p className="text-sm">All clear for now!</p>
              </div>
            )}

            {/* Heritage Work Tips */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mt-4">
              <h4 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
                <Landmark size={16} /> Heritage Work Tips
              </h4>
              <div className="space-y-2 text-sm text-stone-700">
                <p>• <strong>Lime mortar:</strong> Apply between 5°C - 25°C. Avoid frost risk overnight.</p>
                <p>• <strong>Limewash:</strong> Best applied in damp conditions, not direct sun.</p>
                <p>• <strong>Stone cleaning:</strong> DOFF system OK above 5°C on dry surfaces.</p>
                <p>• <strong>Pointing:</strong> Mist with water for 7+ days after application.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== FISHING GAME SCREENS ====================

  // Fishing Title Screen
  const renderFishingTitle = () => {
    const location = FISHING_LOCATIONS[fishingGame.currentLocation];

    return (
      <div className={`min-h-screen bg-gradient-to-b ${location.skyGradient} relative overflow-hidden`}>
        {/* Animated background particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.3
              }}
            >
              {location.particles[Math.floor(Math.random() * location.particles.length)]}
            </div>
          ))}
        </div>

        <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-screen">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-4 animate-bounce">🎣</div>
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Rich's</h1>
            <h2 className="text-6xl font-bold text-white drop-shadow-lg">Fishing Adventure</h2>
          </div>

          {/* Player Stats Summary */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 mb-8 w-full max-w-md">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">{fishingGame.level}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600">{fishingGame.coins}</div>
                <div className="text-sm text-gray-600">Coins</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{fishingGame.stats.totalCaught}</div>
                <div className="text-sm text-gray-600">Fish Caught</div>
              </div>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all duration-300"
                style={{ width: `${(fishingGame.xp / getXPForLevel(fishingGame.level)) * 100}%` }}
              />
            </div>
            <div className="text-xs text-center text-gray-500 mt-1">
              {fishingGame.xp} / {getXPForLevel(fishingGame.level)} XP
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-6">
            <button
              onClick={() => setFishingScreen('game')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg active:scale-95 transition flex flex-col items-center gap-2"
            >
              <Fish size={32} />
              <span>Start Fishing</span>
            </button>
            <button
              onClick={() => setFishingScreen('worldmap')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg active:scale-95 transition flex flex-col items-center gap-2"
            >
              <Map size={32} />
              <span>World Map</span>
            </button>
            <button
              onClick={() => setFishingScreen('collection')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg active:scale-95 transition flex flex-col items-center gap-2"
            >
              <BookOpen size={32} />
              <span>Collection</span>
            </button>
            <button
              onClick={() => setFishingScreen('shop')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg active:scale-95 transition flex flex-col items-center gap-2"
            >
              <ShoppingCart size={32} />
              <span>Shop</span>
            </button>
          </div>

          <button
            onClick={() => setFishingScreen('stats')}
            className="bg-white/80 hover:bg-white text-gray-800 font-semibold py-3 px-6 rounded-xl shadow-lg active:scale-95 transition flex items-center gap-2"
          >
            <Trophy size={24} />
            <span>Statistics</span>
          </button>

          {/* Back Button */}
          <button
            onClick={() => setCurrentScreen('home')}
            className="mt-8 text-white font-semibold flex items-center gap-2 hover:opacity-80"
          >
            <ChevronLeft size={20} />
            <span>Back to Toolkit</span>
          </button>
        </div>
      </div>
    );
  };

  // Fishing Game Screen (with multi-rod mechanics)
  const renderFishingGame = () => {
    const location = FISHING_LOCATIONS[fishingGame.currentLocation];
    const activeRod = rodStates[activeRodIndex] || rodStates[0];

    return (
      <div className={`min-h-screen bg-gradient-to-b ${location.skyGradient} relative overflow-hidden pb-24`}>
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              {location.particles[i % location.particles.length]}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="relative z-10 p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setFishingScreen('title')} className="text-white flex items-center gap-2">
              <ChevronLeft size={20} />
              Menu
            </button>
            <div className="text-white text-center">
              <div className="font-bold">{location.name} {location.country}</div>
              <div className="text-sm opacity-80">Level {fishingGame.level} • {fishingGame.coins} coins</div>
            </div>
            <div className="w-16" />
          </div>
        </div>

        {/* Water Area */}
        <div className={`relative mx-4 h-64 bg-gradient-to-b ${location.waterGradient} rounded-2xl shadow-2xl mb-6 overflow-hidden`}>
          {/* Bobber Animation */}
          {activeRod.state === 'waiting' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-bounce">🎣</div>
            </div>
          )}
          {activeRod.state === 'bite' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-pulse">
                <div className="text-red-500 font-bold text-3xl mb-2">BITE!</div>
                <div>🐟</div>
              </div>
            </div>
          )}
          {activeRod.state === 'fighting' && activeRod.fish && (
            <div className="absolute inset-0 p-4">
              <div className="text-center text-white mb-4">
                <div className="text-4xl mb-2">{FISH_DATA[activeRod.fish.id].emoji}</div>
                <div className="font-bold">{FISH_DATA[activeRod.fish.id].name}</div>
              </div>
              {/* Tension Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-white mb-1">
                  <span>Tension</span>
                  <span>{Math.round(activeRod.tension)}%</span>
                </div>
                <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      activeRod.tension > 75 ? 'bg-red-500' :
                      activeRod.tension > 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${activeRod.tension}%` }}
                  />
                </div>
              </div>
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-white mb-1">
                  <span>Progress</span>
                  <span>{Math.round(activeRod.progress)}%</span>
                </div>
                <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${activeRod.progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
          {activeRod.state === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl opacity-50">🌊</div>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="relative z-10 px-4">
          <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-2xl p-6 shadow-2xl">
            {/* Rod Tabs */}
            <div className="flex gap-2 mb-4">
              {Array.from({ length: fishingGame.maxRods }).map((_, i) => {
                const rod = rodStates[i] || { state: 'idle' };
                const stateEmoji = {
                  idle: '⚪',
                  charging: '🔵',
                  waiting: '🟡',
                  bite: '🔴',
                  fighting: '🟣'
                };
                return (
                  <button
                    key={i}
                    onClick={() => setActiveRodIndex(i)}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                      activeRodIndex === i
                        ? 'bg-blue-500 text-white'
                        : 'bg-amber-800/50 text-amber-200'
                    }`}
                  >
                    {stateEmoji[rod.state] || '⚪'} Rod {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Controls based on rod state */}
            {activeRod.state === 'idle' && (
              <div>
                <button
                  onMouseDown={() => handleCastStart(activeRodIndex)}
                  onMouseUp={() => handleCastRelease(activeRodIndex)}
                  onTouchStart={() => handleCastStart(activeRodIndex)}
                  onTouchEnd={() => handleCastRelease(activeRodIndex)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition"
                >
                  🎣 HOLD TO CAST
                </button>
              </div>
            )}

            {activeRod.state === 'charging' && (
              <div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-amber-100 mb-1">
                    <span>Cast Power</span>
                    <span>{Math.round(activeRod.power)}%</span>
                  </div>
                  <div className="h-4 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        activeRod.power > 80 ? 'bg-green-500' :
                        activeRod.power > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${activeRod.power}%` }}
                    />
                  </div>
                </div>
                <button
                  onMouseUp={() => handleCastRelease(activeRodIndex)}
                  onTouchEnd={() => handleCastRelease(activeRodIndex)}
                  className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg"
                >
                  ⬆️ RELEASE TO CAST
                </button>
              </div>
            )}

            {activeRod.state === 'waiting' && (
              <div className="text-center text-amber-100">
                <p className="text-lg font-bold mb-2">⏳ Waiting for a bite...</p>
                <p className="text-sm opacity-80">Watch the bobber!</p>
              </div>
            )}

            {activeRod.state === 'bite' && (
              <button
                onClick={() => handleHookFish(activeRodIndex)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-6 rounded-xl shadow-lg animate-pulse text-xl"
              >
                🪝 TAP TO HOOK!
              </button>
            )}

            {activeRod.state === 'fighting' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDrag(activeRodIndex)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition"
                >
                  🔄 DRAG
                </button>
                <button
                  onClick={() => handleReel(activeRodIndex)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition"
                >
                  ⚡ REEL
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex justify-around">
          <button onClick={() => setFishingScreen('worldmap')} className="text-white flex flex-col items-center gap-1">
            <Map size={24} />
            <span className="text-xs">Map</span>
          </button>
          <button onClick={() => setFishingScreen('collection')} className="text-white flex flex-col items-center gap-1">
            <BookOpen size={24} />
            <span className="text-xs">Collection</span>
          </button>
          <button onClick={() => setFishingScreen('shop')} className="text-white flex flex-col items-center gap-1">
            <ShoppingCart size={24} />
            <span className="text-xs">Shop</span>
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className={`px-6 py-3 rounded-xl shadow-2xl font-bold text-white ${
              notification.type === 'success' ? 'bg-green-500' :
              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}>
              {notification.message}
            </div>
          </div>
        )}

        {/* Catch Modal */}
        {catchModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">{catchModal.fish.emoji}</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{catchModal.fish.name}</h2>
                <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${getRarityStyle(catchModal.fish.rarity)}`}>
                  {catchModal.fish.rarity.toUpperCase()}
                </div>
                {catchModal.variant && (
                  <div className="mt-2">
                    <span className="inline-block px-4 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                      {catchModal.variant === 'golden' && '✨ GOLDEN VARIANT!'}
                      {catchModal.variant === 'albino' && '🤍 ALBINO VARIANT!'}
                      {catchModal.variant === 'giant' && '🔷 GIANT VARIANT!'}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{catchModal.weight}kg</div>
                    <div className="text-sm text-gray-600">Weight</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-600">{catchModal.variant === 'golden' ? catchModal.fish.value * 2 : catchModal.fish.value}</div>
                    <div className="text-sm text-gray-600">Coins</div>
                  </div>
                </div>
                {catchModal.isNewSpecies && (
                  <div className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold text-center">
                    🆕 NEW SPECIES!
                  </div>
                )}
                {catchModal.isNewPB && (
                  <div className="mt-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-center">
                    🏆 NEW PERSONAL BEST!
                  </div>
                )}
              </div>

              <button
                onClick={() => setCatchModal(null)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 transition"
              >
                Continue Fishing
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // World Map Screen
  const renderFishingWorldMap = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-600 p-4 pb-24">
        <button onClick={() => setFishingScreen('title')} className="text-white flex items-center gap-2 mb-4">
          <ChevronLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-6 text-center">🗺️ World Map</h1>

        <div className="space-y-3">
          {Object.values(FISHING_LOCATIONS).map(loc => {
            const isUnlocked = fishingGame.unlockedLocations.includes(loc.id);
            const isCurrent = fishingGame.currentLocation === loc.id;
            const fishCaught = loc.fish.filter(fid => fishingGame.fishCollection[fid]).length;

            return (
              <div
                key={loc.id}
                className={`rounded-2xl p-5 ${
                  isUnlocked ? 'bg-white' : 'bg-gray-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{isUnlocked ? <Unlock /> : <Lock />}</div>
                    <div>
                      <div className="font-bold text-lg flex items-center gap-2">
                        {loc.name} {loc.country}
                        {isCurrent && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Current</span>}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isUnlocked ? `${fishCaught}/${loc.fish.length} species` : `Unlock at Level ${loc.unlockLevel}`}
                      </div>
                    </div>
                  </div>
                  {isUnlocked && !isCurrent && (
                    <button
                      onClick={() => {
                        setFishingGame(prev => ({ ...prev, currentLocation: loc.id }));
                        setFishingScreen('game');
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Travel
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 italic">{loc.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Collection Screen
  const renderFishingCollection = () => {
    const allFish = Object.values(FISH_DATA);
    const filteredFish = collectionFilter === 'all'
      ? allFish
      : allFish.filter(f => f.location === collectionFilter);

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4 pb-24">
        <button onClick={() => setFishingScreen('title')} className="text-white flex items-center gap-2 mb-4">
          <ChevronLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-4 text-center">📖 Fish Collection</h1>

        {/* Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setCollectionFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
              collectionFilter === 'all' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
            }`}
          >
            All ({allFish.length})
          </button>
          {Object.values(FISHING_LOCATIONS).map(loc => (
            <button
              key={loc.id}
              onClick={() => setCollectionFilter(loc.id)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                collectionFilter === loc.id ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
              }`}
            >
              {loc.country} ({loc.fish.length})
            </button>
          ))}
        </div>

        {/* Fish Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredFish.map(fish => {
            const caught = fishingGame.fishCollection[fish.id];
            const pb = fishingGame.personalBests[fish.id];

            return (
              <div key={fish.id} className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-5xl mb-2 text-center">{caught ? fish.emoji : '❓'}</div>
                <div className={`text-center font-bold mb-1 ${caught ? '' : 'blur-sm'}`}>
                  {caught ? fish.name : '???'}
                </div>
                <div className={`text-center text-xs px-2 py-1 rounded ${getRarityStyle(fish.rarity)} mb-2`}>
                  {caught ? fish.rarity.toUpperCase() : '???'}
                </div>
                {caught && (
                  <>
                    <div className="text-xs text-gray-600 text-center">
                      Caught: {caught.count}x
                    </div>
                    {pb && (
                      <div className="text-xs text-center font-semibold text-amber-600 mt-1">
                        PB: {pb}kg
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Shop Screen
  const renderFishingShop = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-400 to-orange-600 p-4 pb-24">
        <button onClick={() => setFishingScreen('title')} className="text-white flex items-center gap-2 mb-4">
          <ChevronLeft size={20} />
          Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">🛒 Shop</h1>
          <div className="bg-white rounded-lg px-4 py-2 font-bold text-amber-600">
            {fishingGame.coins} coins
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {['rods', 'reels', 'lines', 'baits'].map(cat => (
            <button
              key={cat}
              onClick={() => setShopCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                shopCategory === cat ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-3">
          {shopCategory === 'rods' && Object.values(RODS).map(rod => {
            const owned = fishingGame.inventory.rods.includes(rod.id);
            const equipped = fishingGame.equipment.rod === rod.id;
            const canBuy = fishingGame.level >= rod.unlockLevel && fishingGame.coins >= rod.price;

            return (
              <div key={rod.id} className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{rod.name}</div>
                    <div className="text-sm text-gray-600">Cast: {rod.castPower} • Max: {rod.maxLine}</div>
                  </div>
                  <div className="text-right">
                    {equipped && <div className="text-xs bg-green-500 text-white px-2 py-1 rounded mb-1">Equipped</div>}
                    {owned && !equipped && <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded mb-1">Owned</div>}
                    {!owned && <div className="font-bold text-amber-600">{rod.price} coins</div>}
                  </div>
                </div>
                {!owned && fishingGame.level < rod.unlockLevel && (
                  <div className="text-sm text-gray-500">🔒 Unlock at Level {rod.unlockLevel}</div>
                )}
                {!owned && canBuy && (
                  <button className="w-full mt-2 bg-amber-500 text-white py-2 rounded-lg font-semibold">
                    Buy
                  </button>
                )}
                {owned && !equipped && (
                  <button className="w-full mt-2 bg-blue-500 text-white py-2 rounded-lg font-semibold">
                    Equip
                  </button>
                )}
              </div>
            );
          })}
          {/* Similar for other categories - keeping simple for now */}
        </div>
      </div>
    );
  };

  // Stats Screen
  const renderFishingStats = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-700 p-4 pb-24">
        <button onClick={() => setFishingScreen('title')} className="text-white flex items-center gap-2 mb-4">
          <ChevronLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-6 text-center">📊 Statistics</h1>

        <div className="space-y-4">
          {/* Career Stats */}
          <div className="bg-white rounded-xl p-5">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Trophy className="text-amber-500" />
              Career Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{fishingGame.stats.totalCaught}</div>
                <div className="text-sm text-gray-600">Total Fish</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{fishingGame.stats.speciesDiscovered}</div>
                <div className="text-sm text-gray-600">Species</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{fishingGame.stats.totalWeight.toFixed(1)}kg</div>
                <div className="text-sm text-gray-600">Total Weight</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">{fishingGame.stats.biggestCatch}kg</div>
                <div className="text-sm text-gray-600">Biggest Catch</div>
              </div>
            </div>
          </div>

          {/* Rarity Breakdown */}
          <div className="bg-white rounded-xl p-5">
            <h3 className="font-bold text-lg mb-3">By Rarity</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Common</span>
                <span className="font-bold">{fishingGame.stats.commonCaught}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-600">Uncommon</span>
                <span className="font-bold">{fishingGame.stats.uncommonCaught}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600">Rare</span>
                <span className="font-bold">{fishingGame.stats.rareCaught}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-600">Epic</span>
                <span className="font-bold">{fishingGame.stats.epicCaught}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-600">Legendary</span>
                <span className="font-bold">{fishingGame.stats.legendaryCaught}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Fishing Render
  const renderFishing = () => {
    if (fishingScreen === 'title') return renderFishingTitle();
    if (fishingScreen === 'game') return renderFishingGame();
    if (fishingScreen === 'worldmap') return renderFishingWorldMap();
    if (fishingScreen === 'collection') return renderFishingCollection();
    if (fishingScreen === 'shop') return renderFishingShop();
    if (fishingScreen === 'stats') return renderFishingStats();
    return renderFishingTitle();
  };

  // Gallery Screen
  const renderGallery = () => {
    const theme = getTheme();

    return (
      <div className={`min-h-screen ${theme.bg} p-4 pb-24`}>
        <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4">
          <ChevronLeft size={20} /><span>Home</span>
        </button>

        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${theme.text} mb-2`}>Photo Gallery</h2>
          <p className={`${theme.textSecondary}`}>Capture and annotate site photos</p>
        </div>

        {/* Camera button */}
        <button
          onClick={() => setShowCamera(true)}
          className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl font-semibold mb-6 flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <Camera size={24} />
          Take Photo
        </button>

        {/* Photos grid */}
        {photos.length === 0 ? (
          <div className="text-center py-20">
            <Camera size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No photos yet</p>
            <p className="text-sm text-gray-400 mt-1">Tap "Take Photo" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className={`${theme.cardBg} rounded-xl overflow-hidden shadow-sm border ${theme.border}`}>
                <div className="relative aspect-square">
                  <img
                    src={photo.dataUrl}
                    alt={photo.note || 'Site photo'}
                    className="w-full h-full object-cover"
                  />
                </div>
                {photo.note && (
                  <div className="p-2">
                    <p className={`text-xs ${theme.textSecondary}`}>{photo.note}</p>
                  </div>
                )}
                <div className="p-2 flex gap-2">
                  <button
                    onClick={() => {
                      setCapturedPhoto(photo.dataUrl);
                      setShowAnnotation(true);
                    }}
                    className="flex-1 text-xs py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Annotate
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this photo?')) {
                        setPhotos(photos.filter(p => p.id !== photo.id));
                      }
                    }}
                    className="flex-1 text-xs py-2 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="p-4 flex items-center justify-between text-white">
              <button onClick={() => setShowCamera(false)} className="p-2">
                <X size={24} />
              </button>
              <h3 className="font-semibold">Take Photo</h3>
              <div className="w-10" />
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setCapturedPhoto(event.target?.result);
                      setShowCamera(false);
                      setShowAnnotation(true);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold"
              />
            </div>
          </div>
        )}

        {/* Annotation Modal */}
        {showAnnotation && capturedPhoto && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="p-4 flex items-center justify-between border-b">
              <button
                onClick={() => {
                  setShowAnnotation(false);
                  setCapturedPhoto(null);
                }}
                className="text-gray-600"
              >
                <X size={24} />
              </button>
              <h3 className="font-semibold">Add Note & Save</h3>
              <button
                onClick={() => {
                  const note = prompt('Add a note for this photo (optional):');
                  const newPhoto = {
                    id: Date.now().toString(),
                    dataUrl: capturedPhoto,
                    note: note || '',
                    timestamp: new Date().toISOString(),
                  };
                  setPhotos([newPhoto, ...photos]);
                  setShowAnnotation(false);
                  setCapturedPhoto(null);
                }}
                className="text-blue-500 font-semibold"
              >
                Save
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <img src={capturedPhoto} alt="Preview" className="w-full rounded-xl" />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Suppliers Screen
  const renderSuppliers = () => {
    const filteredSuppliers = getFilteredSuppliers();
    return (
      <div className="p-4 pb-24">
        <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4"><ChevronLeft size={20} /><span>Home</span></button>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-teal-500 w-14 h-14 rounded-2xl flex items-center justify-center"><Phone size={28} className="text-white" /></div>
          <div><h1 className="text-xl font-bold text-gray-900">Suppliers</h1><p className="text-gray-500">Quick dial & material lists</p></div>
        </div>
        <div className="relative mb-4">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search suppliers..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          {supplierCategories.map((cat) => {
            const CatIcon = cat.icon;
            return (<button key={cat.id} onClick={() => setSupplierCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${supplierCategory === cat.id ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <CatIcon size={16} />{cat.label}
            </button>);
          })}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button onClick={() => setShowAddSupplier(true)} className="p-3 bg-teal-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"><Plus size={18} /> Add</button>
          <button onClick={() => setShowMaterialList(true)} className="p-3 bg-teal-100 text-teal-700 rounded-xl font-medium flex items-center justify-center gap-2"><FileText size={18} /> Material List</button>
        </div>
        <div className="space-y-3">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-gray-900">{supplier.name}</p>
                <button onClick={() => toggleFavorite(supplier.id)}><Star size={16} className={supplier.favorite ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} /></button>
              </div>
              <p className="text-sm text-gray-500 mb-2">{supplier.address}</p>
              {supplier.website && (
                <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline block mb-2">
                  {supplier.website}
                </a>
              )}
              {supplier.notes && <p className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-lg inline-block mb-2">{supplier.notes}</p>}
              <div className="flex gap-2">
                <a href={`tel:${supplier.phone}`} className="flex-1 p-2 bg-teal-500 text-white rounded-lg font-medium flex items-center justify-center gap-2"><PhoneCall size={16} /> Call</a>
                <a href={`sms:${supplier.phone}`} className="flex-1 p-2 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2"><MessageSquare size={16} /> Text</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Modals
  const renderAddSupplierModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6">
        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">Add Supplier</h2><button onClick={() => setShowAddSupplier(false)} className="p-2"><X size={24} /></button></div>
        <div className="space-y-4">
          <input type="text" value={newSupplier.name} onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} placeholder="Supplier name" className="w-full p-3 bg-gray-100 rounded-xl" />
          <input type="tel" value={newSupplier.phone} onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })} placeholder="Phone number" className="w-full p-3 bg-gray-100 rounded-xl" />
          <input type="text" value={newSupplier.address} onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })} placeholder="Address" className="w-full p-3 bg-gray-100 rounded-xl" />
          <input type="text" value={newSupplier.website} onChange={(e) => setNewSupplier({ ...newSupplier, website: e.target.value })} placeholder="Website (e.g., example.co.uk)" className="w-full p-3 bg-gray-100 rounded-xl" />
          <textarea value={newSupplier.notes} onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })} placeholder="Notes (optional)" className="w-full p-3 bg-gray-100 rounded-xl" rows="2" />
          <button onClick={addSupplier} className="w-full p-4 bg-teal-500 text-white rounded-xl font-semibold">Save</button>
        </div>
      </div>
    </div>
  );

  const renderMaterialListModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold">Material List</h2><button onClick={() => { setShowMaterialList(false); setSelectedSupplier(null); }} className="p-2"><X size={24} /></button></div>
        <div className="space-y-3 mb-4">
          {materialListItems.map((item) => (
            <div key={item.id} className="flex gap-2">
              <input type="text" value={item.item} onChange={(e) => updateMaterialListItem(item.id, 'item', e.target.value)} placeholder="Item" className="flex-1 p-3 bg-gray-100 rounded-xl text-sm" />
              <input type="number" value={item.qty} onChange={(e) => updateMaterialListItem(item.id, 'qty', e.target.value)} placeholder="Qty" className="w-16 p-3 bg-gray-100 rounded-xl text-sm" />
              {materialListItems.length > 1 && <button onClick={() => removeMaterialListItem(item.id)} className="p-3 text-gray-400"><Trash2 size={18} /></button>}
            </div>
          ))}
        </div>
        <button onClick={addMaterialListItem} className="w-full p-3 bg-gray-100 text-gray-600 rounded-xl mb-4 flex items-center justify-center gap-2"><Plus size={18} /> Add Item</button>
        <button onClick={() => navigator.clipboard?.writeText(generateMaterialListText())} className="w-full p-4 bg-teal-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"><Copy size={20} /> Copy List</button>
      </div>
    </div>
  );

  const renderAddTimeModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6">
        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">Log Time</h2><button onClick={() => setShowAddTime(false)} className="p-2"><X size={24} /></button></div>
        <div className="space-y-4">
          <select value={newTimeEntry.project} onChange={(e) => setNewTimeEntry({ ...newTimeEntry, project: e.target.value })} className="w-full p-3 bg-gray-100 rounded-xl">
            <option value="">Select project...</option>
            {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={newTimeEntry.hours} onChange={(e) => setNewTimeEntry({ ...newTimeEntry, hours: e.target.value })} placeholder="Hours" className="p-3 bg-gray-100 rounded-xl" />
            <input type="number" value={newTimeEntry.minutes} onChange={(e) => setNewTimeEntry({ ...newTimeEntry, minutes: e.target.value })} placeholder="Minutes" className="p-3 bg-gray-100 rounded-xl" />
          </div>
          <input type="text" value={newTimeEntry.notes} onChange={(e) => setNewTimeEntry({ ...newTimeEntry, notes: e.target.value })} placeholder="Notes" className="w-full p-3 bg-gray-100 rounded-xl" />
          <button onClick={addTimeEntry} className="w-full p-4 bg-rose-500 text-white rounded-xl font-semibold">Log Time</button>
        </div>
      </div>
    </div>
  );

  const renderAddReceiptModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6">
        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">Add Receipt</h2><button onClick={() => setShowAddReceipt(false)} className="p-2"><X size={24} /></button></div>
        <div className="space-y-4">
          <input type="text" value={newReceipt.supplier} onChange={(e) => setNewReceipt({ ...newReceipt, supplier: e.target.value })} placeholder="Supplier" className="w-full p-3 bg-gray-100 rounded-xl" />
          <input type="number" step="0.01" value={newReceipt.amount} onChange={(e) => setNewReceipt({ ...newReceipt, amount: e.target.value })} placeholder="Amount (£)" className="w-full p-3 bg-gray-100 rounded-xl" />
          <input type="text" value={newReceipt.description} onChange={(e) => setNewReceipt({ ...newReceipt, description: e.target.value })} placeholder="Description" className="w-full p-3 bg-gray-100 rounded-xl" />
          <button onClick={addReceipt} className="w-full p-4 bg-rose-500 text-white rounded-xl font-semibold">Save Receipt</button>
        </div>
      </div>
    </div>
  );

  const renderAddMileageModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6">
        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">Add Journey</h2><button onClick={() => setShowAddMileage(false)} className="p-2"><X size={24} /></button></div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={newMileage.from} onChange={(e) => setNewMileage({ ...newMileage, from: e.target.value })} placeholder="From" className="p-3 bg-gray-100 rounded-xl" />
            <input type="text" value={newMileage.to} onChange={(e) => setNewMileage({ ...newMileage, to: e.target.value })} placeholder="To" className="p-3 bg-gray-100 rounded-xl" />
          </div>
          <input type="number" value={newMileage.miles} onChange={(e) => setNewMileage({ ...newMileage, miles: e.target.value })} placeholder="Miles" className="w-full p-3 bg-gray-100 rounded-xl" />
          <button onClick={addMileage} className="w-full p-4 bg-rose-500 text-white rounded-xl font-semibold">Save</button>
        </div>
      </div>
    </div>
  );

  const renderNewSnagModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6">
        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">New Snag</h2><button onClick={() => setShowNewSnag(false)} className="p-2"><X size={24} /></button></div>
        <input type="text" value={newSnagData.description} onChange={(e) => setNewSnagData({ ...newSnagData, description: e.target.value })} placeholder="What needs doing?" className="w-full p-3 bg-gray-100 rounded-xl mb-4" />
        <button onClick={() => { if (newSnagData.description && selectedRoom) { const newItem = { id: Date.now(), description: newSnagData.description, priority: newSnagData.priority, complete: false, notes: '', date: getTodayDate(), photo: false }; setProjects(projects.map(p => p.id === selectedSnaggingProject.id ? { ...p, snagging: p.snagging.map(r => r.id === selectedRoom.id ? { ...r, items: [...r.items, newItem] } : r) } : p)); setSelectedRoom(prev => ({ ...prev, items: [...prev.items, newItem] })); setNewSnagData({ description: '', priority: 'medium', notes: '' }); setShowNewSnag(false); }}} className="w-full p-4 bg-amber-500 text-white rounded-xl font-semibold">Add Snag</button>
      </div>
    </div>
  );

  const renderNewRoomModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6">
        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">Add Room</h2><button onClick={() => setShowNewRoom(false)} className="p-2"><X size={24} /></button></div>
        <input type="text" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} placeholder="Room name..." className="w-full p-3 bg-gray-100 rounded-xl mb-4" />
        <button onClick={() => { if (newRoomName) { const newRoom = { id: `room${Date.now()}`, name: newRoomName, items: [] }; setProjects(projects.map(p => p.id === selectedSnaggingProject.id ? { ...p, snagging: [...(p.snagging || []), newRoom] } : p)); setSelectedSnaggingProject(prev => ({ ...prev, snagging: [...(prev.snagging || []), newRoom] })); setNewRoomName(''); setShowNewRoom(false); }}} className="w-full p-4 bg-amber-500 text-white rounded-xl font-semibold">Add Room</button>
      </div>
    </div>
  );

  const renderNewProjectModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end overflow-y-auto">
      <div className="bg-white rounded-t-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">New Project</h2>
          <button onClick={() => setShowNewProject(false)} className="p-2"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Project Name *</label>
            <input
              type="text"
              value={newProjectData.name}
              onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
              placeholder="e.g. Royal Crescent - No. 12"
              className="w-full p-3 bg-gray-100 rounded-xl"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Grade</label>
            <select
              value={newProjectData.grade}
              onChange={(e) => setNewProjectData({ ...newProjectData, grade: e.target.value })}
              className="w-full p-3 bg-gray-100 rounded-xl"
            >
              <option value="Grade I">Grade I</option>
              <option value="Grade II*">Grade II*</option>
              <option value="Grade II">Grade II</option>
              <option value="Unlisted">Unlisted</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
            <input
              type="text"
              value={newProjectData.address}
              onChange={(e) => setNewProjectData({ ...newProjectData, address: e.target.value })}
              placeholder="Full address"
              className="w-full p-3 bg-gray-100 rounded-xl"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Client Name</label>
            <input
              type="text"
              value={newProjectData.clientName}
              onChange={(e) => setNewProjectData({ ...newProjectData, clientName: e.target.value })}
              placeholder="Client name"
              className="w-full p-3 bg-gray-100 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Client Phone</label>
              <input
                type="tel"
                value={newProjectData.clientPhone}
                onChange={(e) => setNewProjectData({ ...newProjectData, clientPhone: e.target.value })}
                placeholder="Phone"
                className="w-full p-3 bg-gray-100 rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
              <input
                type="date"
                value={newProjectData.startDate}
                onChange={(e) => setNewProjectData({ ...newProjectData, startDate: e.target.value })}
                className="w-full p-3 bg-gray-100 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Client Email</label>
            <input
              type="email"
              value={newProjectData.clientEmail}
              onChange={(e) => setNewProjectData({ ...newProjectData, clientEmail: e.target.value })}
              placeholder="email@example.com"
              className="w-full p-3 bg-gray-100 rounded-xl"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
            <textarea
              value={newProjectData.notes}
              onChange={(e) => setNewProjectData({ ...newProjectData, notes: e.target.value })}
              placeholder="Project notes..."
              rows="3"
              className="w-full p-3 bg-gray-100 rounded-xl"
            />
          </div>
          <button onClick={addNewProject} className="w-full p-4 bg-amber-500 text-white rounded-xl font-semibold">
            Create Project
          </button>
        </div>
      </div>
    </div>
  );

  const renderProjectPhotos = () => selectedSnaggingProject && (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{selectedSnaggingProject.name} - Photos</h2>
          <button onClick={() => setShowProjectPhotos(false)} className="p-2"><X size={24} /></button>
        </div>

        <label className="w-full p-4 bg-blue-500 text-white rounded-xl font-semibold mb-4 flex items-center justify-center cursor-pointer">
          <Camera size={20} className="mr-2" />
          Take / Upload Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={(e) => handlePhotoUpload(selectedSnaggingProject.id, e)}
            className="hidden"
          />
        </label>

        {selectedSnaggingProject.photos?.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {selectedSnaggingProject.photos.map((photo) => (
              <div key={photo.id} className="relative bg-gray-100 rounded-xl overflow-hidden">
                <img src={photo.url} alt={photo.name} className="w-full h-40 object-cover" />
                <button
                  onClick={() => deletePhoto(selectedSnaggingProject.id, photo.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
                <div className="p-2 bg-white/90">
                  <p className="text-xs text-gray-600">{new Date(photo.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Camera size={48} className="mx-auto mb-2 opacity-30" />
            <p>No photos yet</p>
            <p className="text-sm">Add photos to document your work</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderNewInvoiceModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">Generate Invoice</h2><button onClick={() => setShowNewInvoice(false)} className="p-2"><X size={24} /></button></div>
        <div className="space-y-4">
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Project</label><select value={newInvoiceData.project} onChange={(e) => setNewInvoiceData({...newInvoiceData, project: e.target.value})} className="w-full p-3 bg-gray-100 rounded-xl">{projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="text-sm font-medium text-gray-700 mb-1 block">Hourly Rate (£)</label><input type="number" value={newInvoiceData.hourlyRate} onChange={(e) => setNewInvoiceData({...newInvoiceData, hourlyRate: e.target.value})} className="w-full p-3 bg-gray-100 rounded-xl" /></div><div><label className="text-sm font-medium text-gray-700 mb-1 block">Markup (%)</label><input type="number" value={newInvoiceData.markup} onChange={(e) => setNewInvoiceData({...newInvoiceData, markup: e.target.value})} className="w-full p-3 bg-gray-100 rounded-xl" /></div></div>
          <div><label className="text-sm font-medium text-gray-700 mb-2 block">Include:</label><div className="space-y-2"><label className="flex items-center gap-2"><input type="checkbox" checked={newInvoiceData.includeTime} onChange={(e) => setNewInvoiceData({...newInvoiceData, includeTime: e.target.checked})} className="w-4 h-4" /><span>Time Entries</span></label><label className="flex items-center gap-2"><input type="checkbox" checked={newInvoiceData.includeReceipts} onChange={(e) => setNewInvoiceData({...newInvoiceData, includeReceipts: e.target.checked})} className="w-4 h-4" /><span>Receipts (with markup)</span></label><label className="flex items-center gap-2"><input type="checkbox" checked={newInvoiceData.includeMileage} onChange={(e) => setNewInvoiceData({...newInvoiceData, includeMileage: e.target.checked})} className="w-4 h-4" /><span>Mileage</span></label></div></div>
          <button onClick={generateInvoice} className="w-full p-4 bg-emerald-500 text-white rounded-xl font-semibold">Generate Invoice</button>
        </div>
      </div>
    </div>
  );

  // Time & Expenses
  const renderTimeExpenses = () => {
    const weeklyHours = getWeekTotal(timeEntries, 'hours');
    const weeklyExpenses = getWeekTotal(receipts, 'amount');
    const weeklyMiles = getWeekTotal(mileageEntries, 'miles');
    return (
      <div className="p-4 pb-24">
        <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4"><ChevronLeft size={20} />Home</button>
        <div className="flex items-center gap-4 mb-6"><div className="bg-rose-500 w-14 h-14 rounded-2xl flex items-center justify-center"><Clock size={28} className="text-white" /></div><div><h1 className="text-xl font-bold text-gray-900">Time & Expenses</h1></div></div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-blue-50 rounded-xl p-3 text-center"><p className="text-xl font-bold text-blue-700">{weeklyHours.toFixed(1)}h</p><p className="text-xs text-blue-600">Hours</p></div>
          <div className="bg-green-50 rounded-xl p-3 text-center"><p className="text-xl font-bold text-green-700">£{weeklyExpenses.toFixed(0)}</p><p className="text-xs text-green-600">Spent</p></div>
          <div className="bg-purple-50 rounded-xl p-3 text-center"><p className="text-xl font-bold text-purple-700">{weeklyMiles.toFixed(0)}mi</p><p className="text-xs text-purple-600">Miles</p></div>
        </div>
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
          {['time', 'receipts', 'mileage'].map((tab) => (
            <button key={tab} onClick={() => setTimeTab(tab)} className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize ${timeTab === tab ? 'bg-white shadow-sm' : 'text-gray-500'}`}>{tab}</button>
          ))}
        </div>
        {timeTab === 'time' && <><button onClick={() => setShowAddTime(true)} className="w-full p-4 bg-rose-500 text-white rounded-xl font-semibold mb-4"><Plus size={20} className="inline mr-2" />Log Time</button>{timeEntries.map((e) => <div key={e.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-2"><div className="flex justify-between"><span className="font-semibold">{e.project}</span><span className="font-bold">{formatTime(e.hours, e.minutes)}</span></div></div>)}</>}
        {timeTab === 'receipts' && <><button onClick={() => setShowAddReceipt(true)} className="w-full p-4 bg-rose-500 text-white rounded-xl font-semibold mb-4"><Camera size={20} className="inline mr-2" />Add Receipt</button>{receipts.map((r) => <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-2"><div className="flex justify-between"><span className="font-semibold">{r.supplier}</span><span className="font-bold">{formatCurrency(r.amount)}</span></div></div>)}</>}
        {timeTab === 'mileage' && <><button onClick={() => setShowAddMileage(true)} className="w-full p-4 bg-rose-500 text-white rounded-xl font-semibold mb-4"><Plus size={20} className="inline mr-2" />Add Journey</button>{mileageEntries.map((m) => <div key={m.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-2"><div className="flex justify-between"><span className="font-semibold">{m.from} → {m.to}</span><span className="font-bold">{m.miles * (m.return ? 2 : 1)} mi</span></div></div>)}</>}
      </div>
    );
  };

  // Snagging
  const SnagItem = ({ item, roomId, projectId }) => (
    <div className={`bg-white rounded-xl p-4 border ${item.complete ? 'border-green-200 bg-green-50/50' : 'border-gray-100'} shadow-sm`}>
      <div className="flex items-start gap-3">
        <button onClick={() => toggleSnagComplete(projectId, roomId, item.id)} className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center ${item.complete ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>{item.complete && <Check size={14} />}</button>
        <p className={`flex-1 font-medium ${item.complete ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{item.description}</p>
        <button
          onClick={() => deleteSnagItem(projectId, roomId, item.id)}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  const renderRoomDetail = () => selectedRoom && (
    <div className="p-4 pb-24">
      <button onClick={() => setSelectedRoom(null)} className="flex items-center gap-2 text-blue-500 mb-4"><ChevronLeft size={20} />Back</button>
      <h1 className="text-xl font-bold text-gray-900 mb-4">{selectedRoom.name}</h1>
      <button onClick={() => setShowNewSnag(true)} className="w-full p-4 bg-amber-500 text-white rounded-xl font-semibold mb-4"><Plus size={20} className="inline mr-2" />Add Snag</button>
      <div className="space-y-3">{selectedRoom.items.map((item) => <SnagItem key={item.id} item={item} roomId={selectedRoom.id} projectId={selectedSnaggingProject.id} />)}</div>
    </div>
  );

  const renderProjectSnagging = () => selectedSnaggingProject && (
    <div className="p-4 pb-24">
      <button onClick={() => setSelectedSnaggingProject(null)} className="flex items-center gap-2 text-blue-500 mb-4"><ChevronLeft size={20} />Back</button>
      <h1 className="text-xl font-bold text-gray-900 mb-4">{selectedSnaggingProject.name}</h1>
      <button onClick={() => setShowNewRoom(true)} className="w-full p-4 bg-amber-500 text-white rounded-xl font-semibold mb-4"><Plus size={20} className="inline mr-2" />Add Room</button>
      <div className="space-y-3">{selectedSnaggingProject.snagging?.map((room) => <button key={room.id} onClick={() => setSelectedRoom(room)} className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left"><p className="font-semibold">{room.name}</p><p className="text-sm text-gray-500">{room.items.filter(i => !i.complete).length} pending</p></button>)}</div>
    </div>
  );

  const renderSnagging = () => (
    <div className="p-4 pb-24">
      <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4"><ChevronLeft size={20} />Home</button>
      <div className="flex items-center gap-4 mb-6"><div className="bg-amber-500 w-14 h-14 rounded-2xl flex items-center justify-center"><ClipboardList size={28} className="text-white" /></div><div><h1 className="text-xl font-bold text-gray-900">Projects</h1></div></div>
      <button onClick={() => setShowNewProject(true)} className="w-full p-4 bg-amber-500 text-white rounded-xl font-semibold mb-4"><Plus size={20} className="inline mr-2" />New Project</button>
      <div className="space-y-3">{projects.map((p) => (
        <div key={p.id} className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setSelectedSnaggingProject(p)} className="flex-1 text-left">
              <p className="font-semibold text-gray-900">{p.name}</p>
              <p className="text-sm text-gray-500">{p.grade} • {p.snagging?.length || 0} rooms</p>
            </button>
            <button
              onClick={() => {
                setSelectedSnaggingProject(p);
                setShowProjectPhotos(true);
              }}
              className="ml-2 p-2 bg-blue-50 text-blue-600 rounded-lg flex items-center gap-1"
            >
              <Camera size={18} />
              <span className="text-xs font-medium">{p.photos?.length || 0}</span>
            </button>
          </div>
        </div>
      ))}</div>
    </div>
  );

  // Conversions
  const renderConversions = () => {
    const lengthResult = convertLength();
    return (
      <div className="p-4 pb-24">
        <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4"><ChevronLeft size={20} />Home</button>
        <div className="flex items-center gap-4 mb-6"><div className="bg-indigo-500 w-14 h-14 rounded-2xl flex items-center justify-center"><ArrowLeftRight size={28} className="text-white" /></div><div><h1 className="text-xl font-bold text-gray-900">Quick Conversions</h1></div></div>
        <div className="flex gap-2 mb-4">
          {['length', 'reference'].map((tab) => <button key={tab} onClick={() => setConversionType(tab)} className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize ${conversionType === tab ? 'bg-indigo-500 text-white' : 'bg-gray-100'}`}>{tab}</button>)}
        </div>
        {conversionType === 'length' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div><label className="text-sm text-gray-600">Feet</label><input type="number" value={feetInput} onChange={(e) => setFeetInput(e.target.value)} className="w-full p-3 bg-gray-100 rounded-xl" /></div>
              <div><label className="text-sm text-gray-600">Inches</label><input type="number" value={inchesInput} onChange={(e) => setInchesInput(e.target.value)} className="w-full p-3 bg-gray-100 rounded-xl" /></div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 grid grid-cols-3 gap-2 text-center">
              <div><p className="text-sm text-indigo-600">mm</p><p className="text-xl font-bold text-indigo-900">{lengthResult.mm}</p></div>
              <div><p className="text-sm text-indigo-600">cm</p><p className="text-xl font-bold text-indigo-900">{lengthResult.cm}</p></div>
              <div><p className="text-sm text-indigo-600">m</p><p className="text-xl font-bold text-indigo-900">{lengthResult.m}</p></div>
            </div>
          </div>
        )}
        {conversionType === 'reference' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-3">Georgian Dimensions</h3>
            {quickReferences.georgian.map((ref, i) => <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0"><span className="text-gray-700">{ref.name}</span><div className="text-right"><p className="font-medium">{ref.metric}</p><p className="text-sm text-gray-400">{ref.imperial}</p></div></div>)}
          </div>
        )}
      </div>
    );
  };

  // Heritage
  const renderHeritage = () => (
    <div className="p-4 pb-24">
      <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4"><ChevronLeft size={20} />Home</button>
      <div className="flex items-center gap-4 mb-6"><div className="bg-stone-500 w-14 h-14 rounded-2xl flex items-center justify-center"><Landmark size={28} className="text-white" /></div><div><h1 className="text-xl font-bold text-gray-900">Bath Heritage</h1></div></div>
      <div className="space-y-3">
        {Object.entries(heritageData).map(([id, section]) => {
          const SectionIcon = section.icon;
          return <button key={id} className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-100"><div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center"><SectionIcon size={24} className="text-stone-600" /></div><div className="flex-1 text-left"><p className="font-semibold">{section.title}</p><p className="text-sm text-gray-500">{section.desc}</p></div><ChevronRight size={20} className="text-gray-400" /></button>;
        })}
      </div>
    </div>
  );

  // Calculators
  const renderCalculator = () => {
    const calc = calculators.find(c => c.id === selectedCalc);
    const CalcIcon = calc?.icon;
    let results, content;
    if (selectedCalc === 'plaster') { results = calculatePlaster(); content = (<><div className="grid grid-cols-2 gap-3"><InputField label="Length" value={plasterInputs.length} onChange={(v) => setPlasterInputs({...plasterInputs, length: v})} unit="m" /><InputField label="Width" value={plasterInputs.width} onChange={(v) => setPlasterInputs({...plasterInputs, width: v})} unit="m" /></div><InputField label="Height" value={plasterInputs.height} onChange={(v) => setPlasterInputs({...plasterInputs, height: v})} unit="m" /><div className="pt-4 border-t grid grid-cols-2 gap-3"><ResultCard label="Area" value={results.totalArea} unit="m²" /><ResultCard label="Bags" value={results.bags} unit="bags" highlight /></div></>); }
    else if (selectedCalc === 'paint') { results = calculatePaint(); content = (<><div className="grid grid-cols-2 gap-3"><InputField label="Length" value={paintInputs.length} onChange={(v) => setPaintInputs({...paintInputs, length: v})} unit="m" /><InputField label="Width" value={paintInputs.width} onChange={(v) => setPaintInputs({...paintInputs, width: v})} unit="m" /></div><InputField label="Height" value={paintInputs.height} onChange={(v) => setPaintInputs({...paintInputs, height: v})} unit="m" /><div className="pt-4 border-t grid grid-cols-2 gap-3"><ResultCard label="Litres" value={results.litres} unit="L" /><ResultCard label="Tins" value={results.tins25} unit="2.5L" highlight /></div></>); }
    else if (selectedCalc === 'timber') { results = calculateTimber(); content = (<><InputField label="Perimeter" value={timberInputs.perimeter} onChange={(v) => setTimberInputs({...timberInputs, perimeter: v})} unit="m" /><InputField label="Doors" value={timberInputs.doors} onChange={(e) => setTimberInputs({...timberInputs, doors: e})} /><div className="pt-4 border-t grid grid-cols-2 gap-3"><ResultCard label="Length" value={results.withWastage} unit="m" /><ResultCard label="3m pcs" value={results.lengths3m} unit="pcs" highlight /></div></>); }
    else if (selectedCalc === 'tiles') { results = calculateTiles(); content = (<><div className="grid grid-cols-2 gap-3"><InputField label="Length" value={tileInputs.length} onChange={(v) => setTileInputs({...tileInputs, length: v})} unit="cm" /><InputField label="Width" value={tileInputs.width} onChange={(v) => setTileInputs({...tileInputs, width: v})} unit="cm" /></div><div className="pt-4 border-t grid grid-cols-2 gap-3"><ResultCard label="Area" value={results.area} unit="m²" /><ResultCard label="Tiles" value={results.tilesWithWastage} unit="pcs" highlight /></div></>); }
    else if (selectedCalc === 'concrete') { results = calculateConcrete(); content = (<><div className="grid grid-cols-2 gap-3"><InputField label="Length" value={concreteInputs.length} onChange={(v) => setConcreteInputs({...concreteInputs, length: v})} unit="mm" /><InputField label="Width" value={concreteInputs.width} onChange={(v) => setConcreteInputs({...concreteInputs, width: v})} unit="mm" /></div><InputField label="Depth" value={concreteInputs.depth} onChange={(v) => setConcreteInputs({...concreteInputs, depth: v})} unit="mm" /><div className="pt-4 border-t grid grid-cols-2 gap-3"><ResultCard label="Volume" value={results.volume} unit="m³" /><ResultCard label="Bags" value={results.bags25kg} unit="25kg" highlight /></div></>); }
    else { results = calculateStud(); content = (<><InputField label="Length" value={studInputs.length} onChange={(v) => setStudInputs({...studInputs, length: v})} unit="mm" /><InputField label="Height" value={studInputs.height} onChange={(v) => setStudInputs({...studInputs, height: v})} unit="mm" /><div className="pt-4 border-t grid grid-cols-2 gap-3"><ResultCard label="Studs" value={results.studs} unit="pcs" /><ResultCard label="Boards" value={results.boardsNeeded} unit="sheets" highlight /></div></>); }
    return (
      <div className="p-4 pb-24">
        <button onClick={() => setCurrentScreen('calculators')} className="flex items-center gap-2 text-blue-500 mb-4"><ChevronLeft size={20} />Calculators</button>
        <div className="flex items-center gap-4 mb-6"><div className={`${calc?.color} w-14 h-14 rounded-2xl flex items-center justify-center`}>{CalcIcon && <CalcIcon size={28} className="text-white" />}</div><div><h1 className="text-xl font-bold">{calc?.title}</h1></div></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">{content}</div>
      </div>
    );
  };

  const renderCalculatorsList = () => (
    <div className="p-4 pb-24">
      <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4"><ChevronLeft size={20} />Home</button>
      <div className="flex items-center gap-4 mb-6"><div className="bg-green-500 w-14 h-14 rounded-2xl flex items-center justify-center"><Calculator size={28} className="text-white" /></div><div><h1 className="text-xl font-bold">Calculators</h1></div></div>
      <div className="space-y-3">
        {calculators.map((calc) => {
          const CalcIcon = calc.icon;
          return <button key={calc.id} onClick={() => { setSelectedCalc(calc.id); setCurrentScreen('calculator'); }} className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-100"><div className={`${calc.color} w-12 h-12 rounded-xl flex items-center justify-center`}><CalcIcon size={24} className="text-white" /></div><div className="flex-1 text-left"><p className="font-semibold">{calc.title}</p><p className="text-sm text-gray-500">{calc.desc}</p></div><ChevronRight size={20} className="text-gray-400" /></button>;
        })}
      </div>
    </div>
  );

  // Weather Background Animations
  const WeatherBackground = ({ condition }) => {
    if (!condition) return null;

    const renderWeatherElements = () => {
      switch (condition) {
        case 'sunny':
          return Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="weather-sunray"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
                animationDelay: `${i * 1.5}s`,
                transform: `rotate(${i * 30}deg)`
              }}
            />
          ));

        case 'partly-cloudy':
          return (
            <>
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={`sun-${i}`}
                  className="weather-sunray"
                  style={{
                    top: `${15 + i * 20}%`,
                    left: `${15 + i * 30}%`,
                    animationDelay: `${i * 2}s`,
                    transform: `rotate(${i * 45}deg)`
                  }}
                />
              ))}
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`cloud-${i}`}
                  className="weather-cloud"
                  style={{
                    top: `${25 + i * 25}%`,
                    animationDelay: `${i * 8}s`,
                    animationDuration: `${20 + i * 5}s`
                  }}
                />
              ))}
            </>
          );

        case 'cloudy':
          return Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="weather-cloud"
              style={{
                top: `${15 + i * 18}%`,
                animationDelay: `${i * 5}s`,
                animationDuration: `${22 + i * 3}s`
              }}
            />
          ));

        case 'rain':
          return Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="weather-raindrop"
              style={{
                left: `${5 + (i * 5)}%`,
                top: `${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.8 + Math.random() * 0.5}s`
              }}
            />
          ));

        case 'snow':
          return Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="weather-snowflake"
              style={{
                left: `${5 + (i * 6)}%`,
                top: `${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ));

        case 'storm':
          return (
            <>
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={`rain-${i}`}
                  className="weather-raindrop"
                  style={{
                    left: `${5 + (i * 6)}%`,
                    top: `${Math.random() * 20}%`,
                    animationDelay: `${Math.random() * 1}s`,
                    animationDuration: `${0.5 + Math.random() * 0.3}s`
                  }}
                />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`wind-${i}`}
                  className="weather-windline"
                  style={{
                    top: `${20 + i * 10}%`,
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </>
          );

        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {renderWeatherElements()}
      </div>
    );
  };

  // Home
  const renderHome = () => {
    const theme = getTheme();

    return (
      <div className="p-4 pb-24 relative">
        {/* Weather Background Animations */}
        {weatherData && <WeatherBackground condition={weatherData.current.condition} />}

        <div className="mb-6 relative z-10">
          <h1 className={`text-2xl font-bold ${theme.text} transition-colors duration-500`}>Rich's Toolkit</h1>
          <p className={`${theme.textSecondary} transition-colors duration-500`}>Bath Heritage Renovations</p>
          <div className={`mt-2 px-3 py-2 rounded-lg ${theme.cardBg} border ${theme.border} transition-all duration-500`}>
            <p className={`text-sm italic ${theme.textSecondary} transition-colors duration-500 text-center`}>"{getDailyAffirmation()}"</p>
          </div>
        </div>

        {/* Weather Card - Now Tappable */}
        <div className="relative z-10">
        {weatherLoading || !weatherData ? (
          <div className={`w-full bg-gradient-to-r ${theme.weatherCardGradient} rounded-2xl p-4 mb-4 text-white transition-all duration-500`}>
            <div className="flex items-center justify-center py-6">
              <Loader2 size={32} className="animate-spin text-white/80" />
            </div>
          </div>
        ) : weatherError ? (
          <div className="w-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl p-4 mb-4 text-white">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} />
              <div>
                <p className="font-semibold">Weather Unavailable</p>
                <p className="text-sm opacity-90">Tap to retry</p>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => setCurrentScreen('weather')} className={`w-full text-left bg-gradient-to-r ${theme.weatherCardGradient} rounded-2xl p-4 mb-4 text-white transition-all duration-500`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={14} className="opacity-75" />
                  <p className="text-sm opacity-90">Bath, Today</p>
                </div>
                <p className="text-3xl font-bold">{weatherData.current.temp}°C</p>
                <p className="text-sm opacity-90">{weatherData.current.description}</p>
              </div>
              <div className="text-right">
                <div className="text-white/90 mb-2">{getWeatherIcon(weatherData.current.condition, 40)}</div>
                <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  weatherData.daily[0].workScore >= 80 ? 'bg-green-400/30 text-green-100' :
                  weatherData.daily[0].workScore >= 50 ? 'bg-amber-400/30 text-amber-100' : 'bg-red-400/30 text-red-100'
                }`}>
                  {getWorkScoreLabel(weatherData.daily[0].workScore)} for work
                </div>
              </div>
            </div>
            {weatherData.alerts.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2">
                <AlertTriangle size={14} />
                <span className="text-sm">{weatherData.alerts.length} weather alert{weatherData.alerts.length > 1 ? 's' : ''} - tap for details</span>
              </div>
            )}
          </button>
        )}
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          {[
            { id: 'calculators', title: 'Calculators', icon: Calculator, color: 'bg-green-500', desc: 'Materials & quantities' },
            { id: 'snagging', title: 'Snagging', icon: ClipboardList, color: 'bg-amber-500', desc: 'Snag lists' },
            { id: 'time', title: 'Time & Expenses', icon: Clock, color: 'bg-rose-500', desc: 'Hours & receipts' },
            { id: 'invoices', title: 'Invoices', icon: FileText, color: 'bg-emerald-500', desc: 'Generate & track' },
            { id: 'budget', title: 'Budget', icon: PiggyBank, color: 'bg-pink-500', desc: 'Track spending' },
            { id: 'suppliers', title: 'Suppliers', icon: Phone, color: 'bg-teal-500', desc: 'Quick dial' },
            { id: 'weather', title: 'Weather', icon: Cloud, color: 'bg-sky-500', desc: '7-day forecast' },
            { id: 'gallery', title: 'Gallery', icon: Camera, color: 'bg-purple-500', desc: 'Photos & notes' },
            { id: 'conversions', title: 'Conversions', icon: ArrowLeftRight, color: 'bg-indigo-500', desc: 'Imperial ↔ Metric' },
            { id: 'fishing', title: 'Fishing', icon: Fish, color: 'bg-blue-600', desc: 'Fishing adventure' },
          ].map((feature) => {
            const IconComponent = feature.icon;
            return <button key={feature.id} onClick={() => setCurrentScreen(feature.id)} className={`${theme.cardBg} rounded-2xl p-4 text-left shadow-sm border ${theme.border} active:scale-95 transition-all duration-500`}><div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}><IconComponent size={24} className="text-white" /></div><h3 className={`font-semibold ${theme.text}`}>{feature.title}</h3><p className={`text-sm ${theme.textSecondary}`}>{feature.desc}</p></button>;
          })}
        </div>
        
        <div className="mt-6 relative z-10">
          <h2 className={`text-lg font-semibold ${theme.text} mb-3 transition-colors duration-500`}>Recent Projects</h2>
          <div className="space-y-2">
            {projects.slice(0, 2).map((project) => (
              <div key={project.id} className={`${theme.cardBg} rounded-xl p-4 flex items-center justify-between shadow-sm border ${theme.border} transition-all duration-500`}>
                <div className="flex items-center gap-3"><div className={`w-10 h-10 ${theme.isDay ? 'bg-stone-100' : 'bg-stone-700'} rounded-lg flex items-center justify-center transition-colors duration-500`}><Building2 size={20} className={`${theme.isDay ? 'text-stone-600' : 'text-stone-300'} transition-colors duration-500`} /></div><div><p className={`font-medium ${theme.text} transition-colors duration-500`}>{project.name}</p><p className={`text-sm ${theme.textSecondary} transition-colors duration-500`}>{project.grade}</p></div></div>
                <ChevronRight size={20} className={`${theme.textSecondary} transition-colors duration-500`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Invoices Screen
  const renderInvoices = () => (
    <div className="p-4 pb-24">
      <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4"><ChevronLeft size={20} />Home</button>
      <div className="flex items-center gap-4 mb-6"><div className="bg-emerald-500 w-14 h-14 rounded-2xl flex items-center justify-center"><FileText size={28} className="text-white" /></div><div><h1 className="text-xl font-bold">Invoices</h1></div></div>
      <button onClick={() => setShowNewInvoice(true)} className="w-full p-4 bg-emerald-500 text-white rounded-xl font-semibold mb-4"><Plus size={20} className="inline mr-2" />Generate Invoice</button>
      {invoices.length > 0 ? (
        <div className="space-y-3">{invoices.map(inv => (
          <div key={inv.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div><p className="font-semibold">{inv.invoiceNumber}</p><p className="text-sm text-gray-500">{inv.project}</p></div>
              <button onClick={() => toggleInvoiceStatus(inv.id)} className={`px-3 py-1 rounded-lg text-xs font-semibold ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{inv.status === 'paid' ? 'Paid' : 'Unpaid'}</button>
            </div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">{new Date(inv.date).toLocaleDateString()}</span><span className="font-bold text-emerald-600">£{inv.total.toFixed(2)}</span></div>
          </div>
        ))}</div>
      ) : (<div className="text-center py-12 text-gray-500"><FileText size={48} className="mx-auto mb-2 opacity-30" /><p>No invoices yet</p></div>)}
    </div>
  );

  // Budget Screen
  const renderBudget = () => {
    const totalBudget = budgets.personal.categories.reduce((sum, cat) => sum + cat.budget, 0);
    const totalSpent = budgets.personal.categories.reduce((sum, cat) => sum + cat.spent, 0);

    const colorOptions = [
      { value: 'bg-blue-500', label: 'Blue', class: 'bg-blue-500' },
      { value: 'bg-green-500', label: 'Green', class: 'bg-green-500' },
      { value: 'bg-purple-500', label: 'Purple', class: 'bg-purple-500' },
      { value: 'bg-orange-500', label: 'Orange', class: 'bg-orange-500' },
      { value: 'bg-red-500', label: 'Red', class: 'bg-red-500' },
      { value: 'bg-pink-500', label: 'Pink', class: 'bg-pink-500' },
      { value: 'bg-yellow-500', label: 'Yellow', class: 'bg-yellow-500' },
      { value: 'bg-teal-500', label: 'Teal', class: 'bg-teal-500' },
      { value: 'bg-indigo-500', label: 'Indigo', class: 'bg-indigo-500' },
      { value: 'bg-gray-500', label: 'Gray', class: 'bg-gray-500' },
    ];

    return (
      <div className="p-4 pb-24">
        <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-2 text-blue-500 mb-4"><ChevronLeft size={20} />Home</button>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-pink-500 w-14 h-14 rounded-2xl flex items-center justify-center"><PiggyBank size={28} className="text-white" /></div>
            <h1 className="text-xl font-bold">Budget Tracker</h1>
          </div>
          <button onClick={() => setShowAddCategory(true)} className="bg-pink-500 text-white p-2 rounded-lg"><Plus size={20} /></button>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-4 mb-4 text-white">
          <p className="text-sm opacity-90 mb-1">Monthly Budget</p>
          <p className="text-3xl font-bold">£{totalSpent.toFixed(0)} / £{totalBudget.toFixed(0)}</p>
          <div className="mt-2 bg-white/20 rounded-full h-2"><div className="bg-white rounded-full h-2" style={{width: `${Math.min((totalSpent/totalBudget)*100, 100)}%`}}></div></div>
        </div>

        <div className="space-y-3">
          {budgets.personal.categories.map(cat => {
            const percent = (cat.spent / cat.budget) * 100;
            const isEditing = editingCategory === cat.id;

            return (
              <div key={cat.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => updateCategoryBudget(cat.id, 'name', e.target.value)}
                      className="w-full p-2 border rounded-lg font-semibold"
                      placeholder="Category name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">Budget</label>
                        <input
                          type="number"
                          value={cat.budget}
                          onChange={(e) => updateCategoryBudget(cat.id, 'budget', e.target.value)}
                          className="w-full p-2 border rounded-lg"
                          placeholder="Budget"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Spent</label>
                        <input
                          type="number"
                          value={cat.spent}
                          onChange={(e) => updateCategoryBudget(cat.id, 'spent', e.target.value)}
                          className="w-full p-2 border rounded-lg"
                          placeholder="Spent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Color</label>
                      <div className="flex gap-2 flex-wrap">
                        {colorOptions.map(color => (
                          <button
                            key={color.value}
                            onClick={() => updateCategoryBudget(cat.id, 'color', color.value)}
                            className={`w-8 h-8 rounded-full ${color.class} ${cat.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingCategory(null)} className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold">Done</button>
                      <button onClick={() => deleteBudgetCategory(cat.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">£{cat.spent} / £{cat.budget}</span>
                        <button onClick={() => setEditingCategory(cat.id)} className="text-blue-500 p-1"><Settings size={16} /></button>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2"><div className={`${cat.color} rounded-full h-2`} style={{width: `${Math.min(percent, 100)}%`}}></div></div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4" onClick={() => setShowAddCategory(false)}>
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add Budget Category</h2>
                <button onClick={() => setShowAddCategory(false)} className="text-gray-400"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Category Name</label>
                  <input
                    type="text"
                    value={newCategoryData.name}
                    onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border rounded-lg"
                    placeholder="e.g., Groceries, Transport"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Budget Amount</label>
                    <input
                      type="number"
                      value={newCategoryData.budget}
                      onChange={(e) => setNewCategoryData(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full p-3 border rounded-lg"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Already Spent</label>
                    <input
                      type="number"
                      value={newCategoryData.spent}
                      onChange={(e) => setNewCategoryData(prev => ({ ...prev, spent: e.target.value }))}
                      className="w-full p-3 border rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setNewCategoryData(prev => ({ ...prev, color: color.value }))}
                        className={`w-10 h-10 rounded-full ${color.class} ${newCategoryData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <button onClick={addBudgetCategory} className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold">Add Category</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCurrentScreen = () => {
    if (currentScreen === 'home') return renderHome();
    if (currentScreen === 'calculators') return renderCalculatorsList();
    if (currentScreen === 'calculator') return renderCalculator();
    if (currentScreen === 'heritage') return renderHeritage();
    if (currentScreen === 'conversions') return renderConversions();
    if (currentScreen === 'time') return renderTimeExpenses();
    if (currentScreen === 'invoices') return renderInvoices();
    if (currentScreen === 'budget') return renderBudget();
    if (currentScreen === 'suppliers') return renderSuppliers();
    if (currentScreen === 'weather') return renderWeather();
    if (currentScreen === 'gallery') return renderGallery();
    if (currentScreen === 'fishing') return renderFishing();
    if (currentScreen === 'snagging') {
      if (selectedRoom) return renderRoomDetail();
      if (selectedSnaggingProject) return renderProjectSnagging();
      return renderSnagging();
    }
    return renderHome();
  };

  const theme = getTheme();

  // Format current time as HH:MM
  const formatCurrentTime = () => {
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Format current date
  const formatCurrentDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[currentTime.getDay()];
    const day = currentTime.getDate();
    const month = months[currentTime.getMonth()];
    return `${dayName} ${day} ${month}`;
  };

  // Check for special events
  const getSpecialEvent = () => {
    const month = currentTime.getMonth(); // 0-11
    const date = currentTime.getDate();

    // New Year's Day (Jan 1)
    if (month === 0 && date === 1) return 'newyear';

    // Birthday month (August)
    if (month === 7) return 'birthday';

    // Christmas Day (December 25)
    if (month === 11 && date === 25) return 'christmas';

    return null;
  };

  // Get daily builder affirmation (rotates through 50 quotes)
  const getDailyAffirmation = () => {
    const affirmations = [
      "Every brick laid is progress made.",
      "Quality work speaks louder than words.",
      "Heritage isn't just restored, it's honoured.",
      "Precision today prevents problems tomorrow.",
      "Your craftsmanship preserves history.",
      "Measure twice, build once, build right.",
      "Each project tells a story of skill.",
      "Excellence in every joint and corner.",
      "Building Bath's future while honouring its past.",
      "Your attention to detail makes the difference.",
      "Georgian elegance meets modern expertise.",
      "Restoration is an art, and you're the artist.",
      "Steady hands, steady progress.",
      "Every day shapes something beautiful.",
      "Lime mortar and patience create perfection.",
      "Your work will stand the test of time.",
      "Heritage buildings deserve heritage skills.",
      "Build with pride, restore with respect.",
      "Another day, another masterpiece in progress.",
      "The best builders never stop learning.",
      "Your skills bring old stones to life.",
      "Quality craftsmanship is never rushed.",
      "Bath's heritage is safe in your hands.",
      "Every restoration preserves a piece of history.",
      "Skilled hands, sharp mind, beautiful work.",
      "From foundation to finish, excellence matters.",
      "Today's effort is tomorrow's legacy.",
      "Building better, one project at a time.",
      "Your work echoes through the centuries.",
      "Precision, patience, and pride in every task.",
      "The best view comes after the hardest climb.",
      "Every challenge overcome is a skill sharpened.",
      "Your dedication shows in every detail.",
      "Georgian Bath lives on through your work.",
      "Restoration requires patience and passion.",
      "Building strong foundations for lasting results.",
      "Your craftsmanship honours the original builders.",
      "Every project is a chance to excel.",
      "Heritage work is heart work.",
      "From Bath stone to Bath pride.",
      "Your skills preserve architectural treasures.",
      "Building tomorrow while respecting yesterday.",
      "Quality over quantity, always.",
      "The right tools and the right attitude.",
      "Your work adds value to Bath's beauty.",
      "Every restoration tells two stories.",
      "Skilled hands create timeless work.",
      "Building with integrity, restoring with care.",
      "Your expertise keeps history alive.",
      "Another day to build something remarkable."
    ];

    // Use day of year to select affirmation (resets at midnight)
    const startOfYear = new Date(currentTime.getFullYear(), 0, 0);
    const diff = currentTime - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Rotate through all 50 affirmations
    return affirmations[dayOfYear % affirmations.length];
  };

  const specialEvent = getSpecialEvent();

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-500`}>
      <div className={`max-w-sm mx-auto ${theme.bg} min-h-screen relative transition-colors duration-500`}>
        {/* Time and date display - top right corner */}
        <div className={`fixed top-4 right-4 ${theme.cardBg} px-3 py-2 rounded-lg shadow-sm border ${theme.border} transition-all duration-500 z-50 text-right`}>
          <div className={`text-sm font-semibold ${theme.text} transition-colors duration-500`}>{formatCurrentTime()}</div>
          <div className={`text-xs ${theme.textSecondary} transition-colors duration-500`}>{formatCurrentDate()}</div>
        </div>

        {/* Greeting popup */}
        {showGreeting && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce">
              <p className="text-3xl font-bold">{greetingMessage}</p>
            </div>
          </div>
        )}

        {/* Special event animations */}
        {specialEvent && (
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {specialEvent === 'christmas' && (
              <>
                {/* Falling presents and Christmas trees */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const christmasItems = ['🎁', '🎄', '🎁', '🎄', '⭐'];
                  return (
                    <div
                      key={`christmas-${i}`}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 20}%`,
                        animation: `fall-snow ${4 + Math.random() * 3}s linear infinite`,
                        animationDelay: `${Math.random() * 4}s`,
                        fontSize: `${14 + Math.random() * 8}px`,
                      }}
                    >
                      {christmasItems[Math.floor(Math.random() * christmasItems.length)]}
                    </div>
                  );
                })}
              </>
            )}

            {specialEvent === 'newyear' && (
              <>
                {/* Confetti for New Year */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const colors = ['🎉', '🎊', '✨', '🎆', '🎇'];
                  return (
                    <div
                      key={`confetti-${i}`}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 20}%`,
                        animation: `fall-snow ${3 + Math.random() * 2}s linear infinite`,
                        animationDelay: `${Math.random() * 3}s`,
                        fontSize: '16px',
                      }}
                    >
                      {colors[Math.floor(Math.random() * colors.length)]}
                    </div>
                  );
                })}
              </>
            )}

            {specialEvent === 'birthday' && (
              <>
                {/* Birthday balloons and confetti */}
                {Array.from({ length: 15 }).map((_, i) => {
                  const balloons = ['🎈', '🎂', '🎁', '🎉', '🎊'];
                  return (
                    <div
                      key={`birthday-${i}`}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        bottom: `-${Math.random() * 20}%`,
                        animation: `float-balloon ${5 + Math.random() * 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                        fontSize: '20px',
                      }}
                    >
                      {balloons[Math.floor(Math.random() * balloons.length)]}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {renderCurrentScreen()}

        <div className={`fixed bottom-0 left-0 right-0 ${theme.cardBg} border-t ${theme.border} px-6 py-3 max-w-sm mx-auto transition-all duration-500 z-50`}>
          <div className="flex justify-around">
            {[
              { icon: Home, label: 'Home', screen: 'home' },
              { icon: Calculator, label: 'Calculate', screen: 'calculators' },
              { icon: Cloud, label: 'Weather', screen: 'weather' },
              { icon: Phone, label: 'Suppliers', screen: 'suppliers' },
            ].map((item) => {
              const NavIcon = item.icon;
              const isActive = currentScreen === item.screen || (item.screen === 'calculators' && currentScreen === 'calculator');
              return <button key={item.label} onClick={() => { setCurrentScreen(item.screen); setSelectedSnaggingProject(null); setSelectedRoom(null); setHeritageSection(null); }} className={`flex flex-col items-center gap-1 transition-colors duration-500 ${isActive ? 'text-blue-500' : theme.textSecondary}`}><NavIcon size={24} /><span className="text-xs">{item.label}</span></button>;
            })}
          </div>
        </div>

        {showAddTime && renderAddTimeModal()}
        {showAddReceipt && renderAddReceiptModal()}
        {showAddMileage && renderAddMileageModal()}
        {showNewSnag && renderNewSnagModal()}
        {showNewRoom && renderNewRoomModal()}
        {showNewProject && renderNewProjectModal()}
        {showProjectPhotos && renderProjectPhotos()}
        {showNewInvoice && renderNewInvoiceModal()}
        {showAddSupplier && renderAddSupplierModal()}
        {showMaterialList && renderMaterialListModal()}
      </div>
    </div>
  );
}
