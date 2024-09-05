import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useMovieDetailQuery } from "../../hooks/useMovieDetail";
import { useMovieReviewQuery } from "../../hooks/useMovieReview";
import { useState } from "react";

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
  const { data, isLoading, isError, error } = useMovieDetailQuery(id);
  const {
    data: review,
    isLoading: reviewLoading,
    isError: reviewError,
  } = useMovieReviewQuery(id);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (isLoading || reviewLoading) {
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

  if (isError || reviewError) {
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
            {formatCurrencyKRW(data.budget)}
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
    </Container>
  );
};

export default MovieDetailPage;
