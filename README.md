# 🔎 GitHub API Search App

Benvenuto in **GitHub API Search App**!  
Questa applicazione React ti permette di esplorare il mondo di GitHub in modo semplice, veloce e personalizzato, sfruttando le [API ufficiali di GitHub](https://docs.github.com/en/rest).

---

## 🚀 Funzionalità principali

- **Ricerca avanzata** di repository, utenti e organizzazioni GitHub
- **Filtri** per linguaggio di programmazione e tipo di risultato
- **Ordinamento** per stelle, fork, aggiornamento, nome utente e follower
- **Visualizzazione dettagliata** tramite card dinamiche e responsive
- **Loader** e messaggi di errore user-friendly
- **Paginazione automatica** e caricamento infinito dei risultati
- **Debounce** sulla ricerca per evitare chiamate inutili
- **Cache locale** delle ricerche recenti
- **Autenticazione tramite token** per aumentare il limite di richieste API

---

## ✨ Demo

![Demo GIF](demo.gif) <!-- Sostituisci con una gif/screenshot se disponibile -->

---

## 🛠️ Come funziona

1. **Inserisci un termine di ricerca** (minimo 3 caratteri)
2. **Scegli il tipo di ricerca**: repository o utenti/organizzazioni
3. **Applica filtri** come linguaggio o ordinamento
4. **Visualizza i risultati** in tempo reale, con dettagli e link diretti a GitHub
5. **Naviga tra le pagine** o lascia che il caricamento infinito ti mostri altri risultati
6. **Aumenta il limite di richieste** inserendo il tuo [Personal Access Token GitHub](https://github.com/settings/tokens)

---

## 📦 Installazione

```bash
git clone https://github.com/tuo-utente/github-api.git
cd github-api
npm install
npm start
```

---

## 🔐 Token GitHub

Per evitare limiti stringenti sulle richieste, puoi inserire un token personale (scope consigliati: `public_repo`, `read:user`).  
Il token **non viene salvato** e serve solo per autenticare le chiamate API.

---

## 📚 Milestones & Features