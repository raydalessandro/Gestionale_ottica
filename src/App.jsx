import { useState } from 'react'
import VisitePrescrizioniModule from './modules/VisitePrescrizioniModule'
import OrdiniOcchialiModule from './modules/OrdiniOcchialiModule'
import OrdiniLACModule from './modules/OrdiniLACModule'

function App() {
  const [activeModule, setActiveModule] = useState('home')

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
      {/* HOME / LAUNCHER */}
      {activeModule === 'home' && (
        <div style={{ 
          fontFamily: 'Inter, sans-serif',
          padding: '40px 20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '60px 40px',
            borderRadius: '20px',
            marginBottom: '40px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h1 style={{ 
              margin: '0 0 15px 0', 
              fontSize: '3.5rem', 
              fontWeight: 800,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
              🔬 Gestionale Ottica EAR
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: '1.3rem', 
              opacity: 0.95,
              fontWeight: 500
            }}>
              Sistema completo per la gestione professionale del tuo negozio di ottica
            </p>
          </div>

          {/* Modules Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '25px',
            marginBottom: '40px'
          }}>
            {/* Modulo 1 */}
            <div
              onClick={() => setActiveModule('visite')}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '35px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '3px solid transparent',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 99, 235, 0.2)';
                e.currentTarget.style.borderColor = '#2563EB';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👓</div>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '1.6rem', 
                color: '#1F2937',
                fontWeight: 700
              }}>
                Visite & Prescrizioni
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#6B7280', 
                lineHeight: '1.6',
                fontSize: '1.05rem'
              }}>
                Gestione completa di visite optometriche, prescrizioni occhiali e LAC, storico pazienti
              </p>
            </div>

            {/* Modulo 2 */}
            <div
              onClick={() => setActiveModule('ordini-occhiali')}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '35px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '3px solid transparent',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 99, 235, 0.2)';
                e.currentTarget.style.borderColor = '#2563EB';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🕶️</div>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '1.6rem', 
                color: '#1F2937',
                fontWeight: 700
              }}>
                Ordini Occhiali
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#6B7280', 
                lineHeight: '1.6',
                fontSize: '1.05rem'
              }}>
                Workflow completo ordini: montature, lenti, trattamenti, centratura, work order PDF
              </p>
            </div>

            {/* Modulo 3 */}
            <div
              onClick={() => setActiveModule('ordini-lac')}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '35px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '3px solid transparent',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(6, 182, 212, 0.2)';
                e.currentTarget.style.borderColor = '#06B6D4';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👁️</div>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '1.6rem', 
                color: '#1F2937',
                fontWeight: 700
              }}>
                Ordini LAC
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#6B7280', 
                lineHeight: '1.6',
                fontSize: '1.05rem'
              }}>
                Gestione ordini lenti a contatto, quantità, prezzi, work order PDF
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderLeft: '6px solid #F59E0B'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ fontSize: '3rem' }}>💾</div>
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#1F2937', fontSize: '1.3rem' }}>
                  Storage Locale
                </h4>
                <p style={{ margin: 0, color: '#6B7280', lineHeight: '1.6' }}>
                  I dati sono salvati nel <strong>localStorage del browser</strong>. 
                  Funziona offline ma i dati sono locali al dispositivo. 
                  Per sincronizzazione multi-device, verrà integrato un database cloud nei prossimi aggiornamenti.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '60px',
            paddingTop: '30px',
            borderTop: '2px solid #E5E7EB'
          }}>
            <p style={{ 
              margin: 0, 
              color: '#9CA3AF',
              fontSize: '1rem'
            }}>
              <strong>EAR LAB</strong> Digital Solutions © 2025
            </p>
            <p style={{ 
              margin: '8px 0 0 0', 
              color: '#9CA3AF',
              fontSize: '0.9rem'
            }}>
              Sistema gestionale professionale per ottiche
            </p>
          </div>
        </div>
      )}

      {/* MODULI */}
      {activeModule === 'visite' && <VisitePrescrizioniModule onBack={() => setActiveModule('home')} />}
      {activeModule === 'ordini-occhiali' && <OrdiniOcchialiModule onBack={() => setActiveModule('home')} />}
      {activeModule === 'ordini-lac' && <OrdiniLACModule onBack={() => setActiveModule('home')} />}
    </div>
  )
}

export default App
