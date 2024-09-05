import React, { useEffect, useState } from "react";
import { useSearchMovieQuery } from "../../hooks/useSearchMovie";
import { useSearchParams } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import MovieCard from "../../common/MovieCard/MovieCard";
import ReactPaginate from "react-paginate";
import "./MoviePage.style.css";

// 경로 2가지
// 1. nav바에서 클릭해서 온 경우 => popular movie 보여주기
// 2. keyword를 입력해서 온 경우 => keyword와 관련된 영화들을 보여줌

// 페이지네이션 하는 방법
// 1. 페이지네이션 설치
// 2. page state 만들기
// 3. 페이지네이션 클릭할 때마다 page 바꿔주기
// 4. page 값이 바뀔 때마다 useSearchMovie에 page까지 넣어서 fetch

const MoviePage = () => {
  const [query, setQuery] = useSearchParams();
  const [page, setPage] = useState(1);
  const keyword = query.get("q");
  const { data, isLoading, isError, error } = useSearchMovieQuery({
    keyword,
    page,
  });
  console.log("data :", data);

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  if (isLoading) {
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
  if (isError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  const isEmptyResults = data?.results?.length === 0;
  console.log("검색 결과 :", isEmptyResults);

  return (
    <Container>
      <Row>
        <Col lg={4} xs={12}>
          필터
        </Col>
        <Col lg={8} xs={12}>
          {keyword && (
            <div>
              "
              <span style={{ color: "yellow", fontSize: "20px" }}>
                {keyword}
              </span>
              "(으)로 검색한 결과입니다.
            </div>
          )}
          {isEmptyResults ? (
            <div
              style={{
                color: "red",
                textAlign: "center",
                marginTop: "50px",
                fontSize: "25px",
              }}
            >
              검색 결과가 없습니다.
            </div>
          ) : (
            keyword && (
              <div style={{ margin: "10px 0" }}>
                총{" "}
                <span style={{ color: "red", fontSize: "18px" }}>
                  {data?.total_results}
                </span>
                건의 검색 결과가 있습니다.
              </div>
            )
          )}
          <Row>
            {data?.results.map((movie, index) => (
              <Col
                key={index}
                lg={4}
                xs={12}
                style={{
                  marginBottom: "10px",
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
          <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={data?.total_pages} // 전체 페이지
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
            forcePage={page - 1} // 처음 보여줄 페이지(0부터 시작)
          />
        </Col>
      </Row>
    </Container>
  );
};

export default MoviePage;
