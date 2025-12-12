import React, { useState } from 'react';
import { Calculator, ChevronRight, ChevronLeft, Home, Camera, ClipboardList, PaintBucket, Ruler, Grid3X3, Package, Layers, Plus, Building2, Sun, Landmark, Image, FileText, X, Clock, MapPin, Calendar, Phone, Square, AlertTriangle, CheckCircle, Check, Flag, Send, ArrowLeftRight, Receipt, Car, Trash2, Star, MessageSquare, Copy, PhoneCall, Search, Users, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, Wind, Droplets, Thermometer, Umbrella, AlertCircle, CloudSun, Moon, Sunrise, Sunset, Eye, Loader2 } from 'lucide-react';
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
    { id: 1, name: 'Travis Perkins Bath', category: 'merchants', phone: '01225 444555', address: 'Lower Bristol Road, Bath', favorite: true, notes: 'Ask for trade discount - account #TP4421' },
    { id: 2, name: 'Jewson Bath', category: 'merchants', phone: '01225 333666', address: 'Locksbrook Road, Bath', favorite: true, notes: 'Good for timber, delivers before 7am' },
    { id: 3, name: 'Selco Builders Warehouse', category: 'merchants', phone: '01225 789456', address: 'Brassmill Lane, Bath', favorite: false, notes: 'Cash & carry, competitive prices' },
    { id: 4, name: 'Buildbase Bath', category: 'merchants', phone: '01225 424242', address: 'Midland Road, Bath', favorite: false, notes: 'Plumbing and heavy materials' },

    // Bath Stone & Masonry
    { id: 5, name: 'Hartham Park Quarry', category: 'stone', phone: '01225 811083', address: 'Corsham, Wiltshire', favorite: true, notes: 'Best for new Bath stone' },
    { id: 6, name: 'Bath & Portland Stone', category: 'stone', phone: '01225 858555', address: 'Corsham', favorite: true, notes: 'Ashlar, mouldings, restoration stone' },
    { id: 7, name: 'Stoke Ground Stone', category: 'stone', phone: '01225 742488', address: 'Box, Corsham', favorite: false, notes: 'Premium Bath stone, slow delivery' },
    { id: 8, name: 'Stone Projects', category: 'stone', phone: '01225 315315', address: 'Bath', favorite: false, notes: 'Stone cutting and bespoke work' },

    // Heritage & Lime Specialists
    { id: 9, name: 'Mike Wye Associates', category: 'heritage', phone: '01409 281644', address: 'Devon (delivers)', favorite: true, notes: 'Lime putty, NHL, traditional paints' },
    { id: 10, name: 'Lime Technology', category: 'heritage', phone: '01952 728611', address: 'Shropshire (delivers)', favorite: true, notes: 'Hemp lime, insulation, breathable systems' },
    { id: 11, name: 'Ty-Mawr Lime', category: 'heritage', phone: '01874 658249', address: 'Wales (delivers)', favorite: false, notes: 'Natural hydraulic lime, plasters' },
    { id: 12, name: 'The Bath Stone Company', category: 'heritage', phone: '01225 858444', address: 'Corsham', favorite: false, notes: 'Conservation and restoration advice' },

    // Tool Hire & Plant
    { id: 13, name: 'Speedy Hire Bath', category: 'hire', phone: '01225 555111', address: 'Lower Bristol Road, Bath', favorite: true, notes: 'Scaffolding, heavy plant' },
    { id: 14, name: 'HSS Hire Bath', category: 'hire', phone: '01225 463636', address: 'Lower Bristol Road, Bath', favorite: false, notes: 'Tools, access equipment' },
    { id: 15, name: 'Brandon Hire Station', category: 'hire', phone: '01225 789000', address: 'Bath', favorite: false, notes: 'Specialist lifting and access' },

    // Specialists
    { id: 16, name: 'Bath Sash Windows', category: 'specialist', phone: '01225 789123', address: 'Larkhall, Bath', favorite: true, notes: 'Sash window repairs and draught proofing' },
    { id: 17, name: 'Georgian Joinery', category: 'specialist', phone: '01225 444789', address: 'Bath', favorite: true, notes: 'Period doors, shutters, panelling' },
    { id: 18, name: 'Bath Architectural Salvage', category: 'specialist', phone: '01225 311174', address: 'Northgate Street, Bath', favorite: false, notes: 'Period fixtures, fireplaces, doors' },
    { id: 19, name: 'Traditional Ironmongery', category: 'specialist', phone: '01225 318181', address: 'Bath', favorite: false, notes: 'Georgian locks, handles, hinges' },
    { id: 20, name: 'Heritage Decorative Finishes', category: 'specialist', phone: '01225 505050', address: 'Bath', favorite: false, notes: 'Specialist plastering and decorative work' },
    { id: 21, name: 'Bath Plastering', category: 'specialist', phone: '01225 767676', address: 'Bath', favorite: false, notes: 'Lime plastering specialists' },
    { id: 22, name: 'Farrow & Ball Bath', category: 'specialist', phone: '01225 469300', address: 'Walcot Street, Bath', favorite: false, notes: 'Traditional paints and wallpapers' },
    { id: 23, name: 'Bathroom City Bath', category: 'specialist', phone: '01225 421421', address: 'Lower Bristol Road, Bath', favorite: false, notes: 'Period-style bathrooms and fittings' },
  ]);

  const [newSupplier, setNewSupplier] = useState({ name: '', category: 'merchants', phone: '', address: '', notes: '' });
  
  const [timeEntries, setTimeEntries] = useLocalStorage('richs-toolkit-time-entries', [
    { id: 1, project: 'The Circus - No. 14', date: '2024-03-15', hours: 8, minutes: 30, notes: 'Plastering drawing room', break: 30 },
  ]);

  const [receipts, setReceipts] = useLocalStorage('richs-toolkit-receipts', [
    { id: 1, date: '2024-03-15', supplier: 'Travis Perkins', amount: 147.50, category: 'Materials', project: 'The Circus - No. 14', description: 'Plaster, PVA', photo: true },
  ]);

  const [mileageEntries, setMileageEntries] = useLocalStorage('richs-toolkit-mileage', [
    { id: 1, date: '2024-03-15', from: 'Home', to: 'The Circus', miles: 12, project: 'The Circus - No. 14', return: true },
  ]);

  const [newTimeEntry, setNewTimeEntry] = useState({ project: '', hours: '', minutes: '', notes: '', break: '30' });
  const [newReceipt, setNewReceipt] = useState({ supplier: '', amount: '', category: 'Materials', project: '', description: '' });
  const [newMileage, setNewMileage] = useState({ from: 'Home', to: '', miles: '', project: '', return: true });
  
  const [projects, setProjects] = useLocalStorage('richs-toolkit-projects', [
    { id: 1, name: 'The Circus - No. 14', grade: 'Grade II*', address: '14 The Circus, Bath BA1 2ET', startDate: '2024-01-15', photos: [], snagging: [
      { id: 'room1', name: 'Drawing Room', items: [
        { id: 1, description: 'Touch up cornice paint', priority: 'low', complete: true, notes: '', date: '2024-03-01', photo: false },
        { id: 2, description: 'Fill crack above doorway', priority: 'medium', complete: false, notes: '', date: '2024-03-01', photo: false },
      ]},
    ]},
  ]);

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
    setNewSupplier({ name: '', category: 'merchants', phone: '', address: '', notes: '' });
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
    return (
      <div className="p-4 pb-24 relative">
        {/* Weather Background Animations */}
        {weatherData && <WeatherBackground condition={weatherData.current.condition} />}

        <div className="mb-6 relative z-10"><h1 className="text-2xl font-bold text-gray-900">Rich's Toolkit</h1><p className="text-gray-500">Bath Heritage Renovations</p></div>

        {/* Weather Card - Now Tappable */}
        <div className="relative z-10">
        {weatherLoading || !weatherData ? (
          <div className="w-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl p-4 mb-4 text-white">
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
          <button onClick={() => setCurrentScreen('weather')} className="w-full text-left bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl p-4 mb-4 text-white">
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
            { id: 'snagging', title: 'Snagging', icon: ClipboardList, color: 'bg-amber-500', desc: 'Punch lists' },
            { id: 'time', title: 'Time & Expenses', icon: Clock, color: 'bg-rose-500', desc: 'Hours & receipts' },
            { id: 'suppliers', title: 'Suppliers', icon: Phone, color: 'bg-teal-500', desc: 'Quick dial' },
            { id: 'weather', title: 'Weather', icon: Cloud, color: 'bg-sky-500', desc: '7-day forecast' },
            { id: 'conversions', title: 'Conversions', icon: ArrowLeftRight, color: 'bg-indigo-500', desc: 'Imperial ↔ Metric' },
          ].map((feature) => {
            const IconComponent = feature.icon;
            return <button key={feature.id} onClick={() => setCurrentScreen(feature.id)} className="bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-100 active:scale-95 transition-transform"><div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}><IconComponent size={24} className="text-white" /></div><h3 className="font-semibold text-gray-900">{feature.title}</h3><p className="text-sm text-gray-500">{feature.desc}</p></button>;
          })}
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Projects</h2>
          <div className="space-y-2">
            {projects.slice(0, 2).map((project) => (
              <div key={project.id} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center"><Building2 size={20} className="text-stone-600" /></div><div><p className="font-medium">{project.name}</p><p className="text-sm text-gray-500">{project.grade}</p></div></div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
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
    if (currentScreen === 'suppliers') return renderSuppliers();
    if (currentScreen === 'weather') return renderWeather();
    if (currentScreen === 'snagging') {
      if (selectedRoom) return renderRoomDetail();
      if (selectedSnaggingProject) return renderProjectSnagging();
      return renderSnagging();
    }
    return renderHome();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-sm mx-auto bg-gray-50 min-h-screen relative">
        {renderCurrentScreen()}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 max-w-sm mx-auto">
          <div className="flex justify-around">
            {[
              { icon: Home, label: 'Home', screen: 'home' },
              { icon: Calculator, label: 'Calculate', screen: 'calculators' },
              { icon: Cloud, label: 'Weather', screen: 'weather' },
              { icon: Phone, label: 'Suppliers', screen: 'suppliers' },
            ].map((item) => {
              const NavIcon = item.icon;
              const isActive = currentScreen === item.screen || (item.screen === 'calculators' && currentScreen === 'calculator');
              return <button key={item.label} onClick={() => { setCurrentScreen(item.screen); setSelectedSnaggingProject(null); setSelectedRoom(null); setHeritageSection(null); }} className={`flex flex-col items-center gap-1 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}><NavIcon size={24} /><span className="text-xs">{item.label}</span></button>;
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
        {showAddSupplier && renderAddSupplierModal()}
        {showMaterialList && renderMaterialListModal()}
      </div>
    </div>
  );
}
