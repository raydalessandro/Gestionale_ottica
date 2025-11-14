import React, { useState, useEffect } from 'react';

// 🎨 CONFIGURAZIONE
const CONFIG = {
  brand: {
    name: "EAR Ottica",
    colors: {
      primary: "#06B6D4",
      secondary: "#10B981",
      warning: "#F59E0B",
      danger: "#DC2626",
      info: "#3B82F6"
    }
  },
  storageKeys: {
    clients: "optical_clients",
    prescriptions: "optical_prescriptions",
    orders_lac: "optical_orders_lac"
  },
  marche_lac: [
    "Acuvue (Johnson & Johnson)",
    "Dailies (Alcon)",
    "Air Optix (Alcon)",
    "Biofinity (CooperVision)",
    "Biomedics (CooperVision)",
    "Proclear (CooperVision)",
    "Bausch + Lomb",
    "FreshLook (Alcon)",
    "Altra marca"
  ],
  tipi_sostituzione: [
    { id: 'giornaliere', label: 'Giornaliere (1 Day)', info: 'Una coppia al giorno' },
    { id: 'bisettimanali', label: 'Bisettimanali (2 Week)', info: 'Sostituzione ogni 2 settimane' },
    { id: 'mensili', label: 'Mensili (Monthly)', info: 'Sostituzione ogni mese' },
    { id: 'trimestrali', label: 'Trimestrali', info: 'Sostituzione ogni 3 mesi' },
    { id: 'annuali', label: 'Annuali/Permanenti', info: 'Durata 12+ mesi' }
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
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
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
  
  .radio-card {
    border: 2px solid #E5E7EB;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .radio-card:hover {
    border-color: ${CONFIG.brand.colors.primary};
    background: #ECFEFF;
  }
  
  .radio-card.selected {
    border-color: ${CONFIG.brand.colors.primary};
    background: #ECFEFF;
  }
`;

const OrdiniLACModule = ({ onBack }) => {
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
    prodotto: {
      marca: '',
      modello: '',
      tipo_sostituzione: 'mensili',
      OD: {
        sfero: 0,
        cilindro: 0,
        asse: 0,
        raggio: 8.6,
        diametro: 14.2,
        addizione: 0
      },
      OS: {
        sfero: 0,
        cilindro: 0,
        asse: 0,
        raggio: 8.6,
        diametro: 14.2,
        addizione: 0
      }
    },
    quantita: {
      confezioni_OD: 1,
      lenti_per_confezione: 30,
      confezioni_OS: 1,
      prezzo_confezione: 0
    },
    prezzi: {
      subtotale: 0,
      sconto_percentuale: 0,
      sconto_valore: 0,
      totale: 0
    },
    note_ordine: '',
    fornitore: ''
  });

  // 🔄 LOAD DATA
  useEffect(() => {
    const loadedClients = JSON.parse(localStorage.getItem(CONFIG.storageKeys.clients) || '[]');
    const loadedPrescriptions = JSON.parse(localStorage.getItem(CONFIG.storageKeys.prescriptions) || '[]');
    const loadedOrders = JSON.parse(localStorage.getItem(CONFIG.storageKeys.orders_lac) || '[]');
    
    setClients(loadedClients);
    setPrescriptions(loadedPrescriptions);
    setOrders(loadedOrders);
  }, []);

  // 📐 LOAD LAC PARAMS FROM PRESCRIPTION
  useEffect(() => {
    if (selectedPrescription && currentStep === 2) {
      if (selectedPrescription.lac) {
        setOrderData(prev => ({
          ...prev,
          prodotto: {
            ...prev.prodotto,
            OD: { ...selectedPrescription.lac.OD },
            OS: { ...selectedPrescription.lac.OS }
          }
        }));
      }
    }
  }, [selectedPrescription, currentStep]);

  // 💰 CALCULATE TOTALS
  useEffect(() => {
    const prezzoConfezione = parseFloat(orderData.quantita.prezzo_confezione) || 0;
    const totaleConfezioni = orderData.quantita.confezioni_OD + orderData.quantita.confezioni_OS;
    const subtotale = prezzoConfezione * totaleConfezioni;
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
    orderData.quantita.prezzo_confezione,
    orderData.quantita.confezioni_OD,
    orderData.quantita.confezioni_OS,
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
    localStorage.setItem(CONFIG.storageKeys.orders_lac, JSON.stringify(newOrders));

    alert('✓ Ordine LAC salvato con successo!');
    resetOrder();
    setView('list');
  };

  // 🔄 RESET ORDER
  const resetOrder = () => {
    setCurrentStep(1);
    setSelectedClient(null);
    setSelectedPrescription(null);
    setOrderData({
      prodotto: {
        marca: '',
        modello: '',
        tipo_sostituzione: 'mensili',
        OD: { sfero: 0, cilindro: 0, asse: 0, raggio: 8.6, diametro: 14.2, addizione: 0 },
        OS: { sfero: 0, cilindro: 0, asse: 0, raggio: 8.6, diametro: 14.2, addizione: 0 }
      },
      quantita: {
        confezioni_OD: 1,
        lenti_per_confezione: 30,
        confezioni_OS: 1,
        prezzo_confezione: 0
      },
      prezzi: {
        subtotale: 0,
        sconto_percentuale: 0,
        sconto_valore: 0,
        totale: 0
      },
      note_ordine: '',
      fornitore: ''
    });
  };

  // ✅ VALIDATE STEP
  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedClient && selectedPrescription;
      case 2: return orderData.prodotto.marca && orderData.prodotto.modello;
      case 3: return orderData.quantita.prezzo_confezione > 0;
      case 4: return true;
      default: return false;
    }
  };

  // 🔍 FILTER
  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // FILTRA SOLO PRESCRIZIONI LAC
  const clientPrescriptionsLAC = selectedClient 
    ? prescriptions.filter(p => p.clientId === selectedClient.id && p.lac && p.lac.OD && p.lac.OS)
    : [];

  const steps = [
    { num: 1, label: 'Cliente' },
    { num: 2, label: 'Prodotto LAC' },
    { num: 3, label: 'Quantità' },
    { num: 4, label: 'Riepilogo' }
  ];

  // 📄 GENERATE PDF
  const generatePDF = (order) => {
    const client = clients.find(c => c.id === order.clientId);
    const presc = prescriptions.find(p => p.id === order.prescriptionId);
    
    const totaleLentiOD = order.quantita.confezioni_OD * order.quantita.lenti_per_confezione;
    const totaleLentiOS = order.quantita.confezioni_OS * order.quantita.lenti_per_confezione;
    
    const pdfContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    WORK ORDER LAC - ${CONFIG.brand.name}
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
PRESCRIZIONE LAC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tipo: ${presc?.lac.tipo}

OD (Occhio Destro):
  Sfero: ${presc?.lac.OD.sfero > 0 ? '+' : ''}${presc?.lac.OD.sfero.toFixed(2)}
  Cilindro: ${presc?.lac.OD.cilindro > 0 ? '+' : ''}${presc?.lac.OD.cilindro.toFixed(2)}
  Asse: ${presc?.lac.OD.asse}°
  Raggio: ${presc?.lac.OD.raggio}mm
  Diametro: ${presc?.lac.OD.diametro}mm
  ${presc?.lac.OD.addizione > 0 ? `Add: +${presc?.lac.OD.addizione.toFixed(2)}` : ''}

OS (Occhio Sinistro):
  Sfero: ${presc?.lac.OS.sfero > 0 ? '+' : ''}${presc?.lac.OS.sfero.toFixed(2)}
  Cilindro: ${presc?.lac.OS.cilindro > 0 ? '+' : ''}${presc?.lac.OS.cilindro.toFixed(2)}
  Asse: ${presc?.lac.OS.asse}°
  Raggio: ${presc?.lac.OS.raggio}mm
  Diametro: ${presc?.lac.OS.diametro}mm
  ${presc?.lac.OS.addizione > 0 ? `Add: +${presc?.lac.OS.addizione.toFixed(2)}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODOTTO ORDINATO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Marca: ${order.prodotto.marca}
Modello: ${order.prodotto.modello}
Tipo: ${CONFIG.tipi_sostituzione.find(t => t.id === order.prodotto.tipo_sostituzione)?.label}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARAMETRI PRODOTTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OD: ${order.prodotto.OD.sfero > 0 ? '+' : ''}${order.prodotto.OD.sfero.toFixed(2)} / 
    ${order.prodotto.OD.cilindro > 0 ? '+' : ''}${order.prodotto.OD.cilindro.toFixed(2)} × ${order.prodotto.OD.asse}°
    BC: ${order.prodotto.OD.raggio}mm | DIA: ${order.prodotto.OD.diametro}mm
    ${order.prodotto.OD.addizione > 0 ? `ADD: +${order.prodotto.OD.addizione.toFixed(2)}` : ''}

OS: ${order.prodotto.OS.sfero > 0 ? '+' : ''}${order.prodotto.OS.sfero.toFixed(2)} / 
    ${order.prodotto.OS.cilindro > 0 ? '+' : ''}${order.prodotto.OS.cilindro.toFixed(2)} × ${order.prodotto.OS.asse}°
    BC: ${order.prodotto.OS.raggio}mm | DIA: ${order.prodotto.OS.diametro}mm
    ${order.prodotto.OS.addizione > 0 ? `ADD: +${order.prodotto.OS.addizione.toFixed(2)}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUANTITÀ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Occhio Destro (OD):
  ${order.quantita.confezioni_OD} confezioni × ${order.quantita.lenti_per_confezione} lenti
  Totale: ${totaleLentiOD} lenti

Occhio Sinistro (OS):
  ${order.quantita.confezioni_OS} confezioni × ${order.quantita.lenti_per_confezione} lenti
  Totale: ${totaleLentiOS} lenti

Totale Confezioni: ${order.quantita.confezioni_OD + order.quantita.confezioni_OS}
Prezzo per confezione: €${order.quantita.prezzo_confezione.toFixed(2)}

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

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WorkOrder_LAC_${order.id}.txt`;
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
          background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h1 style={{ margin: '0 0 5px 0', fontSize: '2rem', fontWeight: 700 }}>
                👁️ Ordini Lenti a Contatto
              </h1>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Gestione ordini LAC completi
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
                  ➕ Nuovo Ordine LAC
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
              Ordini LAC Recenti
            </h3>
            
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👁️</div>
                <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                  Nessun ordine LAC ancora
                </p>
                <button
                  onClick={() => setView('new')}
                  className="btn-primary"
                >
                  ➕ Crea il Primo Ordine LAC
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {orders.map(order => {
                  const client = clients.find(c => c.id === order.clientId);
                  const totalConfezioni = order.quantita.confezioni_OD + order.quantita.confezioni_OS;
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
                            Prodotto
                          </div>
                          <div style={{ fontWeight: 600 }}>
                            {order.prodotto.marca}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                            {order.prodotto.modello}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '5px' }}>
                            Quantità
                          </div>
                          <div style={{ fontWeight: 600 }}>
                            {totalConfezioni} confezioni
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
                  1. Seleziona Cliente e Prescrizione LAC
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
                      background: '#ECFEFF',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      borderLeft: '4px solid ' + CONFIG.brand.colors.primary
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: '#0891B2', marginBottom: '5px' }}>
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
                      Seleziona Prescrizione LAC
                    </h4>

                    {clientPrescriptionsLAC.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👁️</div>
                        <p>Nessuna prescrizione LAC disponibile per questo cliente</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                          Crea prima una prescrizione LAC nel modulo "Visite & Prescrizioni"
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {clientPrescriptionsLAC.map(presc => (
                          <div
                            key={presc.id}
                            onClick={() => setSelectedPrescription(presc)}
                            style={{
                              padding: '15px',
                              background: selectedPrescription?.id === presc.id ? '#ECFEFF' : '#F9FAFB',
                              border: '2px solid ' + (selectedPrescription?.id === presc.id ? CONFIG.brand.colors.primary : '#E5E7EB'),
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{
                                background: CONFIG.brand.colors.primary,
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 600
                              }}>
                                👁️ LAC
                              </span>
                              <span style={{ fontWeight: 600 }}>
                                {new Date(presc.timestamp).toLocaleDateString('it-IT')}
                              </span>
                              <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                                {presc.lac.tipo}
                              </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                              <div>
                                <strong>OD:</strong> {presc.lac.OD.sfero > 0 ? '+' : ''}{presc.lac.OD.sfero.toFixed(2)} | 
                                BC {presc.lac.OD.raggio}
                              </div>
                              <div>
                                <strong>OS:</strong> {presc.lac.OS.sfero > 0 ? '+' : ''}{presc.lac.OS.sfero.toFixed(2)} | 
                                BC {presc.lac.OS.raggio}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* STEP 2: PRODOTTO LAC */}
            {currentStep === 2 && (
              <div className="card">
                <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
                  2. Dati Prodotto LAC
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div className="input-group">
                    <label>Marca LAC *</label>
                    <select
                      value={orderData.prodotto.marca}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        prodotto: { ...prev.prodotto, marca: e.target.value }
                      }))}
                    >
                      <option value="">Seleziona marca...</option>
                      {CONFIG.marche_lac.map(marca => (
                        <option key={marca} value={marca}>{marca}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Modello / Nome Prodotto *</label>
                    <input
                      type="text"
                      value={orderData.prodotto.modello}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        prodotto: { ...prev.prodotto, modello: e.target.value }
                      }))}
                      placeholder="Oasys, Moist, Ultra, etc."
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '20px' }}>
                  <label>Tipo Sostituzione</label>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {CONFIG.tipi_sostituzione.map(tipo => (
                      <div
                        key={tipo.id}
                        className={`radio-card ${orderData.prodotto.tipo_sostituzione === tipo.id ? 'selected' : ''}`}
                        onClick={() => setOrderData(prev => ({
                          ...prev,
                          prodotto: { ...prev.prodotto, tipo_sostituzione: tipo.id }
                        }))}
                      >
                        <input
                          type="radio"
                          checked={orderData.prodotto.tipo_sostituzione === tipo.id}
                          readOnly
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{tipo.label}</div>
                          <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{tipo.info}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  padding: '12px 15px',
                  background: '#EFF6FF',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                  color: '#1E40AF'
                }}>
                  ℹ️ I parametri vengono caricati dalla prescrizione ma puoi verificarli/modificarli
                </div>

                {/* PARAMETRI OD/OS */}
                {['OD', 'OS'].map(eye => (
                  <div key={eye} style={{ padding: '15px', background: '#F9FAFB', borderRadius: '8px', marginBottom: '15px' }}>
                    <h5 style={{ margin: '0 0 15px 0', color: '#374151' }}>
                      {eye === 'OD' ? '👁️ OD (Occhio Destro)' : '👁️ OS (Occhio Sinistro)'}
                    </h5>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                      <div className="input-group">
                        <label style={{ fontSize: '0.85rem' }}>Sfero</label>
                        <input
                          type="number"
                          step="0.25"
                          value={orderData.prodotto[eye].sfero}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            prodotto: {
                              ...prev.prodotto,
                              [eye]: { ...prev.prodotto[eye], sfero: parseFloat(e.target.value) || 0 }
                            }
                          }))}
                          style={{ fontSize: '0.9rem', padding: '8px' }}
                        />
                      </div>
                      
                      <div className="input-group">
                        <label style={{ fontSize: '0.85rem' }}>Cil</label>
                        <input
                          type="number"
                          step="0.25"
                          value={orderData.prodotto[eye].cilindro}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            prodotto: {
                              ...prev.prodotto,
                              [eye]: { ...prev.prodotto[eye], cilindro: parseFloat(e.target.value) || 0 }
                            }
                          }))}
                          style={{ fontSize: '0.9rem', padding: '8px' }}
                        />
                      </div>
                      
                      <div className="input-group">
                        <label style={{ fontSize: '0.85rem' }}>Asse</label>
                        <input
                          type="number"
                          min="0"
                          max="180"
                          value={orderData.prodotto[eye].asse}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            prodotto: {
                              ...prev.prodotto,
                              [eye]: { ...prev.prodotto[eye], asse: parseInt(e.target.value) || 0 }
                            }
                          }))}
                          style={{ fontSize: '0.9rem', padding: '8px' }}
                        />
                      </div>
                      
                      <div className="input-group">
                        <label style={{ fontSize: '0.85rem' }}>BC (mm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={orderData.prodotto[eye].raggio}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            prodotto: {
                              ...prev.prodotto,
                              [eye]: { ...prev.prodotto[eye], raggio: parseFloat(e.target.value) || 0 }
                            }
                          }))}
                          style={{ fontSize: '0.9rem', padding: '8px' }}
                        />
                      </div>
                      
                      <div className="input-group">
                        <label style={{ fontSize: '0.85rem' }}>DIA (mm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={orderData.prodotto[eye].diametro}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            prodotto: {
                              ...prev.prodotto,
                              [eye]: { ...prev.prodotto[eye], diametro: parseFloat(e.target.value) || 0 }
                            }
                          }))}
                          style={{ fontSize: '0.9rem', padding: '8px' }}
                        />
                      </div>
                      
                      <div className="input-group">
                        <label style={{ fontSize: '0.85rem' }}>Add</label>
                        <input
                          type="number"
                          step="0.25"
                          value={orderData.prodotto[eye].addizione}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            prodotto: {
                              ...prev.prodotto,
                              [eye]: { ...prev.prodotto[eye], addizione: parseFloat(e.target.value) || 0 }
                            }
                          }))}
                          style={{ fontSize: '0.9rem', padding: '8px' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 3: QUANTITÀ & PREZZO */}
            {currentStep === 3 && (
              <div className="card">
                <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
                  3. Quantità e Prezzi
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div className="input-group">
                    <label>Lenti per Confezione</label>
                    <select
                      value={orderData.quantita.lenti_per_confezione}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        quantita: { ...prev.quantita, lenti_per_confezione: parseInt(e.target.value) }
                      }))}
                    >
                      <option value="5">5 lenti</option>
                      <option value="6">6 lenti</option>
                      <option value="10">10 lenti</option>
                      <option value="30">30 lenti</option>
                      <option value="90">90 lenti</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Prezzo per Confezione (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderData.quantita.prezzo_confezione}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        quantita: { ...prev.quantita, prezzo_confezione: parseFloat(e.target.value) || 0 }
                      }))}
                      placeholder="25.00"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ padding: '15px', background: '#F9FAFB', borderRadius: '8px' }}>
                    <h5 style={{ margin: '0 0 15px 0', color: '#374151' }}>
                      Occhio Destro (OD)
                    </h5>
                    <div className="input-group">
                      <label>Numero Confezioni</label>
                      <input
                        type="number"
                        min="1"
                        value={orderData.quantita.confezioni_OD}
                        onChange={(e) => setOrderData(prev => ({
                          ...prev,
                          quantita: { ...prev.quantita, confezioni_OD: parseInt(e.target.value) || 1 }
                        }))}
                      />
                    </div>
                    <div style={{ marginTop: '10px', padding: '10px', background: '#E0F2FE', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#0891B2', marginBottom: '5px' }}>
                        Totale Lenti OD
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: CONFIG.brand.colors.primary }}>
                        {orderData.quantita.confezioni_OD * orderData.quantita.lenti_per_confezione} lenti
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '15px', background: '#F9FAFB', borderRadius: '8px' }}>
                    <h5 style={{ margin: '0 0 15px 0', color: '#374151' }}>
                      Occhio Sinistro (OS)
                    </h5>
                    <div className="input-group">
                      <label>Numero Confezioni</label>
                      <input
                        type="number"
                        min="1"
                        value={orderData.quantita.confezioni_OS}
                        onChange={(e) => setOrderData(prev => ({
                          ...prev,
                          quantita: { ...prev.quantita, confezioni_OS: parseInt(e.target.value) || 1 }
                        }))}
                      />
                    </div>
                    <div style={{ marginTop: '10px', padding: '10px', background: '#E0F2FE', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#0891B2', marginBottom: '5px' }}>
                        Totale Lenti OS
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: CONFIG.brand.colors.primary }}>
                        {orderData.quantita.confezioni_OS * orderData.quantita.lenti_per_confezione} lenti
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: '#ECFEFF',
                  borderRadius: '8px',
                  borderLeft: '4px solid ' + CONFIG.brand.colors.primary
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#0891B2', marginBottom: '5px' }}>
                        Totale Confezioni
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937' }}>
                        {orderData.quantita.confezioni_OD + orderData.quantita.confezioni_OS} confezioni
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', color: '#0891B2', marginBottom: '5px' }}>
                        Subtotale Provvisorio
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 700, color: CONFIG.brand.colors.primary }}>
                        €{orderData.prezzi.subtotale.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: RIEPILOGO */}
            {currentStep === 4 && (
              <div className="card">
                <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>
                  4. Riepilogo Ordine LAC
                </h3>

                {/* Cliente */}
                <div style={{ marginBottom: '20px', padding: '15px', background: '#F9FAFB', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Cliente</h4>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedClient?.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>{selectedClient?.email}</div>
                </div>

                {/* Prodotto */}
                <div style={{ marginBottom: '20px', padding: '15px', background: '#F9FAFB', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Prodotto LAC</h4>
                  <div style={{ display: 'grid', gap: '5px' }}>
                    <div><strong>Marca:</strong> {orderData.prodotto.marca}</div>
                    <div><strong>Modello:</strong> {orderData.prodotto.modello}</div>
                    <div><strong>Tipo:</strong> {CONFIG.tipi_sostituzione.find(t => t.id === orderData.prodotto.tipo_sostituzione)?.label}</div>
                  </div>
                </div>

                {/* Quantità */}
                <div style={{ marginBottom: '20px', padding: '15px', background: '#F9FAFB', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Quantità</h4>
                  <div style={{ display: 'grid', gap: '5px' }}>
                    <div>
                      <strong>OD:</strong> {orderData.quantita.confezioni_OD} confezioni × {orderData.quantita.lenti_per_confezione} lenti = {orderData.quantita.confezioni_OD * orderData.quantita.lenti_per_confezione} lenti totali
                    </div>
                    <div>
                      <strong>OS:</strong> {orderData.quantita.confezioni_OS} confezioni × {orderData.quantita.lenti_per_confezione} lenti = {orderData.quantita.confezioni_OS * orderData.quantita.lenti_per_confezione} lenti totali
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '1.05rem' }}>
                      <strong>Totale:</strong> {orderData.quantita.confezioni_OD + orderData.quantita.confezioni_OS} confezioni
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div style={{ 
                  padding: '20px',
                  background: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'grid', gap: '10px', fontSize: '1.1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Prezzo per confezione:</span>
                      <span style={{ fontWeight: 600 }}>€{orderData.quantita.prezzo_confezione.toFixed(2)}</span>
                    </div>
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

                <div className="input-group" style={{ marginBottom: '20px' }}>
                  <label>Fornitore</label>
                  <input
                    type="text"
                    value={orderData.fornitore}
                    onChange={(e) => setOrderData(prev => ({ ...prev, fornitore: e.target.value }))}
                    placeholder="Johnson & Johnson, Alcon, CooperVision, etc."
                  />
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
                    L'ordine verrà salvato come <strong>IN SOSPESO</strong>. La gestione di pagamento e fatturazione avverrà nel modulo CASSA.
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

              {currentStep < 4 ? (
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
                  ✓ Conferma Ordine LAC
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdiniLACModule;
