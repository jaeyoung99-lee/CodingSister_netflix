import "./App.css";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Homepage from "./pages/Homepage/Homepage";
import MoviePage from "./pages/Movies/MoviePage";
import MovieDetailPage from "./pages/MovieDetail/MovieDetailPage";
import NotFoundPage from "./pages/NotFoundpage/NotFoundPage";
import "bootstrap/dist/css/bootstrap.min.css";

// 홈페이지 -> /
// 영화 전체 보여주는 페이지(서치 기능 포함) -> /movies
// 영화 디테일 페이지 -> /movies/:id

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* 부모의 path와 같을 경우 index 써도 됨 */}
        <Route index element={<Homepage />} />
        {/* path의 일부분이 같을 경우 Route로 한 번 더 감싸줘도 됨 */}
        {/* <Route path="/movies" element={<MoviePage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} /> */}
        <Route path="movies">
          <Route index element={<MoviePage />} />
          <Route path=":id" element={<MovieDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
