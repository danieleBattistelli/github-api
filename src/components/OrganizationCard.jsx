function OrganizationCard({ item }) {
    return (
        <div className="card organization">
            <img src={item.avatar_url} alt={item.login} />
            <h3>{item.login}</h3>
            <p>Tipo: Organizzazione</p>

            <a href={item.html_url} target="_blank" rel="noopener noreferrer">
                Vai al profilo
            </a>
        </div>
    );
}

export default OrganizationCard;
