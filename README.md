# 🔬 Gestionale Ottica EAR

Sistema gestionale completo per negozi di ottica - Gestione visite, prescrizioni, ordini occhiali e lenti a contatto.

## 📦 Moduli Implementati

### ✅ MODULO 1: Visite & Prescrizioni
- Gestione completa visite optometriche
- Prescrizioni occhiali (monofocali, progressive, bifocali)
- Prescrizioni LAC (morbide, rigide, multifocali)
- Storico prescrizioni per cliente
- Visualizzazione grafica assi
- Template rapidi per casi comuni

### ✅ MODULO 2: Ordini Occhiali
- Workflow guidato a 6 step
- Gestione montature (marca, modello, UPC)
- Configurazione lenti complete (tipo, materiale, indice)
- Trattamenti (antiriflesso, idrorepellente, ecc.)
- Garanzie opzionali
- Parametri centratura
- Generazione PDF work order

### ✅ MODULO 3: Ordini LAC
- Workflow semplificato a 4 step
- Gestione prodotti LAC
- Quantità e prezzi
- Generazione PDF work order
- Preparato per ordine automatico online

## 🚀 Quick Start

### Installazione

```bash
# Clone repository
git clone https://github.com/raydalessandro/gestionale-ottica-ear.git
cd gestionale-ottica-ear

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build per produzione

```bash
npm run build
```

## 📱 Deploy su Vercel

1. Push su GitHub
2. Importa repository su Vercel
3. Deploy automatico!

Oppure usa Vercel CLI:
```bash
npm i -g vercel
vercel
```

## 💾 Storage

**Attualmente usa localStorage del browser:**
- ✅ Funziona offline
- ✅ Nessun backend richiesto
- ✅ Dati privati locali
- ⚠️ Non sincronizzato tra dispositivi
- ⚠️ Dati persi se cancelli cache browser

**Prossimi sviluppi:** Integrazione database cloud per sincronizzazione multi-device.

## 🛠️ Stack Tecnologico

- **React 18** - UI Framework
- **Vite** - Build tool & dev server
- **Recharts** - Grafici e visualizzazioni
- **localStorage** - Storage dati locale

## 📄 Struttura Progetto

```
gestionale-ottica-ear/
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # App principale con routing
│   ├── index.css             # Stili globali
│   └── modules/
│       ├── VisitePrescrizioniModule.jsx
│       ├── OrdiniOcchialiModule.jsx
│       └── OrdiniLACModule.jsx
├── package.json
├── vite.config.js
└── index.html
```

## 🎯 Roadmap

- [ ] Modulo Cassa (pagamenti, fatture)
- [ ] Modulo Magazzino (stock montature)
- [ ] Modulo Analytics (dashboard statistiche)
- [ ] Launcher unificato
- [ ] Database cloud (Supabase/Firebase)
- [ ] Ordine automatico LAC + pagamento online
- [ ] App mobile

## 👨‍💻 Autore

**Ray D'Alessandro**  
EAR LAB - Digital Solutions

## 📝 Licenza

Copyright © 2025 EAR LAB - Tutti i diritti riservati
