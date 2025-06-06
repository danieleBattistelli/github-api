import { useState, useEffect, useRef } from "react";
import Card from "../components/Card";

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
    // Stato per il token di autenticazione
    const [authToken, setAuthToken] = useState("");
    // Stato per memorizzare il nome dell'utente autenticato
    const [authenticatedUser, setAuthenticatedUser] = useState("");
    // Stato per il filtro del linguaggio
    const [language, setLanguage] = useState(""); // Stato per il filtro del linguaggio
    // Stato per l'ordinamento
    const [sortOrder, setSortOrder] = useState(""); // Stato per l'ordinamento
    const [sortDirection, setSortDirection] = useState("desc"); // Stato per la direzione dell'ordinamento

    const observerRef = useRef(null); // Ref per l'osservatore dell'intersezione

    // Funzione per gestire la ricerca quando l'utente clicca sul pulsante "Cerca".
    const handleSearch = async () => {
        if (searchTerm.trim().length < 3) {
            setErrorMessage("Il termine di ricerca deve contenere almeno 3 caratteri.");
            return;
        }

        setErrorMessage(""); // Resetta il messaggio di errore
        setLoading(true); // Mostra il loader

        const cacheKey = `${searchType}-${searchTerm}-${page}-${language}-${sortOrder}-${sortDirection}`;
        if (cache[cacheKey]) {
            // Usa i risultati dalla cache
            setResults(cache[cacheKey]);
            setLoading(false);
            return;
        }

        const languageFilter = language ? `+language:${language}` : ""; // Aggiungi il filtro linguaggio
        const endpoint =
            searchType === "repositories"
                ? `https://api.github.com/search/repositories?q=${searchTerm}${languageFilter}&page=${page}&sort=${sortOrder}&order=${sortDirection}`
                : `https://api.github.com/search/users?q=${searchTerm}&page=${page}`;

        const headers = authToken
            ? { Authorization: `Bearer ${authToken}` } // Usa il token di autenticazione
            : {}; // Aggiungi il token di autenticazione se presente

        try {
            const response = await fetch(endpoint, { headers });
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }
            const data = await response.json();
            const items = data.items || [];

            if (searchType === "users") {
                // Recupera i follower per ogni utente/organizzazione
                const itemsWithFollowers = await Promise.all(
                    items.map(async (item) => {
                        try {
                            const url = item.type === "Organization"
                                ? `https://api.github.com/orgs/${item.login}`
                                : `https://api.github.com/users/${item.login}`;
                            const res = await fetch(url, { headers });
                            if (!res.ok) return { ...item, followers: "?" };
                            const details = await res.json();
                            return { ...item, followers: details.followers };
                        } catch {
                            return { ...item, followers: "?" };
                        }
                    })
                );
                setResults(itemsWithFollowers);
                setCache((prevCache) => ({ ...prevCache, [cacheKey]: itemsWithFollowers }));
            } else {
                setResults(items);
                setCache((prevCache) => ({ ...prevCache, [cacheKey]: items }));
            }

            if (items.length === 0) {
                setErrorMessage("Nessun risultato trovato.");
            }
        } catch (error) {
            console.error("Errore durante la ricerca:", error);
            setErrorMessage("Si è verificato un errore durante la ricerca.");
        } finally {
            setLoading(false); // Nasconde il loader
        }
    };

    // Funzione per caricare più risultati
    const loadMoreResults = () => {
        setPage((prevPage) => prevPage + 1);
    };

    // Effetto per osservare il fondo della pagina
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && results.length > 0) {
                    loadMoreResults();
                }
            },
            { threshold: 1.0 }
        );

        const target = document.querySelector("#load-more-trigger");
        if (target) observer.observe(target);

        observerRef.current = observer;

        return () => observer.disconnect();
    }, [loading, results]);

    // Effetto per gestire il debounce della ricerca
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm.trim().length >= 3) {
                handleSearch();
            }
        }, 1500);

        return () => clearTimeout(handler); // Pulisce il timeout precedente
    }, [searchTerm, searchType, page, language]); // Aggiungi `page` e `language` alle dipendenze

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

    // Funzione per verificare se il token è valido
    const validateToken = () => {
        if (!authToken) {
            setErrorMessage("Inserisci un token per effettuare la verifica.");
            setAuthenticatedUser(""); // Resetta il nome utente
            return;
        }

        const headers = { Authorization: `Bearer ${authToken}` };

        fetch("https://api.github.com/user", { headers })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Token non valido: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Token valido. Utente autenticato:", data);
                setAuthenticatedUser(data.login); // Salva il nome utente
                setErrorMessage(""); // Resetta eventuali messaggi di errore
            })
            .catch((error) => {
                console.error("Errore durante la verifica del token:", error);
                setErrorMessage("Token non valido. Inserisci un token corretto.");
                setAuthenticatedUser(""); // Resetta il nome utente
            });
    };

    // Effetto per verificare il token quando cambia
    useEffect(() => {
        if (authToken) {
            validateToken();
        }
    }, [authToken]);

    const sortedResults = [...results].sort((a, b) => {
        if (searchType === "users") {
            if (sortOrder === "username") {
                return sortDirection === "asc"
                    ? a.login.localeCompare(b.login)
                    : b.login.localeCompare(a.login);
            }
            if (sortOrder === "followers") {
                // follower può essere "?" se non disponibile, quindi fallback a 0
                const af = typeof a.followers === "number" ? a.followers : 0;
                const bf = typeof b.followers === "number" ? b.followers : 0;
                return sortDirection === "asc"
                    ? af - bf
                    : bf - af;
            }
        }
        if (searchType === "repositories") {
            if (sortOrder === "stars") {
                return sortDirection === "asc"
                    ? a.stargazers_count - b.stargazers_count
                    : b.stargazers_count - a.stargazers_count;
            }
            if (sortOrder === "forks") {
                return sortDirection === "asc"
                    ? a.forks_count - b.forks_count
                    : b.forks_count - a.forks_count;
            }
            if (sortOrder === "updated") {
                return sortDirection === "asc"
                    ? new Date(a.updated_at) - new Date(b.updated_at)
                    : new Date(b.updated_at) - new Date(a.updated_at);
            }
        }
        return 0; // Nessun ordinamento per altri casi
    });

    // Funzione per recuperare i follower delle organizzazioni

    return (
        <div>
            <h1>GitHub API</h1> {/* Titolo della pagina */}
            {/* Sezione per inserire il token di autenticazione */}
            <div>
                <input
                    type="password"
                    placeholder="Inserisci il token GitHub"
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                />
                {authenticatedUser && <p>Utente autenticato: {authenticatedUser}</p>} {/* Nome utente */}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Messaggio di errore */}
            </div>
            {/* Sezione per mostrare le ricerche già effettuate */}
            <div>
                <h2>Ricerche Recenti</h2>
                <ul>
                    {Object.keys(cache).map((key) => (
                        <li key={key}>
                            {key}{" "}
                            <button
                                onClick={() => {
                                    const [type, term, page, lang] = key.split("-");
                                    setSearchType(type);
                                    setSearchTerm(term);
                                    setPage(Number(page));
                                    setLanguage(lang || ""); // Imposta il linguaggio se presente
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
                {/* Selezione del linguaggio */}
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={searchType === "users"} // Disabilita la select se il tipo di ricerca è "users"
                >
                    <option value="">Tutti i linguaggi</option>
                    <option value="React">React</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C#">C#</option>
                    <option value="PHP">PHP</option>
                </select>
                {/* Pulsante per avviare la ricerca */}
                <button onClick={handleSearch}>Cerca</button>
            </div>
            <div>
                {/* Selezione dell'ordinamento */}
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="">Nessun ordinamento</option>
                    {searchType === "repositories" && (
                        <>
                            <option value="stars">Stelle</option>
                            <option value="forks">Fork</option>
                            <option value="updated">Ultimo aggiornamento</option>
                        </>
                    )}
                    {searchType === "users" && (
                        <>
                            <option value="username">Nome utente</option>
                            <option value="followers">Follower</option>
                        </>
                    )}
                </select>
                {/* Selezione della direzione dell'ordinamento */}
                <select
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value)}
                >
                    <option value="desc">Decrescente</option>
                    <option value="asc">Crescente</option>
                </select>
            </div>
            {loading && <p>Caricamento in corso...</p>} {/* Loader */}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Messaggio di errore */}
            {/* Elenco dei risultati della ricerca */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {sortedResults.map((item) => (
                    <Card key={item.id} item={item} />
                ))}
            </div>
            {/* Trigger per il caricamento infinito */}
            <div id="load-more-trigger" style={{ height: "1px" }}></div>
        </div>
    );
}

export default Home;