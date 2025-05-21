function RepoCard({ item }) {
    return (
        <div className="card">
            <h3 className="repo-title">{item.name}</h3>
            <p>{item.description || "Nessuna descrizione"}</p>
            <a href={item.html_url} target="_blank" rel="noopener noreferrer">
                Vai al repository
            </a>
        </div>
    );
}

export default RepoCard;
