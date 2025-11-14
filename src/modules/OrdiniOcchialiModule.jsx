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
    prescriptions: "optical_prescriptions",
    orders: "optical_orders"
  },
  trattamenti: [
    { id: 'antiriflesso', label: 'Antiriflesso', prezzo: 40 },
    { id: 'indurente', label: 'Indurente', prezzo: 20 },
    { id: 'idrorepellente', label: 'Idrorepellente', prezzo: 25 },
    { id: 'antistatico', label: 'Antistatico', prezzo: 15 },
    { id: 'anti_uv', label: 'Anti-UV', prezzo: 10 },
    { id: 'blue_block', label: 'Filtro Luce Blu', prezzo: 30 }
  ],
  garanzie: [
    { id: 'soddisfatti', label: 'Soddisfatti o Rimborsati (30gg)', prezzo: 30 },
    { id: 'rottura', label: 'Rottura Accidentale (1 anno)', prezzo: 25 },
    { id: 'smarrimento', label: 'Furto e Smarrimento', prezzo: 40 }
  ]
};

// 🎨 STILI
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { font-family: 'Inter', sans-serif; }
  
  .card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 20px;
  }
  
  .stepper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    position: relative;
  }
  
  .stepper::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: #E5E7EB;
    z-index: 0;
  }
  
  .step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    cursor: pointer;
  }
  
  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #E5E7EB;
    color: #9CA3AF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    margin-bottom: 8px;
    transition: all 0.3s;
  }
  
  .step.active .step-number {
    background: ${CONFIG.brand.colors.primary};
    color: white;
    transform: scale(1.1);
  }
  
  .step.completed .step-number {
    background: ${CONFIG.brand.colors.secondary};
    color: white;
  }
  
  .step-label {
    font-size: 0.85rem;
    color: #9CA3AF;
    text-align: center;
    font-weight: 500;
  }
  
  .step.active .step-label {
    color: ${CONFIG.brand.colors.primary};
    font-weight: 600;
  }
  
  .step.completed .step-label {
    color: ${CONFIG.brand.colors.secondary};
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
  
  .checkbox-card {
    border: 2px solid #E5E7EB;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .checkbox-card:hover {
    border-color: ${CONFIG.brand.colors.primary};
    background: #EFF6FF;
  }
  
  .checkbox-card.selected {
    border-color: ${CONFIG.brand.colors.primary};
    background: #EFF6FF;
  }
  
  .price-tag {
    background: ${CONFIG.brand.colors.secondary};
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.9rem;
  }
`;

const OrdiniModule = ({ onBack }) => {
  // 📊 STATE
  const [clients, setClients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('list'); // list, new, detail

  // 📝 ORDER FORM DATA
  const [orderData, setOrderData] = useState({
    montatura: {
      marca: '',
      modello: '',
      colore: '',
      upc: '',
      prezzo: 0
    },
    lenti: {
      tipo: 'monofocale',
      marca: '',
      modello: '',
      materiale: 'CR39',
      indice: '1.50',
      trattamenti: [],
      fotocromatiche: false,
      polarizzate: false,
      prezzo: 0
    },
    garanzie: [],
    centratura: {
      altezza_montaggio_OD: 18,
      altezza_montaggio_OS: 18,
      distanza_vertice: 12,
      angolo_pantoscopico: 8,
      note_tecniche: ''
    },
    prezzi: {
      subtotale: 0,
      sconto_percentuale: 0,
      sconto_valore: 0,
      totale: 0
    },
    note_ordine: '',
    fornitore: '',
    acconto: 0
  });

  // 🔄 LOAD DATA
  useEffect(() => {
    const loadedClients = JSON.parse(localStorage.getItem(CONFIG.storageKeys.clients) || '[]');
    const loadedPrescriptions = JSON.parse(localStorage.getItem(CONFIG.storageKeys.prescriptions) || '[]');
    const loadedOrders = JSON.parse(localStorage.getItem(CONFIG.storageKeys.orders) || '[]');
    
    setClients(loadedClients);
    setPrescriptions(loadedPrescriptions);
    setOrders(loadedOrders);
  }, []);

  // 💰 CALCULATE TOTALS
  useEffect(() => {
    const montaturaPrice = parseFloat(orderData.montatura.prezzo) || 0;
    const lentiPrice = parseFloat(orderData.lenti.prezzo) || 0;
    
    const trattamentiPrice = orderData.lenti.trattamenti.reduce((sum, id) => {
      const t = CONFIG.trattamenti.find(tr => tr.id === id);
      return sum + (t?.prezzo || 0);
    }, 0);
    
    const garanziePrice = orderData.garanzie.reduce((sum, id) => {
      const g = CONFIG.garanzie.find(ga => ga.id === id);
      return sum + (g?.prezzo || 0);
    }, 0);
    
    const fotoPrice = orderData.lenti.fotocromatiche ? 50 : 0;
    const polarPrice = orderData.lenti.polarizzate ? 60 : 0;
    
    const subtotale = montaturaPrice + lentiPrice + trattamentiPrice + garanziePrice + fotoPrice + polarPrice;
    const sconto_valore = subtotale * (orderData.prezzi.sconto_percentuale / 100);
    const totale = subtotale - sconto_valore;
    
    setOrderData(prev => ({
      ...prev,
      prezzi: {
        ...prev.prezzi,
        subtotale,
        sconto_valore,
        totale
      }
    }));
  }, [
    orderData.montatura.prezzo,
    orderData.lenti.prezzo,
    orderData.lenti.trattamenti,
    orderData.lenti.fotocromatiche,
    orderData.lenti.polarizzate,
    orderData.garanzie,
    orderData.prezzi.sconto_percentuale
  ]);

  // 💾 SAVE ORDER
  const saveOrder = () => {
    const order = {
      id: Date.now(),
      clientId: selectedClient.id,
      prescriptionId: selectedPrescription.id,
      date: new Date().toISOString(),
      status: 'in_attesa_ordine',
      ...orderData,
      timestamp: new Date().toISOString()
    };

    const newOrders = [order, ...orders];
    setOrders(newOrders);
    localStorage.setItem(CONFIG.storageKeys.orders, JSON.stringify(newOrders));

    alert('✓ Ordine salvato con successo!');
    resetOrder();
    setView('list');
  };

  // 🔄 RESET ORDER
  const resetOrder = () => {
    setCurrentStep(1);
    setSelectedClient(null);
    setSelectedPrescription(null);
    setOrderData({
      montatura: { marca: '', modello: '', colore: '', upc: '', prezzo: 0 },
      lenti: {
        tipo: 'monofocale',
        marca: '',
        modello: '',
        materiale: 'CR39',
        indice: '1.50',
        trattamenti: [],
        fotocromatiche: false,
        polarizzate: false,
        prezzo: 0
      },
      garanzie: [],
      centratura: {
        altezza_montaggio_OD: 18,
        altezza_montaggio_OS: 18,
        distanza_vertice: 12,
        angolo_pantoscopico: 8,
        note_tecniche: ''
      },
      prezzi: {
        subtotale: 0,
        sconto_percentuale: 0,
        sconto_valore: 0,
        totale: 0
      },
      note_ordine: '',
      fornitore: '',
      acconto: 0
    });
  };

  // ✅ VALIDATE STEP
  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedClient && selectedPrescription;
      case 2: return orderData.montatura.marca && orderData.montatura.modello && orderData.montatura.prezzo > 0;
      case 3: return orderData.lenti.marca && orderData.lenti.prezzo > 0;
      case 4: return true; // Garanzie opzionali
      case 5: return true; // Centratura ha valori di default
      case 6: return true; // Riepilogo
      default: return false;
    }
  };

  // 🔍 FILTER
  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clientPrescriptions = selectedClient 
    ? prescriptions.filter(p => p.clientId === selectedClient.id)
    : [];

  const steps = [
    { num: 1, label: 'Cliente' },
    { num: 2, label: 'Montatura' },
    { num: 3, label: 'Lenti' },
    { num: 4, label: 'Garanzie' },
    { num: 5, label: 'Centratura' },
    { num: 6, label: 'Riepilogo' }
  ];

  // 📄 GENERATE PDF
  const generatePDF = (order) => {
    const client = clients.find(c => c.id === order.clientId);
    const presc = prescriptions.find(p => p.id === order.prescriptionId);
    
    const pdfContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         WORK ORDER - ${CONFIG.brand.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ordine #${order.id}
Data: ${new Date(order.date).toLocaleDateString('it-IT')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nome: ${client?.name}
Email: ${client?.email}
Tel: ${client?.phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRESCRIZIONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tipo Lente: ${presc?.occhiali.tipo_lente}

OD: ${presc?.occhiali.lontano.OD.sfero > 0 ? '+' : ''}${presc?.occhiali.lontano.OD.sfero.toFixed(2)} 
    ${presc?.occhiali.lontano.OD.cilindro > 0 ? '+' : ''}${presc?.occhiali.lontano.OD.cilindro.toFixed(2)} 
    × ${presc?.occhiali.lontano.OD.asse}°

OS: ${presc?.occhiali.lontano.OS.sfero > 0 ? '+' : ''}${presc?.occhiali.lontano.OS.sfero.toFixed(2)} 
    ${presc?.occhiali.lontano.OS.cilindro > 0 ? '+' : ''}${presc?.occhiali.lontano.OS.cilindro.toFixed(2)} 
    × ${presc?.occhiali.lontano.OS.asse}°

${presc?.occhiali.addizione > 0 ? `ADD: +${presc?.occhiali.addizione.toFixed(2)}` : ''}

PD: ${presc?.occhiali.pd_lontano_totale}mm (${presc?.occhiali.pd_lontano_OD}/${presc?.occhiali.pd_lontano_OS})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MONTATURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Marca: ${order.montatura.marca}
Modello: ${order.montatura.modello}
Colore: ${order.montatura.colore}
UPC: ${order.montatura.upc}
Prezzo: €${order.montatura.prezzo.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LENTI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Marca: ${order.lenti.marca}
Modello: ${order.lenti.modello}
Materiale: ${order.lenti.materiale}
Indice: ${order.lenti.indice}
${order.lenti.fotocromatiche ? 'Fotocromatiche: SÌ' : ''}
${order.lenti.polarizzate ? 'Polarizzate: SÌ' : ''}

Trattamenti:
${order.lenti.trattamenti.map(id => {
  const t = CONFIG.trattamenti.find(tr => tr.id === id);
  return `  • ${t?.label} - €${t?.prezzo}`;
}).join('\n')}

Prezzo Lenti: €${order.lenti.prezzo.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CENTRATURA & DISTANZE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PD Lontano: ${order.centratura.pd_lontano_totale}mm (OD: ${order.centratura.pd_lontano_OD}mm / OS: ${order.centratura.pd_lontano_OS}mm)
${order.centratura.pd_vicino_totale > 0 ? `PD Vicino: ${order.centratura.pd_vicino_totale}mm (OD: ${order.centratura.pd_vicino_OD}mm / OS: ${order.centratura.pd_vicino_OS}mm)` : ''}

Altezza OD: ${order.centratura.altezza_montaggio_OD}mm
Altezza OS: ${order.centratura.altezza_montaggio_OS}mm
Distanza Vertice: ${order.centratura.distanza_vertice}mm
Angolo Pantoscopico: ${order.centratura.angolo_pantoscopico}°

${order.centratura.note_tecniche ? `Note: ${order.centratura.note_tecniche}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTALE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotale: €${order.prezzi.subtotale.toFixed(2)}
${order.prezzi.sconto_percentuale > 0 ? `Sconto (${order.prezzi.sconto_percentuale}%): -€${order.prezzi.sconto_valore.toFixed(2)}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTALE: €${order.prezzi.totale.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fornitore: ${order.fornitore}

${order.note_ordine ? `Note: ${order.note_ordine}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STATO: IN ATTESA FATTURAZIONE
`;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WorkOrder_${order.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ 
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh',
      background: '#F3F4F6',
      padding: '20px'
    }}>
      <style>{styles}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                📦 Gestione Ordini
              </h1>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Crea e gestisci ordini occhiali completi
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
                    resetOrder();
                    setView('new');
                  }}
                  className="btn-success"
                  style={{ padding: '12px 24px', fontSize: '1rem' }}
                >
                  ➕ Nuovo Ordine
                </button>
              )}
              {view !== 'list' && (
                <button
                  onClick={() => {
                    setView('list');
                    resetOrder();
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
          <div className="card">
            <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
              Ordini Recenti
            </h3>
            
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
                <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                  Nessun ordine ancora
                </p>
                <button
                  onClick={() => setView('new')}
                  className="btn-primary"
                >
                  ➕ Crea il Primo Ordine
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {orders.map(order => {
                  const client = clients.find(c => c.id === order.clientId);
                  return (
                    <div
                      key={order.id}
                      style={{
                        border: '2px solid #E5E7EB',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = CONFIG.brand.colors.primary}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                          <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#1F2937' }}>
                            {client?.name}
                          </h4>
                          <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                            Ordine #{order.id} - {new Date(order.date).toLocaleDateString('it-IT')}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              generatePDF(order);
                            }}
                            className="btn-primary"
                            style={{ padding: '8px 16px' }}
                          >
                            📄 PDF
                          </button>
                        </div>
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
                            Montatura
                          </div>
                          <div style={{ fontWeight: 600 }}>
                            {order.montatura.marca} {order.montatura.modello}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '5px' }}>
                            Lenti
                          </div>
                          <div style={{ fontWeight: 600 }}>
                            {order.lenti.marca} - {order.lenti.materiale}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '5px' }}>
                            Totale
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: CONFIG.brand.colors.primary }}>
                            €{order.prezzi.totale.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ➕ NEW ORDER VIEW */}
        {view === 'new' && (
          <>
            {/* STEPPER */}
            <div className="card">
              <div className="stepper">
                {steps.map(step => (
                  <div
                    key={step.num}
                    className={`step ${currentStep === step.num ? 'active' : ''} ${currentStep > step.num ? 'completed' : ''}`}
                    onClick={() => {
                      if (step.num < currentStep || (step.num === currentStep + 1 && canProceed())) {
                        setCurrentStep(step.num);
                      }
                    }}
                  >
                    <div className="step-number">
                      {currentStep > step.num ? '✓' : step.num}
                    </div>
                    <div className="step-label">{step.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 1: CLIENTE & PRESCRIZIONE */}
            {currentStep === 1 && (
              <div className="card">
                <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
                  1. Seleziona Cliente e Prescrizione
                </h3>

                {!selectedClient ? (
                  <>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="🔍 Cerca cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gap: '10px' }}>
                      {filteredClients.map(client => (
                        <div
                          key={client.id}
                          onClick={() => setSelectedClient(client)}
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
                            {client.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ 
                      padding: '15px',
                      background: '#EFF6FF',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      borderLeft: '4px solid ' + CONFIG.brand.colors.primary
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: '#1E40AF', marginBottom: '5px' }}>
                            CLIENTE SELEZIONATO
                          </div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                            {selectedClient.name}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedClient(null);
                            setSelectedPrescription(null);
                          }}
                          className="btn-secondary"
                          style={{ padding: '8px 16px' }}
                        >
                          Cambia
                        </button>
                      </div>
                    </div>

                    <h4 style={{ marginBottom: '15px', color: '#374151' }}>
                      Seleziona Prescrizione
                    </h4>

                    {clientPrescriptions.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
                        <p>Nessuna prescrizione disponibile per questo cliente</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {clientPrescriptions.map(presc => (
                          <div
                            key={presc.id}
                            onClick={() => setSelectedPrescription(presc)}
                            style={{
                              padding: '15px',
                              background: selectedPrescription?.id === presc.id ? '#EFF6FF' : '#F9FAFB',
                              border: '2px solid ' + (selectedPrescription?.id === presc.id ? CONFIG.brand.colors.primary : '#E5E7EB'),
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ marginBottom: '10px' }}>
                              <span style={{ fontWeight: 600 }}>
                                {new Date(presc.timestamp).toLocaleDateString('it-IT')}
                              </span>
                              {' - '}
                              <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                                {presc.occhiali.tipo_lente}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>
                              OD: {presc.occhiali.lontano.OD.sfero > 0 ? '+' : ''}{presc.occhiali.lontano.OD.sfero.toFixed(2)} / 
                              {presc.occhiali.lontano.OD.cilindro > 0 ? '+' : ''}{presc.occhiali.lontano.OD.cilindro.toFixed(2)} × {presc.occhiali.lontano.OD.asse}°
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* STEP 2: MONTATURA */}
            {currentStep === 2 && (
              <div className="card">
                <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
                  2. Dati Montatura
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="input-group">
                    <label>Marca *</label>
                    <input
                      type="text"
                      value={orderData.montatura.marca}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        montatura: { ...prev.montatura, marca: e.target.value }
                      }))}
                      placeholder="Ray-Ban, Oakley, etc."
                    />
                  </div>

                  <div className="input-group">
                    <label>Modello *</label>
                    <input
                      type="text"
                      value={orderData.montatura.modello}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        montatura: { ...prev.montatura, modello: e.target.value }
                      }))}
                      placeholder="RB2132 Wayfarer"
                    />
                  </div>

                  <div className="input-group">
                    <label>Colore</label>
                    <input
                      type="text"
                      value={orderData.montatura.colore}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        montatura: { ...prev.montatura, colore: e.target.value }
                      }))}
                      placeholder="Black, Tortoise, etc."
                    />
                  </div>

                  <div className="input-group">
                    <label>UPC / Codice Articolo</label>
                    <input
                      type="text"
                      value={orderData.montatura.upc}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        montatura: { ...prev.montatura, upc: e.target.value }
                      }))}
                      placeholder="713132404447"
                    />
                  </div>

                  <div className="input-group">
                    <label>Prezzo Montatura (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderData.montatura.prezzo}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        montatura: { ...prev.montatura, prezzo: parseFloat(e.target.value) || 0 }
                      }))}
                      placeholder="120.00"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: LENTI & TRATTAMENTI */}
            {currentStep === 3 && (
              <div className="card">
                <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
                  3. Configurazione Lenti
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div className="input-group">
                    <label>Tipo Lente</label>
                    <select
                      value={orderData.lenti.tipo}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        lenti: { ...prev.lenti, tipo: e.target.value }
                      }))}
                    >
                      <option value="monofocale">Monofocale</option>
                      <option value="progressiva">Progressiva</option>
                      <option value="bifocale">Bifocale</option>
                      <option value="office">Office</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Marca Lenti *</label>
                    <input
                      type="text"
                      value={orderData.lenti.marca}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        lenti: { ...prev.lenti, marca: e.target.value }
                      }))}
                      placeholder="Zeiss, Essilor, Hoya"
                    />
                  </div>

                  <div className="input-group">
                    <label>Modello</label>
                    <input
                      type="text"
                      value={orderData.lenti.modello}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        lenti: { ...prev.lenti, modello: e.target.value }
                      }))}
                      placeholder="Precision Plus, Varilux"
                    />
                  </div>

                  <div className="input-group">
                    <label>Materiale</label>
                    <select
                      value={orderData.lenti.materiale}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        lenti: { ...prev.lenti, materiale: e.target.value }
                      }))}
                    >
                      <option value="CR39">CR39 (Resina)</option>
                      <option value="Policarbonato">Policarbonato</option>
                      <option value="Trivex">Trivex</option>
                      <option value="Minerale">Minerale</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Indice Rifrazione</label>
                    <select
                      value={orderData.lenti.indice}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        lenti: { ...prev.lenti, indice: e.target.value }
                      }))}
                    >
                      <option value="1.50">1.50 (Standard)</option>
                      <option value="1.56">1.56 (Sottile)</option>
                      <option value="1.60">1.60 (Extra Sottile)</option>
                      <option value="1.67">1.67 (Ultra Sottile)</option>
                      <option value="1.74">1.74 (Super Sottile)</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Prezzo Lenti (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderData.lenti.prezzo}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        lenti: { ...prev.lenti, prezzo: parseFloat(e.target.value) || 0 }
                      }))}
                      placeholder="280.00"
                    />
                  </div>
                </div>

                <h4 style={{ marginBottom: '15px', color: '#374151' }}>
                  Opzioni Speciali
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div
                    className={`checkbox-card ${orderData.lenti.fotocromatiche ? 'selected' : ''}`}
                    onClick={() => setOrderData(prev => ({
                      ...prev,
                      lenti: { ...prev.lenti, fotocromatiche: !prev.lenti.fotocromatiche }
                    }))}
                  >
                    <input
                      type="checkbox"
                      checked={orderData.lenti.fotocromatiche}
                      readOnly
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>Fotocromatiche</div>
                      <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Si scuriscono al sole</div>
                    </div>
                    <span className="price-tag">+€50</span>
                  </div>

                  <div
                    className={`checkbox-card ${orderData.lenti.polarizzate ? 'selected' : ''}`}
                    onClick={() => setOrderData(prev => ({
                      ...prev,
                      lenti: { ...prev.lenti, polarizzate: !prev.lenti.polarizzate }
                    }))}
                  >
                    <input
                      type="checkbox"
                      checked={orderData.lenti.polarizzate}
                      readOnly
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>Polarizzate</div>
                      <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Eliminano riflessi</div>
                    </div>
                    <span className="price-tag">+€60</span>
                  </div>
                </div>

                <h4 style={{ marginBottom: '15px', color: '#374151' }}>
                  Trattamenti
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
                  {CONFIG.trattamenti.map(tratt => (
                    <div
                      key={tratt.id}
                      className={`checkbox-card ${orderData.lenti.trattamenti.includes(tratt.id) ? 'selected' : ''}`}
                      onClick={() => {
                        const isSelected = orderData.lenti.trattamenti.includes(tratt.id);
                        setOrderData(prev => ({
                          ...prev,
                          lenti: {
                            ...prev.lenti,
                            trattamenti: isSelected
                              ? prev.lenti.trattamenti.filter(id => id !== tratt.id)
                              : [...prev.lenti.trattamenti, tratt.id]
                          }
                        }));
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={orderData.lenti.trattamenti.includes(tratt.id)}
                        readOnly
                      />
                      <div style={{ flex: 1, fontWeight: 600 }}>{tratt.label}</div>
                      <span className="price-tag">+€{tratt.prezzo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: GARANZIE */}
            {currentStep === 4 && (
              <div className="card">
                <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
                  4. Garanzie Opzionali
                </h3>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {CONFIG.garanzie.map(gar => (
                    <div
                      key={gar.id}
                      className={`checkbox-card ${orderData.garanzie.includes(gar.id) ? 'selected' : ''}`}
                      onClick={() => {
                        const isSelected = orderData.garanzie.includes(gar.id);
                        setOrderData(prev => ({
                          ...prev,
                          garanzie: isSelected
                            ? prev.garanzie.filter(id => id !== gar.id)
                            : [...prev.garanzie, gar.id]
                        }));
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={orderData.garanzie.includes(gar.id)}
                        readOnly
                      />
                      <div style={{ flex: 1, fontWeight: 600 }}>{gar.label}</div>
                      <span className="price-tag">+€{gar.prezzo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: CENTRATURA */}
            {currentStep === 5 && (
              <div className="card">
                <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
                  5. Parametri di Centratura e Distanze
                </h3>

                <div style={{
                  padding: '12px 15px',
                  background: '#EFF6FF',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                  color: '#1E40AF'
                }}>
                  ℹ️ Le distanze pupillari vengono caricate dalla prescrizione ma puoi modificarle se necessario
                </div>

                <h4 style={{ marginBottom: '15px', color: '#374151' }}>
                  Distanze Pupillari (PD)
                </h4>

                <div style={{ display: 'grid', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ padding: '15px', background: '#F9FAFB', borderRadius: '8px' }}>
                    <h5 style={{ margin: '0 0 15px 0', color: '#374151' }}>Per Lontano</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                      <div className="input-group">
                        <label>PD Totale (mm)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={orderData.centratura.pd_lontano_totale}
                          onChange={(e) => {
                            const total = parseFloat(e.target.value) || 0;
                            setOrderData(prev => ({
                              ...prev,
                              centratura: {
                                ...prev.centratura,
                                pd_lontano_totale: total,
                                pd_lontano_OD: total / 2,
                                pd_lontano_OS: total / 2
                              }
                            }));
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <label>PD OD (mm)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={orderData.centratura.pd_lontano_OD}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            centratura: { ...prev.centratura, pd_lontano_OD: parseFloat(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                      <div className="input-group">
                        <label>PD OS (mm)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={orderData.centratura.pd_lontano_OS}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            centratura: { ...prev.centratura, pd_lontano_OS: parseFloat(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '15px', background: '#F9FAFB', borderRadius: '8px' }}>
                    <h5 style={{ margin: '0 0 15px 0', color: '#374151' }}>Per Vicino (opzionale)</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                      <div className="input-group">
                        <label>PD Totale (mm)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={orderData.centratura.pd_vicino_totale}
                          onChange={(e) => {
                            const total = parseFloat(e.target.value) || 0;
                            setOrderData(prev => ({
                              ...prev,
                              centratura: {
                                ...prev.centratura,
                                pd_vicino_totale: total,
                                pd_vicino_OD: total / 2,
                                pd_vicino_OS: total / 2
                              }
                            }));
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <label>PD OD (mm)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={orderData.centratura.pd_vicino_OD}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            centratura: { ...prev.centratura, pd_vicino_OD: parseFloat(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                      <div className="input-group">
                        <label>PD OS (mm)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={orderData.centratura.pd_vicino_OS}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            centratura: { ...prev.centratura, pd_vicino_OS: parseFloat(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <h4 style={{ marginBottom: '15px', color: '#374151' }}>
                  Parametri di Montaggio
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="input-group">
                    <label>Altezza Montaggio OD (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={orderData.centratura.altezza_montaggio_OD}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        centratura: { ...prev.centratura, altezza_montaggio_OD: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>

                  <div className="input-group">
                    <label>Altezza Montaggio OS (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={orderData.centratura.altezza_montaggio_OS}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        centratura: { ...prev.centratura, altezza_montaggio_OS: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>

                  <div className="input-group">
                    <label>Distanza Vertice (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={orderData.centratura.distanza_vertice}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        centratura: { ...prev.centratura, distanza_vertice: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>

                  <div className="input-group">
                    <label>Angolo Pantoscopico (°)</label>
                    <input
                      type="number"
                      step="1"
                      value={orderData.centratura.angolo_pantoscopico}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        centratura: { ...prev.centratura, angolo_pantoscopico: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: '15px' }}>
                  <label>Note Tecniche (Prismi, Altre Specifiche)</label>
                  <textarea
                    value={orderData.centratura.note_tecniche}
                    onChange={(e) => setOrderData(prev => ({
                      ...prev,
                      centratura: { ...prev.centratura, note_tecniche: e.target.value }
                    }))}
                    placeholder="Es: Prisma base interna 2Δ OD, prisma base esterna 1Δ OS..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {/* STEP 6: RIEPILOGO */}
            {currentStep === 6 && (
              <div className="card">
                <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
                  6. Riepilogo Ordine
                </h3>

                {/* Cliente */}
                <div style={{ marginBottom: '20px', padding: '15px', background: '#F9FAFB', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Cliente</h4>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedClient?.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>{selectedClient?.email}</div>
                </div>

                {/* Montatura */}
                <div style={{ marginBottom: '20px', padding: '15px', background: '#F9FAFB', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Montatura</h4>
                  <div style={{ display: 'grid', gap: '5px' }}>
                    <div><strong>Marca:</strong> {orderData.montatura.marca}</div>
                    <div><strong>Modello:</strong> {orderData.montatura.modello}</div>
                    {orderData.montatura.colore && <div><strong>Colore:</strong> {orderData.montatura.colore}</div>}
                    {orderData.montatura.upc && <div><strong>UPC:</strong> {orderData.montatura.upc}</div>}
                    <div style={{ marginTop: '5px', fontSize: '1.1rem', fontWeight: 700, color: CONFIG.brand.colors.primary }}>
                      €{orderData.montatura.prezzo.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Lenti */}
                <div style={{ marginBottom: '20px', padding: '15px', background: '#F9FAFB', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Lenti</h4>
                  <div style={{ display: 'grid', gap: '5px' }}>
                    <div><strong>Tipo:</strong> {orderData.lenti.tipo}</div>
                    <div><strong>Marca:</strong> {orderData.lenti.marca} {orderData.lenti.modello}</div>
                    <div><strong>Materiale:</strong> {orderData.lenti.materiale} - Indice {orderData.lenti.indice}</div>
                    {orderData.lenti.fotocromatiche && <div>✓ Fotocromatiche (+€50)</div>}
                    {orderData.lenti.polarizzate && <div>✓ Polarizzate (+€60)</div>}
                    {orderData.lenti.trattamenti.length > 0 && (
                      <div>
                        <strong>Trattamenti:</strong> {orderData.lenti.trattamenti.map(id => {
                          const t = CONFIG.trattamenti.find(tr => tr.id === id);
                          return t?.label;
                        }).join(', ')}
                      </div>
                    )}
                    <div style={{ marginTop: '5px', fontSize: '1.1rem', fontWeight: 700, color: CONFIG.brand.colors.primary }}>
                      €{orderData.lenti.prezzo.toFixed(2)} + trattamenti
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div style={{ 
                  padding: '20px',
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'grid', gap: '10px', fontSize: '1.1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotale:</span>
                      <span style={{ fontWeight: 600 }}>€{orderData.prezzi.subtotale.toFixed(2)}</span>
                    </div>
                    
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>Sconto (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={orderData.prezzi.sconto_percentuale}
                        onChange={(e) => setOrderData(prev => ({
                          ...prev,
                          prezzi: { ...prev.prezzi, sconto_percentuale: parseFloat(e.target.value) || 0 }
                        }))}
                      />
                    </div>

                    {orderData.prezzi.sconto_percentuale > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: CONFIG.brand.colors.danger }}>
                        <span>Sconto ({orderData.prezzi.sconto_percentuale}%):</span>
                        <span style={{ fontWeight: 600 }}>-€{orderData.prezzi.sconto_valore.toFixed(2)}</span>
                      </div>
                    )}

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      paddingTop: '15px',
                      borderTop: '2px solid ' + CONFIG.brand.colors.primary,
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: CONFIG.brand.colors.primary
                    }}>
                      <span>TOTALE:</span>
                      <span>€{orderData.prezzi.totale.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div className="input-group">
                    <label>Fornitore</label>
                    <input
                      type="text"
                      value={orderData.fornitore}
                      onChange={(e) => setOrderData(prev => ({ ...prev, fornitore: e.target.value }))}
                      placeholder="Luxottica, Safilo, etc."
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Note Ordine</label>
                  <textarea
                    value={orderData.note_ordine}
                    onChange={(e) => setOrderData(prev => ({ ...prev, note_ordine: e.target.value }))}
                    placeholder="Informazioni aggiuntive, urgenze, richieste particolari..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: '#FEF3C7',
                  borderRadius: '8px',
                  borderLeft: '4px solid ' + CONFIG.brand.colors.warning
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#92400E', fontWeight: 600, marginBottom: '5px' }}>
                    ⚠️ Nota Importante
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#78350F' }}>
                    L'ordine verrà salvato come <strong>IN SOSPESO</strong>. La gestione di acconto, saldo e fatturazione avverrà nel modulo CASSA.
                  </div>
                </div>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
              <button
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="btn-secondary"
                disabled={currentStep === 1}
              >
                ← Indietro
              </button>

              {currentStep < 6 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="btn-primary"
                  disabled={!canProceed()}
                >
                  Avanti →
                </button>
              ) : (
                <button
                  onClick={saveOrder}
                  className="btn-success"
                  style={{ padding: '12px 32px', fontSize: '1.1rem' }}
                >
                  ✓ Conferma Ordine
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdiniModule;
