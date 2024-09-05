import React from "react";
import { Badge } from "react-bootstrap";
import "./MovieCard.style.css";
import { useMovieGenreQuery } from "../../hooks/useMovieGenre";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const { data: genreData } = useMovieGenreQuery(); // 콜론(:)은 재정의를 의미
  console.log("genreData :", genreData);
  const navigate = useNavigate();

  // 장르의 id와 매핑하여 장르의 name을 보여주는 함수
  const showGenre = (genreIdList) => {
    if (!genreData) return [];
    const genreNameList = genreIdList.map((id) => {
      const genreObject = genreData.find((genre) => genre.id === id);
      return genreObject.name;
    });
    return genreNameList;
  };

  const showMovieDetailPage = (id) => {
    navigate(`/movies/${id}`);
  };

  return (
    <div
      style={{
        backgroundImage: `url(https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path})`,
      }}
      className="movie-card"
      onClick={() => showMovieDetailPage(movie.id)}
    >
      <div className="overlay">
        <h2>{movie.title}</h2>
        {showGenre(movie.genre_ids).map((genreName) => (
          <Badge bg="danger" style={{ margin: "0 4px 4px 0" }}>
            {genreName}
          </Badge>
        ))}
        <div style={{ fontSize: "10px" }}> ===========================</div>
        <div style={{ fontSize: "10px" }}>
          <div>
            평점 : {movie.vote_average} / 10 (총 {movie.vote_count}명)
          </div>
          <div>인기도 : {movie.popularity}</div>
          <div>
            연령 :{" "}
            {movie.adult === true ? (
              <img
                src="https://i.namu.wiki/i/CLhQiPZyOB0c50kkVKBKrlpEL3SwrhgQGNe7NNVtiatq49QxoHx68cASxEfQAgtSuMo_-7pcNtetfr0RV68xgQ.svg"
                alt="over19"
                style={{ width: "15px", height: "15px" }}
              />
            ) : (
              <img
                src="https://i.namu.wiki/i/oue1NCn0ejKPZgHqsUYAer_tvO-7Jarrq_6uqUT4Gkm9H3P0ADs9F-4-TU4R_RXPHXc06RcD9FrWlAlcQYH7fQ.svg"
                alt="all"
                style={{ width: "15px", height: "15px" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
