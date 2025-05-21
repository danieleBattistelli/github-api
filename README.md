📚 nome repo: **github-api**

La funzionalità di ricerca di GitHub è ottima, ma da bravi dev non ci accontentiamo di quanto fatto da altri e vogliamo sempre metterci alla prova.
Abbiamo deciso quindi di sviluppare una nostra soluzione che ci permetta di effettuare ricerche sfruttando le API di GitHub.

Oltre al termine di ricerca vogliamo poter selezionare anche il tipo: solo repository oppure solo utenti/organizzazioni.

- **Milestones**
    
    **Milestone 1**
    Fare la ricerca solo per repository.
    La ricerca deve partire al click di un pulsante “Cerca”.
    Mostrare in pagina i nomi dei repository, anche con una grafica minima.
    
    **Milestone 2**
    Permettere di scegliere il tipo di ricerca: repository oppure utenti/organizzazioni.
    Dare un layout grafico curato alle card.
    L’aspetto della card dovrà variare in base al risultato mostrato: repository o user/organization.
    
    **Milestone 3**
    Integriamo una validazione minimale: la ricerca deve partire solo se l’utente ha digitato almeno 3 caratteri.
    Mostriamo un messaggio in caso non venga restituito nessun risultato (es. non esiste una repo con il nome che è stato cercato).
    Aggiungiamo un loader che sarà mostrato mentre siamo in attesa di ottenere i risultati.
    
    **Bonus 1**
    Implementiamo un **debounce**: appena l’utente smette di digitare nell’input, dopo 700ms parte la chiamata di ricerca all’API.
    
    ****Bonus 2**
    La chiamata API base restituisce solo 30 risultati. Integriamo una funzionalità base di paginazione: due pulsanti (avanti / indietro) che ci permettano di navigare tra le pagine.
    
    *Ricorda: l'obiettivo è imparare a gestire API asincrone e creare un'interfaccia utente reattiva. Non esitare a sperimentare e aggiungere features personali!*
    
    La documentazione delle API di GitHub è discretamente complessa, serve quindi ragionare bene su come e dove cercare le informazioni utili al progetto.
Possiamo quindi fare una panoramica delle sezioni principali, che troviamo sul lato sinistro della [documentazione](https://docs.github.com/en/rest?apiVersion=2022-11-28).

Ogni sezione presenta poi una o più sotto-sezioni dentro le quali sono presentati i vari endpoint.
Ovviamente è importante leggere bene la descrizione dell’endpoint, i parametri accettati e gli **esempi** di richiesta e di risposta presentati sul lato destro della pagina.

Una volta che ci siamo fatti un’idea di quale endpoint chiamare e come inviare il parametro di ricerca, facciamo una prima prova con Postman.
Ottenuta la conferma da Postman, passiamo alla **Milestone 1**.

Prima di passare alla **Milestone 2** dedichiamo del tempo a trovare le informazioni corrette in merito al corretto endpoint per eseguire la ricerca per utente/organizzazione.
Assicuriamoci quindi di aver compreso le differenze nella struttura della risposta fra i due endpoint che utilizzeremo.
La grafica avrà la priorità più bassa.

Nello sviluppare la **Milestone 3** teniamo conto del fatto che l’utente potrebbe anche inserire solo spazi vuoti nel campo di input, ma in questo caso la ricerca non deve partire.

Al momento di sviluppare il **Bonus 1** facciamo una ricerca per capire bene cosa sia il *debounce*, la sua utilità e soprattutto come integrarlo in modo semplice nella nostra applicazione.
Online sono presenti esempi anche molto avanzati, ma per noi è sufficiente adattare il principio che ci viene mostrato in modo che sia semplice inserirlo nel nostro codice.

Per sviluppare il **Bonus 2** teniamo conto del fatto che ci è richiesta una paginazione *base*. Sarà molto importante aver letto accuratamente la documentazione per capire quale parametro utilizzare per comunicare alle API la pagina che vogliamo recuperare.
Per questa paginazione sono richieste solo le funzionalità avanti / indietro, niente di più avanzato. Nei riferimenti è presente un link alla documentazione di GitHub per quanto riguarda la gestione della paginazione, ma si tratta di una versione molto più avanzata e raffinata, che va oltre l’obiettivo di questo esercizio.
### Note

**Chiamate API autenticate o no?**

Le API di GitHub permettono di effettuare richieste anche senza Bearer Token (*unauthenticated*), ma sono limitate a 60 richieste/ora (https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api?apiVersion=2022-11-28#primary-rate-limit-for-unauthenticated-users).
Se la richiesta contiene un Personal Access Token (*authenticated*), il limite sale a 5000 richieste/ora (https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api?apiVersion=2022-11-28#primary-rate-limit-for-authenticated-users).

**Quali scope scegliere per il Token**

Per il token da utilizzare in questo kata è sufficiente spuntare i seguenti scope:

- `public_repo`
- `read:user`

**Come costruire la richiesta con il bearer token**
const data = {
	params: {
	  q: searchInput.value
  },
  headers: {
	  "Authorization": `Bearer ${config.token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  }
};

Nell’oggetto data che contiene i parametri che saranno inviati tramite la richiesta GET definiamo anche la proprietà *headers* che conterrà gli header che saranno aggiunti alla richiesta.
Qui definiamo sia una proprietà `Authorization` che conterrà le informazioni relative al *Bearer Token*, sia una proprietà `X-GitHub-Api-Version` che definisce quale versione delle API andremo ad interrogare.

**Come gestire il token di GitHub**
Per evitare di esporre il token nel nostro repository, possiamo optare per una soluzione semplice: andiamo a creare un secondo file JS chiamato `config.js` in cui andremo a dichiarare un oggetto con scope globale chiamato `config` che conterrà i dati di configurazione (in questo caso il token) e che NON sarà versionato (aggiungeremo il file in .gitignore).
Includeremo quindi questo script nella pagina HTML *prima* del file JS contenente la logica delle chiamate API.
Questa non è una soluzione adatta ad un ambiente di produzione, ma sarà più che sufficiente per le necessità che abbiamo in questo kata.