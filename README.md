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
    
