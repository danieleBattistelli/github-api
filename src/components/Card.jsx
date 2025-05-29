import React from "react";

function Card({ item }) {
    // Determina il tipo di card
    const isRepo = !!item.stargazers_count;
    const isOrg = item.type === "Organization";
    const isUserOrOrg = item.type === "User" || item.type === "Organization";

    if (isRepo) {
        // Card Repository
        const truncateDescription = (description, maxLength) => {
            if (!description) return "Nessuna descrizione";
            return description.length > maxLength
                ? description.substring(0, maxLength) + "..."
                : description;
        };
        return (
            <div className="card">
                <h3 className="repo-title">{item.name}</h3>
                <p>{truncateDescription(item.description, 100)}</p>
                <p>
                    <strong>Stelle:</strong> {item.stargazers_count}
                </p>
                <p>
                    <strong>Fork:</strong> {item.forks_count}
                </p>
                <p>
                    <strong>Ultimo aggiornamento:</strong> {new Date(item.updated_at).toLocaleDateString()}
                </p>
                <a href={item.html_url} target="_blank" rel="noopener noreferrer">
                    Vai al repository
                </a>
            </div>
        );
    }

    // Card unica per User/Organization
    if (isUserOrOrg) {
        return (
            <div className={`card ${isOrg ? "organization" : "user"}`}>
                <img src={item.avatar_url} alt={item.login} />
                <h3>{item.login}</h3>
                <p>Tipo: {isOrg ? "Organizzazione" : "Utente"}</p>
                <a href={item.html_url} target="_blank" rel="noopener noreferrer">
                    Vai al profilo
                </a>
            </div>
        );
    }

    // Fallback se il tipo non è riconosciuto
    return null;
}

export default Card;
