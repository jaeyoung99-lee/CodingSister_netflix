import React from "react";
import { Badge } from "react-bootstrap";
import "./MovieCard.style.css";

const MovieCard = ({ movie }) => {
  return (
    <div
      style={{
        backgroundImage: `url(https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path})`,
      }}
      className="movie-card"
    >
      <div className="overlay">
        <h2>{movie.title}</h2>
        {movie.genre_ids.map((id) => (
          <Badge bg="danger" style={{ margin: "0 4px 4px 0" }}>
            {id}
          </Badge>
        ))}
        <div>=================</div>
        <div style={{ fontSize: "13px" }}>
          <div>평점 : {movie.vote_average} / 10</div>
          <div>인기도 : {movie.popularity}</div>
          <div>
            연령 :{" "}
            {movie.adult === true ? (
              <img
                src="https://i.namu.wiki/i/CLhQiPZyOB0c50kkVKBKrlpEL3SwrhgQGNe7NNVtiatq49QxoHx68cASxEfQAgtSuMo_-7pcNtetfr0RV68xgQ.svg"
                alt="over19"
                style={{ width: "20px", height: "20px" }}
              />
            ) : (
              <img
                src="https://i.namu.wiki/i/oue1NCn0ejKPZgHqsUYAer_tvO-7Jarrq_6uqUT4Gkm9H3P0ADs9F-4-TU4R_RXPHXc06RcD9FrWlAlcQYH7fQ.svg"
                alt="all"
                style={{ width: "20px", height: "20px" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
