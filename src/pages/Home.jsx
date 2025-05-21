import { useState } from "react";
import RepoCard from "../components/RepoCard";
import UserCard from "../components/UserCard";
import OrganizationCard from "../components/OrganizationCard";

function Home() {
    // Stato per memorizzare il termine di ricerca inserito dall'utente.
    const [searchTerm, setSearchTerm] = useState("");
    // Stato per memorizzare i risultati della ricerca.
    const [results, setResults] = useState([]);
    // Stato per memorizzare il tipo di ricerca selezionato (repository o utenti/organizzazioni).
    const [searchType, setSearchType] = useState("repositories");
    // Stato per il loader
    const [loading, setLoading] = useState(false);
    // Stato per il messaggio di errore
    const [errorMessage, setErrorMessage] = useState("");

    // Funzione per gestire la ricerca quando l'utente clicca sul pulsante "Cerca".
    const handleSearch = () => {
        if (searchTerm.trim().length < 3) {
            setErrorMessage("Il termine di ricerca deve contenere almeno 3 caratteri.");
            return;
        }

        setErrorMessage(""); // Resetta il messaggio di errore
        setLoading(true); // Mostra il loader

        const endpoint =
            searchType === "repositories"
                ? `https://api.github.com/search/repositories?q=${searchTerm}`
                : `https://api.github.com/search/users?q=${searchTerm}`;

        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                setResults(data.items || []);
                if (!data.items || data.items.length === 0) {
                    setErrorMessage("Nessun risultato trovato.");
                }
            })
            .catch((error) => {
                console.error("Errore durante la ricerca:", error);
                setErrorMessage("Si è verificato un errore durante la ricerca.");
            })
            .finally(() => setLoading(false)); // Nasconde il loader
    };

    return (
        <div>
            <h1>GitHub API</h1> {/* Titolo della pagina */}
            <div>
                {/* Input per inserire il termine di ricerca */}
                <input
                    type="text"
                    placeholder="Cerca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Selezione del tipo di ricerca */}
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="repositories">Repository</option>
                    <option value="users">Utenti/Organizzazioni</option>
                </select>
                {/* Pulsante per avviare la ricerca */}
                <button onClick={handleSearch}>Cerca</button>
            </div>
            {loading && <p>Caricamento in corso...</p>} {/* Loader */}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Messaggio di errore */}
            {/* Elenco dei risultati della ricerca */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {results.map((item) =>
                    searchType === "repositories" ? (
                        <RepoCard key={item.id} item={item} />
                    ) : item.type === "User" ? (
                        <UserCard key={item.id} item={item} />
                    ) : (
                        <OrganizationCard key={item.id} item={item} />
                    )
                )}
            </div>
        </div>
    );
}

export default Home; 