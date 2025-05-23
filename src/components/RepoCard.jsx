import React from "react";

function RepoCard({ item }) {
    const truncateDescription = (description, maxLength) => {
        if (!description) return "Nessuna descrizione";
        return description.length > maxLength
            ? description.substring(0, maxLength) + "..."
            : description;
    };

    return (
        <div className="card">
            <h3 className="repo-title">{item.name}</h3>
            <p>{truncateDescription(item.description, 100)}</p> {/* Limita a 100 caratteri */}
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

export default RepoCard;
