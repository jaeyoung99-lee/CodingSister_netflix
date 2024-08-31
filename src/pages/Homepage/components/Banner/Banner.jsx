import React from "react";
import { usePopularMoviesQuery } from "../../../../hooks/usePopularMovies";

const Banner = () => {
  const { data } = usePopularMoviesQuery();
  console.log("data :", data);
  return <div>Banner</div>;
};

export default Banner;
