import React, { memo, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import { movieApi, tvApi } from "../api";
import Message from "../Components/Message";
import Section from "../Components/Section";

const Container = styled.main``;

const SET_RESULTS = "setResults";
const SET_LOADING = "setLoading";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_RESULTS:
      return {
        ...state,
        movieTopRated: action.movieTopRated,
        movieNowPlaying: action.movieNowPlaying,
        movieUpcoming: action.movieUpcoming,
        moviePopular: action.moviePopular,
        tvTopRated: action.tvTopRated,
        tvAiringToday: action.tvAiringToday,
        tvOnTheAir: action.tvOnTheAir,
        tvPopular: action.tvPopular,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return;
  }
};

const initState = {
  loading: true,
  movieTopRated: [],
  movieNowPlaying: [],
  movieUpcoming: [],
  moviePopular: [],
  tvTopRated: [],
  tvAiringToday: [],
  tvOnTheAir: [],
  tvPopular: [],
};

const Home = memo(() => {
  const [state, dispatch] = useReducer(reducer, initState);

  const getData = async () => {
    try {
      const {
        data: { results: movieTopRated },
      } = await movieApi.topRated();
      const {
        data: { results: movieNowPlaying },
      } = await movieApi.nowPlaying();
      const {
        data: { results: movieUpcoming },
      } = await movieApi.upcoming();
      const {
        data: { results: moviePopular },
      } = await movieApi.popular();

      const {
        data: { results: tvTopRated },
      } = await tvApi.topRated();
      const {
        data: { results: tvAiringToday },
      } = await tvApi.airingToday();
      const {
        data: { results: tvOnTheAir },
      } = await tvApi.onTheAir();
      const {
        data: { results: tvPopular },
      } = await tvApi.popular();

      dispatch({
        type: SET_RESULTS,
        movieTopRated,
        movieNowPlaying,
        movieUpcoming,
        moviePopular,
        tvTopRated,
        tvAiringToday,
        tvOnTheAir,
        tvPopular,
      });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: SET_LOADING, loading: false });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Helmet title="Home | Naflix" />
      {state.loading ? (
        <Message message="📡 Loading" />
      ) : (
        <Container>
          {state.movieTopRated && state.movieTopRated.length > 0 && (
            <Section
              title="Movie: Top Rated"
              data={state.movieTopRated}
              type="movies"
            />
          )}
          {state.movieNowPlaying && state.movieNowPlaying.length > 0 && (
            <Section
              title="Movie: Now Playing"
              data={state.movieNowPlaying}
              type="movies"
            />
          )}
          {state.movieUpcoming && state.movieUpcoming.length > 0 && (
            <Section
              title="Movie: Upcoming"
              data={state.movieUpcoming}
              type="movies"
            />
          )}
          {state.moviePopular && state.moviePopular.length > 0 && (
            <Section
              title="Movie: Popular"
              data={state.moviePopular}
              type="movies"
            />
          )}
          {state.tvTopRated && state.tvTopRated.length > 0 && (
            <Section
              title="TV: Top Rated"
              data={state.tvTopRated}
              type="shows"
            />
          )}
          {state.tvAiringToday && state.tvAiringToday.length > 0 && (
            <Section
              title="TV: Airing To Day"
              data={state.tvAiringToday}
              type="shows"
            />
          )}
          {state.tvOnTheAir && state.tvOnTheAir.length > 0 && (
            <Section
              title="TV: On The Air"
              data={state.tvOnTheAir}
              type="shows"
            />
          )}
          {state.tvPopular && state.tvPopular.length > 0 && (
            <Section title="TV: Popular" data={state.tvPopular} type="shows" />
          )}
        </Container>
      )}
    </>
  );
});

export default Home;
