function UserCard({ item }) {
    return (
        <div className="card user">
            <img src={item.avatar_url} alt={item.login} />
            <h3>{item.login}</h3>
            <p>Tipo: Utente</p>
            <a href={item.html_url} target="_blank" rel="noopener noreferrer">
                Vai al profilo
            </a>
        </div>
    );
}

export default UserCard;
