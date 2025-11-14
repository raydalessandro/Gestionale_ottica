import React, { useState, useEffect } from 'react';

// 🎨 CONFIGURAZIONE
const CONFIG = {
  brand: {
    name: "EAR Ottica",
    colors: {
      primary: "#2563EB",
      secondary: "#10B981",
      warning: "#F59E0B",
      danger: "#DC2626",
      info: "#06B6D4"
    }
  },
  storageKeys: {
    clients: "optical_clients",
    prescriptions: "optical_prescriptions"
  },
  templates: {
    occhiali: {
      "Emmetrope": { sfero: 0, cilindro: 0, asse: 0 },
      "Miopia Lieve": { sfero: -2.00, cilindro: 0, asse: 0 },
      "Miopia Moderata": { sfero: -4.00, cilindro: -0.50, asse: 180 },
      "Ipermetropia": { sfero: +2.00, cilindro: 0, asse: 0 },
      "Astigmatismo": { sfero: -1.00, cilindro: -1.50, asse: 90 }
    }
  }
};

// 🎨 STILI
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { font-family: 'Inter', sans-serif; }
  
  .card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 20px;
  }
  
  .input-group {
    margin-bottom: 15px;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 10px 12px;
    border: 2px solid #E5E7EB;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
    transition: all 0.2s;
  }
  
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: ${CONFIG.brand.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  input[type="number"] {
    text-align: center;
    font-weight: 600;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    font-size: 0.95rem;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-primary {
    background: ${CONFIG.brand.colors.primary};
    color: white;
  }
  
  .btn-secondary {
    background: #6B7280;
    color: white;
  }
  
  .btn-success {
    background: ${CONFIG.brand.colors.secondary};
    color: white;
  }
  
  .btn-outline {
    background: white;
    border: 2px solid ${CONFIG.brand.colors.primary};
    color: ${CONFIG.brand.colors.primary};
  }
  
  .tab-btn {
    padding: 12px 24px;
    background: white;
    border: none;
    border-bottom: 3px solid transparent;
    color: #6B7280;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .tab-btn:hover {
    color: ${CONFIG.brand.colors.primary};
    transform: none;
    box-shadow: none;
  }
  
  .tab-btn.active {
    color: ${CONFIG.brand.colors.primary};
    border-bottom-color: ${CONFIG.brand.colors.primary};
  }
  
  .eye-section {
    background: #F9FAFB;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
  }
  
  .prescription-card {
    background: white;
    border: 2px solid #E5E7EB;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .prescription-card:hover {
    border-color: ${CONFIG.brand.colors.primary};
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .prescription-card.selected {
    border-color: ${CONFIG.brand.colors.primary};
    background: #EFF6FF;
  }
`;

const VisitePrescrizioniModule = ({ onBack }) => {
  // 📊 STATE
  const [clients, setClients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [view, setView] = useState('list'); // list, new, detail
  const [activeTab, setActiveTab] = useState('occhiali'); // occhiali, lac
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]); // Data filtro

  // 📝 FORM STATE
  const [formData, setFormData] = useState({
    clientId: null,
    type: 'visita_ottico', // visita_ottico, rx_oculista, copia_vecchie
    date: new Date().toISOString().split('T')[0],
    operator: 'Ray',
    occhiali: {
      lontano: {
        OD: { sfero: 0, cilindro: 0, asse: 0, prisma_base: 0, prisma_valore: 0 },
        OS: { sfero: 0, cilindro: 0, asse: 0, prisma_base: 0, prisma_valore: 0 }
      },
      addizione: 0, // Per progressive/bifocali
      tipo_lente: 'monofocale', // monofocale, progressiva, bifocale, office
      pd_lontano_totale: 63,
      pd_lontano_OD: 31.5,
      pd_lontano_OS: 31.5,
      pd_vicino_totale: 61,
      pd_vicino_OD: 30.5,
      pd_vicino_OS: 30.5
    },
    lac: {
      OD: { sfero: 0, cilindro: 0, asse: 0, raggio: 8.6, diametro: 14.2, addizione: 0 },
      OS: { sfero: 0, cilindro: 0, asse: 0, raggio: 8.6, diametro: 14.2, addizione: 0 },
      tipo: 'morbide' // morbide, rigide, multifocali
    },
    notes: '',
    esame_completo: false
  });

  // 🔄 LOAD DATA
  useEffect(() => {
    const loadedClients = JSON.parse(localStorage.getItem(CONFIG.storageKeys.clients) || '[]');
    const loadedPrescriptions = JSON.parse(localStorage.getItem(CONFIG.storageKeys.prescriptions) || '[]');
    
    // Se non ci sono clienti, aggiungiamo alcuni di esempio
    if (loadedClients.length === 0) {
      const exampleClients = [
        { id: 1, name: 'Mario Rossi', email: 'mario.rossi@email.com', phone: '+39 333 1234567' },
        { id: 2, name: 'Laura Bianchi', email: 'laura.b@email.com', phone: '+39 348 7654321' },
        { id: 3, name: 'Giovanni Verdi', email: 'g.verdi@email.com', phone: '+39 320 9876543' }
      ];
      localStorage.setItem(CONFIG.storageKeys.clients, JSON.stringify(exampleClients));
      setClients(exampleClients);
    } else {
      setClients(loadedClients);
    }
    
    setPrescriptions(loadedPrescriptions);
  }, []);

  // 💾 SAVE PRESCRIPTION
  const savePrescription = () => {
    if (!formData.clientId) {
      alert('Seleziona un cliente');
      return;
    }

    const prescription = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toISOString()
    };

    const newPrescriptions = [prescription, ...prescriptions];
    setPrescriptions(newPrescriptions);
    localStorage.setItem(CONFIG.storageKeys.prescriptions, JSON.stringify(newPrescriptions));

    alert('✓ Prescrizione salvata con successo!');
    resetForm();
    setView('list');
  };

  // 🔄 RESET FORM
  const resetForm = () => {
    setFormData({
      clientId: null,
      type: 'visita_ottico',
      date: new Date().toISOString().split('T')[0],
      operator: 'Ray',
      occhiali: {
        lontano: {
          OD: { sfero: 0, cilindro: 0, asse: 0, addizione: 0, prisma_base: 0, prisma_valore: 0 },
          OS: { sfero: 0, cilindro: 0, asse: 0, addizione: 0, prisma_base: 0, prisma_valore: 0 }
        },
        vicino: {
          OD: { sfero: 0, cilindro: 0, asse: 0 },
          OS: { sfero: 0, cilindro: 0, asse: 0 }
        },
        pd_lontano_totale: 63,
        pd_lontano_OD: 31.5,
        pd_lontano_OS: 31.5,
        pd_vicino_totale: 61,
        pd_vicino_OD: 30.5,
        pd_vicino_OS: 30.5,
        altezza_montaggio_OD: 18,
        altezza_montaggio_OS: 18,
        tipo_lente: 'monofocale'
      },
      lac: {
        OD: { sfero: 0, cilindro: 0, asse: 0, raggio: 8.6, diametro: 14.2, addizione: 0 },
        OS: { sfero: 0, cilindro: 0, asse: 0, raggio: 8.6, diametro: 14.2, addizione: 0 },
        tipo: 'morbide'
      },
      notes: '',
      esame_completo: false
    });
    setSelectedClient(null);
    setActiveTab('occhiali');
  };

  // 🔍 FILTER PRESCRIPTIONS BY DATE
  const filteredPrescriptions = prescriptions.filter(p => {
    const prescDate = new Date(p.timestamp).toISOString().split('T')[0];
    return prescDate === filterDate;
  });

  // 🔍 FILTER CLIENTS
  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery)
  );

  // 📋 GET CLIENT PRESCRIPTIONS
  const getClientPrescriptions = (clientId) => {
    return prescriptions.filter(p => p.clientId === clientId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // 🎯 APPLY TEMPLATE
  const applyTemplate = (eye, templateName) => {
    const template = CONFIG.templates.occhiali[templateName];
    if (template) {
      setFormData(prev => ({
        ...prev,
        occhiali: {
          ...prev.occhiali,
          lontano: {
            ...prev.occhiali.lontano,
            [eye]: { ...prev.occhiali.lontano[eye], ...template }
          }
        }
      }));
    }
  };

  // 🎨 RENDER AXIS VISUALIZATION
  const renderAxisVisualization = (asse) => {
    const angle = (180 - asse) * (Math.PI / 180);
    const lineLength = 40;
    const centerX = 50;
    const centerY = 50;
    const endX = centerX + Math.cos(angle) * lineLength;
    const endY = centerY + Math.sin(angle) * lineLength;

    return (
      <svg width="100" height="100" style={{ display: 'block', margin: '0 auto' }}>
        <circle cx="50" cy="50" r="45" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
        <line x1={centerX} y1={centerY} x2={endX} y2={endY} stroke="#DC2626" strokeWidth="3" />
        <circle cx="50" cy="50" r="3" fill="#DC2626" />
        <text x="50" y="15" textAnchor="middle" fill="#2563EB" fontSize="12" fontWeight="bold">
          {asse}°
        </text>
      </svg>
    );
  };

  return (
    <div style={{ 
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh',
      background: '#F3F4F6',
      padding: '20px'
    }}>
      <style>{styles}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* 🎨 HEADER */}
        <div style={{ 
          background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h1 style={{ margin: '0 0 5px 0', fontSize: '2rem', fontWeight: 700 }}>
                👓 Visite & Prescrizioni
              </h1>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Gestione completa prescrizioni optometriche
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={onBack}
                className="btn-secondary"
                style={{ padding: '12px 24px', fontSize: '1rem' }}
              >
                🏠 Home
              </button>
              {view === 'list' && (
                <button
                  onClick={() => {
                    resetForm();
                    setView('new');
                  }}
                  className="btn-success"
                  style={{ padding: '12px 24px', fontSize: '1rem' }}
                >
                  ➕ Nuova Prescrizione
                </button>
              )}
              {view !== 'list' && (
                <button
                  onClick={() => {
                    setView('list');
                    resetForm();
                  }}
                  className="btn-secondary"
                  style={{ padding: '12px 24px', fontSize: '1rem' }}
                >
                  ← Torna alla Lista
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 📋 LIST VIEW */}
        {view === 'list' && (
          <>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ margin: 0, color: '#1F2937' }}>
                  Prescrizioni del Giorno
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#6B7280' }}>
                    📅 Filtra per data:
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    style={{ width: 'auto' }}
                  />
                  <button
                    onClick={() => setFilterDate(new Date().toISOString().split('T')[0])}
                    className="btn-outline"
                    style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}
                  >
                    📆 Oggi
                  </button>
                </div>
              </div>

              <div style={{
                padding: '12px 15px',
                background: '#EFF6FF',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '0.95rem', color: '#1E40AF', fontWeight: 600 }}>
                  {filteredPrescriptions.length === 0 
                    ? '📋 Nessuna prescrizione trovata per questa data'
                    : `📋 ${filteredPrescriptions.length} prescrizione${filteredPrescriptions.length !== 1 ? 'i' : ''} trovata${filteredPrescriptions.length !== 1 ? 'e' : ''}`
                  }
                </div>
                <div style={{ fontSize: '0.85rem', color: '#3B82F6' }}>
                  {new Date(filterDate).toLocaleDateString('it-IT', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              {filteredPrescriptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📅</div>
                  <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                    Nessuna prescrizione per {new Date(filterDate).toLocaleDateString('it-IT')}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#D1D5DB', marginBottom: '20px' }}>
                    Cambia data o crea una nuova prescrizione
                  </p>
                  <button
                    onClick={() => setView('new')}
                    className="btn-primary"
                  >
                    ➕ Crea Nuova Prescrizione
                  </button>
                </div>
              ) : (
                <div>
                  {filteredPrescriptions.map(presc => {
                    const client = clients.find(c => c.id === presc.clientId);
                    return (
                      <div
                        key={presc.id}
                        className="prescription-card"
                        onClick={() => {
                          setSelectedPrescription(presc);
                          setView('detail');
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                          <div>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#1F2937' }}>
                              {client?.name || 'Cliente non trovato'}
                            </h4>
                            <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                              {new Date(presc.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - {presc.operator}
                            </div>
                          </div>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            background: presc.type === 'visita_ottico' ? '#DBEAFE' : 
                                       presc.type === 'rx_oculista' ? '#FEF3C7' : '#E0E7FF',
                            color: presc.type === 'visita_ottico' ? '#1E40AF' : 
                                   presc.type === 'rx_oculista' ? '#92400E' : '#4338CA'
                          }}>
                            {presc.type === 'visita_ottico' ? '🔍 Visita Ottico' :
                             presc.type === 'rx_oculista' ? '📋 RX Oculista' : '📄 Copia Vecchie'}
                          </span>
                        </div>

                        <div style={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '15px',
                          padding: '15px',
                          background: '#F9FAFB',
                          borderRadius: '8px'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '5px' }}>
                              OD (Occhio Destro)
                            </div>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600 }}>
                              {presc.occhiali.lontano.OD.sfero > 0 ? '+' : ''}{presc.occhiali.lontano.OD.sfero.toFixed(2)} / 
                              {presc.occhiali.lontano.OD.cilindro > 0 ? '+' : ''}{presc.occhiali.lontano.OD.cilindro.toFixed(2)} × {presc.occhiali.lontano.OD.asse}°
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '5px' }}>
                              OS (Occhio Sinistro)
                            </div>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600 }}>
                              {presc.occhiali.lontano.OS.sfero > 0 ? '+' : ''}{presc.occhiali.lontano.OS.sfero.toFixed(2)} / 
                              {presc.occhiali.lontano.OS.cilindro > 0 ? '+' : ''}{presc.occhiali.lontano.OS.cilindro.toFixed(2)} × {presc.occhiali.lontano.OS.asse}°
                            </div>
                          </div>
                          {presc.occhiali.addizione > 0 && (
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '5px' }}>
                                Addizione
                              </div>
                              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600 }}>
                                +{presc.occhiali.addizione.toFixed(2)}
                              </div>
                            </div>
                          )}
                        </div>

                        {presc.notes && (
                          <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#6B7280', fontStyle: 'italic' }}>
                            📝 {presc.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ➕ NEW PRESCRIPTION VIEW */}
        {view === 'new' && (
          <>
            {/* CLIENT SELECTION */}
            {!selectedClient ? (
              <div className="card">
                <h3 style={{ marginBottom: '15px', color: '#1F2937' }}>
                  1. Seleziona Cliente
                </h3>
                
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="🔍 Cerca cliente per nome, email o telefono..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {filteredClients.map(client => (
                    <div
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        setFormData(prev => ({ ...prev, clientId: client.id }));
                      }}
                      style={{
                        padding: '15px',
                        background: '#F9FAFB',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: '2px solid transparent',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = CONFIG.brand.colors.primary}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                    >
                      <div style={{ fontWeight: 600, marginBottom: '5px' }}>{client.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                        {client.email} • {client.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* SELECTED CLIENT */}
                <div className="card" style={{ background: '#EFF6FF', borderLeft: '4px solid ' + CONFIG.brand.colors.primary }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#1E40AF', marginBottom: '5px' }}>
                        CLIENTE SELEZIONATO
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1F2937' }}>
                        {selectedClient.name}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                        {selectedClient.email} • {selectedClient.phone}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClient(null);
                        setFormData(prev => ({ ...prev, clientId: null }));
                      }}
                      className="btn-outline"
                    >
                      Cambia Cliente
                    </button>
                  </div>
                </div>

                {/* TYPE SELECTION */}
                <div className="card">
                  <h3 style={{ marginBottom: '15px', color: '#1F2937' }}>
                    2. Tipo Prescrizione
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {[
                      { value: 'visita_ottico', label: '🔍 Visita Ottico', desc: 'Esame completo in negozio' },
                      { value: 'rx_oculista', label: '📋 RX Oculista', desc: 'Prescrizione medica' },
                      { value: 'copia_vecchie', label: '📄 Copia Vecchie', desc: 'Da lenti esistenti' }
                    ].map(type => (
                      <div
                        key={type.value}
                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                        style={{
                          padding: '15px',
                          background: formData.type === type.value ? '#EFF6FF' : '#F9FAFB',
                          border: '2px solid ' + (formData.type === type.value ? CONFIG.brand.colors.primary : '#E5E7EB'),
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: '5px' }}>{type.label}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{type.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                    <div className="input-group">
                      <label>Data</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="input-group">
                      <label>Operatore</label>
                      <input
                        type="text"
                        value={formData.operator}
                        onChange={(e) => setFormData(prev => ({ ...prev, operator: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* TABS */}
                <div style={{ 
                  background: 'white',
                  borderRadius: '12px 12px 0 0',
                  padding: '0 20px',
                  display: 'flex',
                  gap: '10px',
                  borderBottom: '2px solid #E5E7EB'
                }}>
                  <button
                    className={`tab-btn ${activeTab === 'occhiali' ? 'active' : ''}`}
                    onClick={() => setActiveTab('occhiali')}
                  >
                    👓 Occhiali
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'lac' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lac')}
                  >
                    👁️ LAC
                  </button>
                </div>

                {/* OCCHIALI TAB */}
                {activeTab === 'occhiali' && (
                  <div className="card" style={{ borderRadius: '0 0 12px 12px', marginTop: 0 }}>
                    <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
                      3. Prescrizione Occhiali
                    </h3>

                    {/* TIPO LENTE */}
                    <div className="input-group">
                      <label>Tipo Lente</label>
                      <select
                        value={formData.occhiali.tipo_lente}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          occhiali: { ...prev.occhiali, tipo_lente: e.target.value }
                        }))}
                      >
                        <option value="monofocale">Monofocale</option>
                        <option value="progressiva">Progressiva</option>
                        <option value="bifocale">Bifocale</option>
                        <option value="office">Office/Intermedia</option>
                      </select>
                    </div>

                    {/* ADDIZIONE (per progressive/bifocali) */}
                    {(formData.occhiali.tipo_lente === 'progressiva' || 
                      formData.occhiali.tipo_lente === 'bifocale' || 
                      formData.occhiali.tipo_lente === 'office') && (
                      <div className="input-group" style={{ 
                        background: '#FEF3C7', 
                        padding: '15px', 
                        borderRadius: '8px',
                        border: '2px solid ' + CONFIG.brand.colors.warning 
                      }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>⚠️ Addizione (Add)</span>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: '#92400E',
                            fontWeight: 'normal'
                          }}>
                            Necessaria per lenti progressive/bifocali
                          </span>
                        </label>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="4"
                          value={formData.occhiali.addizione}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            occhiali: { ...prev.occhiali, addizione: parseFloat(e.target.value) || 0 }
                          }))}
                          style={{ 
                            background: 'white',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            textAlign: 'center'
                          }}
                        />
                      </div>
                    )}

                    {/* LONTANO */}
                    <h4 style={{ margin: '20px 0 15px 0', color: '#374151' }}>
                      Per Lontano
                    </h4>

                    {['OD', 'OS'].map(eye => (
                      <div key={eye} className="eye-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                          <h5 style={{ margin: 0, color: '#1F2937' }}>
                            {eye === 'OD' ? '👁️ OD (Occhio Destro)' : '👁️ OS (Occhio Sinistro)'}
                          </h5>
                          <select
                            onChange={(e) => applyTemplate(eye, e.target.value)}
                            style={{ width: 'auto', padding: '5px 10px', fontSize: '0.85rem' }}
                          >
                            <option value="">⚡ Template rapido...</option>
                            {Object.keys(CONFIG.templates.occhiali).map(name => (
                              <option key={name} value={name}>{name}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
                          <div className="input-group">
                            <label>Sfero</label>
                            <input
                              type="number"
                              step="0.25"
                              value={formData.occhiali.lontano[eye].sfero}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                occhiali: {
                                  ...prev.occhiali,
                                  lontano: {
                                    ...prev.occhiali.lontano,
                                    [eye]: { ...prev.occhiali.lontano[eye], sfero: parseFloat(e.target.value) || 0 }
                                  }
                                }
                              }))}
                            />
                          </div>

                          <div className="input-group">
                            <label>Cilindro</label>
                            <input
                              type="number"
                              step="0.25"
                              value={formData.occhiali.lontano[eye].cilindro}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                occhiali: {
                                  ...prev.occhiali,
                                  lontano: {
                                    ...prev.occhiali.lontano,
                                    [eye]: { ...prev.occhiali.lontano[eye], cilindro: parseFloat(e.target.value) || 0 }
                                  }
                                }
                              }))}
                            />
                          </div>

                          <div className="input-group">
                            <label>Asse (°)</label>
                            <input
                              type="number"
                              min="0"
                              max="180"
                              value={formData.occhiali.lontano[eye].asse}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                occhiali: {
                                  ...prev.occhiali,
                                  lontano: {
                                    ...prev.occhiali.lontano,
                                    [eye]: { ...prev.occhiali.lontano[eye], asse: parseInt(e.target.value) || 0 }
                                  }
                                }
                              }))}
                            />
                          </div>
                        </div>

                        {/* AXIS VISUALIZATION */}
                        {formData.occhiali.lontano[eye].cilindro !== 0 && (
                          <div style={{ marginTop: '15px' }}>
                            {renderAxisVisualization(formData.occhiali.lontano[eye].asse)}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* DISTANZE PUPILLARI */}
                    <h4 style={{ margin: '20px 0 15px 0', color: '#374151' }}>
                      Distanze Pupillari (mm)
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                      <div className="input-group">
                        <label>PD Lontano (Totale)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={formData.occhiali.pd_lontano_totale}
                          onChange={(e) => {
                            const total = parseFloat(e.target.value) || 0;
                            setFormData(prev => ({
                              ...prev,
                              occhiali: {
                                ...prev.occhiali,
                                pd_lontano_totale: total,
                                pd_lontano_OD: total / 2,
                                pd_lontano_OS: total / 2
                              }
                            }));
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <label>PD OD</label>
                        <input
                          type="number"
                          step="0.5"
                          value={formData.occhiali.pd_lontano_OD}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            occhiali: { ...prev.occhiali, pd_lontano_OD: parseFloat(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                      <div className="input-group">
                        <label>PD OS</label>
                        <input
                          type="number"
                          step="0.5"
                          value={formData.occhiali.pd_lontano_OS}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            occhiali: { ...prev.occhiali, pd_lontano_OS: parseFloat(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' }}>
                      <div className="input-group">
                        <label>Altezza OD (mm)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={formData.occhiali.altezza_montaggio_OD}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            occhiali: { ...prev.occhiali, altezza_montaggio_OD: parseFloat(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                      <div className="input-group">
                        <label>Altezza OS (mm)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={formData.occhiali.altezza_montaggio_OS}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            occhiali: { ...prev.occhiali, altezza_montaggio_OS: parseFloat(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                    </div>

                    {/* NOTE */}
                    <div className="input-group" style={{ marginTop: '20px' }}>
                      <label>Note e Osservazioni</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Preferenze, osservazioni cliniche, richieste particolari..."
                        rows={4}
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                      onClick={savePrescription}
                      className="btn-success"
                      style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '20px' }}
                    >
                      ✓ Salva Prescrizione
                    </button>
                  </div>
                )}

                {/* LAC TAB */}
                {activeTab === 'lac' && (
                  <div className="card" style={{ borderRadius: '0 0 12px 12px', marginTop: 0 }}>
                    <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
                      3. Prescrizione LAC
                    </h3>

                    {/* TIPO LAC */}
                    <div className="input-group">
                      <label>Tipo LAC</label>
                      <select
                        value={formData.lac.tipo}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          lac: { ...prev.lac, tipo: e.target.value }
                        }))}
                      >
                        <option value="morbide">Morbide</option>
                        <option value="rigide">Rigide (RGP)</option>
                        <option value="multifocali">Multifocali</option>
                        <option value="toriche">Toriche</option>
                      </select>
                    </div>

                    {['OD', 'OS'].map(eye => (
                      <div key={eye} className="eye-section">
                        <h5 style={{ margin: '0 0 15px 0', color: '#1F2937' }}>
                          {eye === 'OD' ? '👁️ OD (Occhio Destro)' : '👁️ OS (Occhio Sinistro)'}
                        </h5>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
                          <div className="input-group">
                            <label>Sfero</label>
                            <input
                              type="number"
                              step="0.25"
                              value={formData.lac[eye].sfero}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                lac: {
                                  ...prev.lac,
                                  [eye]: { ...prev.lac[eye], sfero: parseFloat(e.target.value) || 0 }
                                }
                              }))}
                            />
                          </div>

                          <div className="input-group">
                            <label>Cilindro</label>
                            <input
                              type="number"
                              step="0.25"
                              value={formData.lac[eye].cilindro}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                lac: {
                                  ...prev.lac,
                                  [eye]: { ...prev.lac[eye], cilindro: parseFloat(e.target.value) || 0 }
                                }
                              }))}
                            />
                          </div>

                          <div className="input-group">
                            <label>Asse (°)</label>
                            <input
                              type="number"
                              min="0"
                              max="180"
                              value={formData.lac[eye].asse}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                lac: {
                                  ...prev.lac,
                                  [eye]: { ...prev.lac[eye], asse: parseInt(e.target.value) || 0 }
                                }
                              }))}
                            />
                          </div>

                          <div className="input-group">
                            <label>Raggio (mm)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.lac[eye].raggio}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                lac: {
                                  ...prev.lac,
                                  [eye]: { ...prev.lac[eye], raggio: parseFloat(e.target.value) || 0 }
                                }
                              }))}
                            />
                          </div>

                          <div className="input-group">
                            <label>Diametro (mm)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.lac[eye].diametro}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                lac: {
                                  ...prev.lac,
                                  [eye]: { ...prev.lac[eye], diametro: parseFloat(e.target.value) || 0 }
                                }
                              }))}
                            />
                          </div>

                          <div className="input-group">
                            <label>Add</label>
                            <input
                              type="number"
                              step="0.25"
                              value={formData.lac[eye].addizione}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                lac: {
                                  ...prev.lac,
                                  [eye]: { ...prev.lac[eye], addizione: parseFloat(e.target.value) || 0 }
                                }
                              }))}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* NOTE */}
                    <div className="input-group" style={{ marginTop: '20px' }}>
                      <label>Note e Osservazioni</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Tipo di LAC, marca, modalità di sostituzione, osservazioni..."
                        rows={4}
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                      onClick={savePrescription}
                      className="btn-success"
                      style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '20px' }}
                    >
                      ✓ Salva Prescrizione LAC
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* 🔍 DETAIL VIEW */}
        {view === 'detail' && selectedPrescription && (() => {
          const client = clients.find(c => c.id === selectedPrescription.clientId);
          
          return (
            <div className="card">
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 5px 0', color: '#1F2937' }}>
                  {client?.name || 'Cliente non trovato'}
                </h2>
                <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                  {new Date(selectedPrescription.timestamp).toLocaleString('it-IT')} - {selectedPrescription.operator}
                </div>
              </div>

              <div style={{ 
                padding: '15px',
                background: '#F9FAFB',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ fontWeight: 600, marginBottom: '10px' }}>Tipo: {
                  selectedPrescription.type === 'visita_ottico' ? '🔍 Visita Ottico' :
                  selectedPrescription.type === 'rx_oculista' ? '📋 RX Oculista' : '📄 Copia Vecchie Lenti'
                }</div>
                <div style={{ fontWeight: 600 }}>Lente: {selectedPrescription.occhiali.tipo_lente}</div>
              </div>

              <h3 style={{ margin: '20px 0 15px 0', color: '#374151' }}>Prescrizione Lontano</h3>
              
              {['OD', 'OS'].map(eye => (
                <div key={eye} className="eye-section">
                  <h5 style={{ margin: '0 0 15px 0' }}>
                    {eye === 'OD' ? '👁️ OD (Occhio Destro)' : '👁️ OS (Occhio Sinistro)'}
                  </h5>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Sfero</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace' }}>
                        {selectedPrescription.occhiali.lontano[eye].sfero > 0 ? '+' : ''}
                        {selectedPrescription.occhiali.lontano[eye].sfero.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Cilindro</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace' }}>
                        {selectedPrescription.occhiali.lontano[eye].cilindro > 0 ? '+' : ''}
                        {selectedPrescription.occhiali.lontano[eye].cilindro.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Asse</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace' }}>
                        {selectedPrescription.occhiali.lontano[eye].asse}°
                      </div>
                    </div>
                    {selectedPrescription.occhiali.lontano[eye].addizione > 0 && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Add</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace' }}>
                          +{selectedPrescription.occhiali.lontano[eye].addizione.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedPrescription.occhiali.lontano[eye].cilindro !== 0 && (
                    <div style={{ marginTop: '15px' }}>
                      {renderAxisVisualization(selectedPrescription.occhiali.lontano[eye].asse)}
                    </div>
                  )}
                </div>
              ))}

              {selectedPrescription.occhiali.addizione > 0 && (
                <div style={{
                  padding: '15px',
                  background: '#FEF3C7',
                  borderRadius: '8px',
                  marginTop: '15px',
                  border: '2px solid ' + CONFIG.brand.colors.warning
                }}>
                  <div style={{ fontSize: '0.85rem', color: '#92400E', marginBottom: '5px', fontWeight: 600 }}>
                    ADDIZIONE (Progressive/Bifocali)
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace', color: '#1F2937' }}>
                    +{selectedPrescription.occhiali.addizione.toFixed(2)}
                  </div>
                </div>
              )}

              <h3 style={{ margin: '20px 0 15px 0', color: '#374151' }}>Distanze e Parametri</h3>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px',
                padding: '15px',
                background: '#F9FAFB',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>PD Totale</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    {selectedPrescription.occhiali.pd_lontano_totale} mm
                  </div>
                </div>
              </div>

              {selectedPrescription.notes && (
                <>
                  <h3 style={{ margin: '20px 0 15px 0', color: '#374151' }}>Note</h3>
                  <div style={{ 
                    padding: '15px',
                    background: '#FFFBEB',
                    borderLeft: '4px solid ' + CONFIG.brand.colors.warning,
                    borderRadius: '8px'
                  }}>
                    {selectedPrescription.notes}
                  </div>
                </>
              )}

              <button
                onClick={() => {
                  setView('list');
                  setSelectedPrescription(null);
                }}
                className="btn-primary"
                style={{ width: '100%', marginTop: '20px' }}
              >
                ← Torna alla Lista
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default VisitePrescrizioniModule;
