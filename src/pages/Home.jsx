import { useState, useEffect } from "react";
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
    // Stato per la pagina corrente
    const [page, setPage] = useState(1);
    // Stato per memorizzare la cache
    const [cache, setCache] = useState({});

    // Funzione per gestire la ricerca quando l'utente clicca sul pulsante "Cerca".
    const handleSearch = () => {
        if (searchTerm.trim().length < 3) {
            setErrorMessage("Il termine di ricerca deve contenere almeno 3 caratteri.");
            return;
        }

        setErrorMessage(""); // Resetta il messaggio di errore
        setLoading(true); // Mostra il loader

        const cacheKey = `${searchType}-${searchTerm}-${page}`;
        if (cache[cacheKey]) {
            // Usa i risultati dalla cache
            setResults(cache[cacheKey]);
            setLoading(false);
            return;
        }

        const endpoint =
            searchType === "repositories"
                ? `https://api.github.com/search/repositories?q=${searchTerm}&page=${page}`
                : `https://api.github.com/search/users?q=${searchTerm}&page=${page}`;

        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                const items = data.items || [];
                setResults(items.slice(0, 8)); // Mostra solo i primi 8 risultati
                setCache((prevCache) => ({ ...prevCache, [cacheKey]: items.slice(0, 8) })); // Salva nella cache
                if (items.length === 0) {
                    setErrorMessage("Nessun risultato trovato.");
                }
            })
            .catch((error) => {
                console.error("Errore durante la ricerca:", error);
                setErrorMessage("Si è verificato un errore durante la ricerca.");
            })
            .finally(() => setLoading(false)); // Nasconde il loader
    };

    // Effetto per gestire il debounce della ricerca
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm.trim().length >= 3) {
                handleSearch();
            }
        }, 700);

        return () => clearTimeout(handler); // Pulisce il timeout precedente
    }, [searchTerm, searchType, page]); // Aggiungi `page` alle dipendenze

    // Effetto per caricare le ricerche recenti dal localStorage all'avvio
    useEffect(() => {
        try {
            const savedCache = JSON.parse(localStorage.getItem("searchCache"));
            if (savedCache && Object.keys(savedCache).length > 0) {
                console.log("Cache caricata dal localStorage:", savedCache); // Debug
                setCache(savedCache);
            }
        } catch (error) {
            console.error("Errore durante il caricamento della cache dal localStorage:", error);
        }
    }, []);

    // Effetto per salvare le ricerche recenti nel localStorage quando la cache cambia
    useEffect(() => {
        try {
            if (Object.keys(cache).length > 0) {
                localStorage.setItem("searchCache", JSON.stringify(cache));
                console.log("Cache salvata nel localStorage:", cache); // Debug
            }
        } catch (error) {
            console.error("Errore durante il salvataggio della cache nel localStorage:", error);
        }
    }, [cache]);

    return (
        <div>
            <h1>GitHub API</h1> {/* Titolo della pagina */}
            {/* Sezione per mostrare le ricerche già effettuate */}
            <div>
                <h2>Ricerche Recenti</h2>
                <ul>
                    {Object.keys(cache).map((key) => (
                        <li key={key}>
                            {key}{" "}
                            <button
                                onClick={() => {
                                    const [type, term, page] = key.split("-");
                                    setSearchType(type);
                                    setSearchTerm(term);
                                    setPage(Number(page));
                                    setResults(cache[key]);
                                }}
                            >
                                Visualizza
                            </button>
                            <button
                                onClick={() =>
                                    setCache((prevCache) => {
                                        const newCache = { ...prevCache };
                                        delete newCache[key];
                                        return newCache;
                                    })
                                }
                            >
                                Elimina
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
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
            {/* Pulsanti di paginazione */}
            <div>
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Indietro
                </button>
                <span>Pagina {page}</span>
                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={results.length < 8} // Disabilita se ci sono meno di 8 risultati
                >
                    Avanti
                </button>
            </div>
        </div>
    );
}

export default Home;