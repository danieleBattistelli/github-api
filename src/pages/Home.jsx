import { useState } from "react"; // Importa il hook useState per gestire lo stato del componente.

function Home() {
    // Stato per memorizzare il termine di ricerca inserito dall'utente.
    const [searchTerm, setSearchTerm] = useState("");
    // Stato per memorizzare i risultati della ricerca (elenco di repository).
    const [repositories, setRepositories] = useState([]);

    // Funzione per gestire la ricerca quando l'utente clicca sul pulsante "Cerca".
    const handleSearch = () => {
        if (!searchTerm) return; // Se il termine di ricerca è vuoto, non fare nulla.
        fetch(`https://api.github.com/search/repositories?q=${searchTerm}`) 
            .then((response) => response.json())
            .then((data) => setRepositories(data.items || []))
            .catch((error) => console.error("Errore durante la ricerca:", error)); 
    };

    return (
        <div>
            <h1>GitHub API</h1> {/* Titolo della pagina */}
            <div>
                {/* Input per inserire il termine di ricerca */}
                <input
                    type="text"
                    placeholder="Cerca repository..." // Testo segnaposto nell'input.
                    value={searchTerm} // Collega il valore dell'input allo stato searchTerm.
                    onChange={(e) => setSearchTerm(e.target.value)} // Aggiorna lo stato quando l'utente digita.
                />
                {/* Pulsante per avviare la ricerca */}
                <button onClick={handleSearch}>Cerca</button>
            </div>
            {/* Elenco dei risultati della ricerca */}
            <ul>
                {repositories.map((repo) => (
                    <li key={repo.id}>{repo.full_name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Home; // Esporta il componente Home per poterlo utilizzare in altre parti dell'app.