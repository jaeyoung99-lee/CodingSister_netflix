import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useMovieDetailQuery } from "../../hooks/useMovieDetail";
import { useMovieReviewQuery } from "../../hooks/useMovieReview";
import { useState } from "react";
import { useMovieRecommendationQuery } from "../../hooks/useMovieRecommendation";
import MovieCard from "../../common/MovieCard/MovieCard";
import { useMovieTrailerQuery } from "../../hooks/useMovieTrailer";
import YouTube from "react-youtube";
import "./MovieDetailPage.style.css";

const formatCurrencyKRW = (amount) => {
  // 숫자를 만 단위로 변환
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(2)}억 원`;
  } else if (amount >= 10000) {
    return `${(amount / 10000).toFixed(2)}만 원`;
  } else {
    return `${amount.toLocaleString()} 원`;
  }
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading, isError, error } = useMovieDetailQuery(id);
  const {
    data: review,
    isLoading: reviewLoading,
    isError: reviewError,
  } = useMovieReviewQuery(id);
  const {
    data: rec,
    isLoading: recLoading,
    isError: recError,
  } = useMovieRecommendationQuery(id);
  const {
    data: trailer,
    isLoading: trailerLoading,
    isError: trailerError,
  } = useMovieTrailerQuery(id);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (isLoading || reviewLoading || recLoading || trailerLoading) {
    return (
      <div className="spinner-area">
        <Spinner
          animation="border"
          variant="danger"
          style={{
            width: "5rem",
            height: "5rem",
          }}
        />
      </div>
    );
  }

  if (isError || reviewError || recError || trailerError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  if (!data) {
    return <Alert variant="warning">영화 정보를 불러올 수 없습니다.</Alert>;
  }

  const genres = data.genres || [];
  const reviews = review.results || [];
  const budget = data.budget || 0;

  console.log("movie :", data);
  console.log("review :", review);
  console.log("rec :", rec);
  console.log("trailer :", trailer);

  return (
    <Container>
      <Row>
        <Col md={6}>
          <img
            src={`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${data.poster_path}`}
            alt={data.title}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Col>
        <Col md={6}>
          <h1>{data.title}</h1>
          <br />
          <p>
            {data.adult === true ? (
              <img
                src="https://i.namu.wiki/i/CLhQiPZyOB0c50kkVKBKrlpEL3SwrhgQGNe7NNVtiatq49QxoHx68cASxEfQAgtSuMo_-7pcNtetfr0RV68xgQ.svg"
                alt="over19"
                style={{ width: "24px", height: "24px" }}
              />
            ) : (
              <img
                src="https://i.namu.wiki/i/oue1NCn0ejKPZgHqsUYAer_tvO-7Jarrq_6uqUT4Gkm9H3P0ADs9F-4-TU4R_RXPHXc06RcD9FrWlAlcQYH7fQ.svg"
                alt="all"
                style={{ width: "24px", height: "24px" }}
              />
            )}
          </p>
          <p>
            <strong style={{ color: "goldenrod" }}>[예고편]</strong>
            <br />
            <Button variant="danger" onClick={openModal}>
              예고편 보기
            </Button>
          </p>
          <p>
            <strong style={{ color: "goldenrod" }}>[개봉일]</strong>
            <br /> {data.release_date}
          </p>
          <p>
            <strong style={{ color: "goldenrod" }}>[상영 시간]</strong>
            <br /> {data.runtime}분
          </p>
          <p>
            <strong style={{ color: "goldenrod" }}>[줄거리]</strong>
            <br /> {data.overview}
          </p>
          <hr style={{ border: "1px solid #ddd", margin: "1rem 0" }} />
          <p>
            <strong style={{ color: "goldenrod" }}>[평점]</strong>
            <br />
            {data.vote_average} / 10 (총 {data.vote_count}명)
          </p>
          <p>
            <strong style={{ color: "goldenrod" }}>[인기도]</strong>
            <br />
            {data.popularity}
          </p>
          <p>
            <strong style={{ color: "goldenrod" }}>[장르]</strong> <br />
            {genres.length > 0 ? (
              genres.map((genre, index) => (
                <Badge
                  bg="danger"
                  style={{ margin: "0 4px 4px 0" }}
                  key={index}
                >
                  {genre.name}
                </Badge>
              ))
            ) : (
              <span>장르 정보가 없습니다.</span>
            )}
          </p>
          <p>
            <strong style={{ color: "goldenrod" }}>[예산]</strong>
            <br />
            {formatCurrencyKRW(budget)}
          </p>
          <p>
            <strong style={{ color: "goldenrod" }}>[제작 국가]</strong>
            <br />
            {data.origin_country[0]}
          </p>
          <p>
            <strong style={{ color: "goldenrod" }}>[리뷰]</strong>
            {reviews.length > 0 ? (
              <div>
                {!showAllReviews ? (
                  <div>
                    <Button
                      variant="link"
                      onClick={() => setShowAllReviews(true)}
                      style={{
                        padding: "0",
                        display: "block",
                        marginTop: "1rem",
                        color: "chocolate",
                      }}
                    >
                      더보기
                    </Button>
                  </div>
                ) : (
                  <div>
                    {reviews.map((rev, index) => (
                      <div key={index} style={{ marginBottom: "1rem" }}>
                        <strong style={{ color: "yellow" }}>
                          {rev.author}
                        </strong>
                        <p>{rev.content}</p>
                        {index < reviews.length && (
                          <hr
                            style={{
                              border: "1px solid #ddd",
                              margin: "1rem 0",
                            }}
                          />
                        )}
                      </div>
                    ))}
                    <Button
                      variant="link"
                      onClick={() => setShowAllReviews(false)}
                      style={{
                        padding: "0",
                        display: "block",
                        marginTop: "1rem",
                        color: "chocolate",
                      }}
                    >
                      접기
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <span>리뷰가 없습니다.</span>
            )}
          </p>
        </Col>
      </Row>
      <hr style={{ margin: "2rem 0" }} />
      <strong style={{ color: "goldenrod" }}>[추천 영화]</strong>
      <br />
      <br />
      <Row>
        {rec?.length > 0 ? (
          rec.map((movie) => (
            <Col
              key={movie.id}
              md={3}
              sm={6}
              xs={12}
              style={{ marginBottom: "20px" }}
            >
              <MovieCard movie={movie} /> {/* MovieCard 컴포넌트 사용 */}
            </Col>
          ))
        ) : (
          <p>추천할 영화가 없습니다.</p>
        )}
      </Row>

      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        size="lg"
        className="custom-modal"
      >
        <Modal.Header style={{ placeContent: "center" }}>
          <Modal.Title>
            <span style={{ color: "red" }}>"{data.title}"</span> 예고편
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <YouTube
            videoId={
              trailer.find(
                (video) => video.name.toLowerCase() === "official trailer"
              )?.key || trailer[0]?.key
            }
            opts={{
              height: "390",
              width: "100%",
              playerVars: {
                autoplay: 1,
              },
            }}
          />
        </Modal.Body>
        <Modal.Footer style={{ placeContent: "center" }}>
          <Button variant="danger" onClick={closeModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MovieDetailPage;
