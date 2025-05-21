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

    // Funzione per gestire la ricerca quando l'utente clicca sul pulsante "Cerca".
    const handleSearch = () => {
        if (!searchTerm) return; // Se il termine di ricerca è vuoto, non fare nulla.

        const endpoint =
            searchType === "repositories"
                ? `https://api.github.com/search/repositories?q=${searchTerm}`
                : `https://api.github.com/search/users?q=${searchTerm}`;

        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => setResults(data.items || []))
            .catch((error) => console.error("Errore durante la ricerca:", error));
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

export default Home; // Esporta il componente Home per poterlo utilizzare in altre parti dell'app.