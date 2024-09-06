import React, { useEffect, useState } from "react";
import { useSearchMovieQuery } from "../../hooks/useSearchMovie";
import { useSearchParams } from "react-router-dom";
import { Alert, Col, Container, Dropdown, Row, Spinner } from "react-bootstrap";
import MovieCard from "../../common/MovieCard/MovieCard";
import ReactPaginate from "react-paginate";
import "./MoviePage.style.css";
import { useMovieGenreQuery } from "../../hooks/useMovieGenre";

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
  const [sort, setSort] = useState("desc");
  const [selectedGenre, setSelectedGenre] = useState("");
  const { data: genre } = useMovieGenreQuery();
  const [totalCount, setTotalCount] = useState(0);
  const [filterCount, setFilterCount] = useState(0);

  console.log("data :", data);

  useEffect(() => {
    if (data) {
      setTotalCount(data.total_results);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  useEffect(() => {
    const sortedMovies = getSortedResults();
    const filteredMovies = filterMovieGenre(sortedMovies);
    setFilterCount(filteredMovies.length);
  }, [data, sort, selectedGenre]);

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleSortChange = (order) => {
    setSort(order);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
  };

  const getSortedResults = () => {
    if (data && data.results) {
      return [...data.results].sort((a, b) => {
        return sort === "desc"
          ? b.popularity - a.popularity
          : a.popularity - b.popularity;
      });
    }
    return [];
  };

  const filterMovieGenre = (movies) => {
    if (selectedGenre) {
      return movies.filter((movie) =>
        movie.genre_ids.includes(parseInt(selectedGenre))
      );
    }
    return movies;
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

  const sortedAndFilteredMovies = filterMovieGenre(getSortedResults());

  return (
    <Container>
      <Row>
        <Col lg={4} xs={12}>
          <div>
            <strong style={{ color: "goldenrod" }}>[정렬 기준]</strong>
            <Dropdown onSelect={handleSortChange}>
              <Dropdown.Toggle variant="danger" id="dropdown-basic">
                인기도 {sort === "desc" ? "높은순" : "낮은순"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="desc">인기도 높은순</Dropdown.Item>
                <Dropdown.Item eventKey="asc">인기도 낮은순</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <br />
            <strong style={{ color: "goldenrod", marginTop: "20px" }}>
              [장르 선택]
            </strong>
            <Dropdown onSelect={handleGenreChange}>
              <Dropdown.Toggle variant="danger" id="genre-dropdown">
                {selectedGenre
                  ? genre.find((genre) => genre.id === parseInt(selectedGenre))
                      ?.name
                  : "장르 선택"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="">모든 장르</Dropdown.Item>
                {genre.map((genre) => (
                  <Dropdown.Item key={genre.id} eventKey={genre.id}>
                    {genre.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <br />
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
          {filterCount === 0 && selectedGenre ? (
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
                  {selectedGenre ? filterCount : totalCount}
                </span>
                건의 검색 결과가 있습니다.
              </div>
            )
          )}
          <Row>
            {sortedAndFilteredMovies.map((movie, index) => (
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
