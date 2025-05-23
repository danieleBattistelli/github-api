import React, { useState } from "react";
import RepoCard from "./RepoCard";

function RepoList({ repos }) {
    const [sortOrder, setSortOrder] = useState("asc");

    const sortedRepos = [...repos].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.stargazers_count - b.stargazers_count;
        } else {
            return b.stargazers_count - a.stargazers_count;
        }
    });

    return (
        <div>
            <button onClick={() => setSortOrder("asc")}>Ordina Crescente</button>
            <button onClick={() => setSortOrder("desc")}>Ordina Decrescente</button>
            <div className="repo-list">
                {sortedRepos.map((repo) => (
                    <RepoCard key={repo.id} item={repo} sortOrder={sortOrder} />
                ))}
            </div>
        </div>
    );
}

export default RepoList;
