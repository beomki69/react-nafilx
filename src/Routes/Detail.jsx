import React, { memo, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import { movieApi, tvApi } from "../api";
import DetailTab from "../Components/DetailTab";
import Message from "../Components/Message";
import DetailContext from "../Contexts/DetailTabContext";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: calc(100vh - 3.5rem);
  padding: 2rem;
  background: linear-gradient(rgba(50, 50, 50, 0.5), rgba(50, 50, 50, 0.5)),
    url("https://image.tmdb.org/t/p/original/${(props) => props.bg}") no-repeat
      center;
  background-size: cover;

  @media screen and (max-width: 1024px) {
    justify-content: center;
    align-items: flex-start;
  }
`;

const Container = styled.main`
  display: flex;
`;

const Poster = styled.img`
  margin-right: 2rem;
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const InfoContainer = styled.div``;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: 3rem;
`;

const Anchor = styled.a`
  &:hover {
    text-decoration: underline;
  }
`;

const Sup = styled.sup`
  margin-right: 0.625rem;
  font-size: 0.625rem;
  vertical-align: super;
  &:last-child {
    margin-right: 0;
  }
`;

const ItemContainer = styled.div`
  margin-bottom: 1rem;
`;

const Item = styled.span`
  font-size: 0.825rem;
`;

const Divider = styled.span`
  margin: 0 0.5rem;
`;

const Overview = styled.p`
  margin-bottom: 2rem;
  max-width: 50rem;
  line-height: 1.4;
  opacity: 0.8;
  font-size: 1rem;
`;

const Detail = memo((props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const getData = useCallback(async () => {
    const {
      match: {
        params: { id },
        path,
      },
    } = props;

    let result = null;
    try {
      if (path.split("/")[1] === "movies") {
        ({ data: result } = await movieApi.detail(id));
      } else {
        ({ data: result } = await tvApi.detail(id));
      }
      setData(result);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [props]);

  useEffect(() => {
    getData();
  }, [getData]);

  const {
    backdrop_path,
    poster_path,
    original_title,
    original_name,
    overview,
    runtime,
    episode_run_time,
    genres,
    spoken_languages,
    production_companies,
    production_countries,
    homepage,
    vote_average,
    vote_count,
    release_date,
    first_air_date,
    imdb_id,
  } = data;

  return loading ? (
    <>
      <Helmet title="Loading | Naflix" />
      <Message message="📡 Loading" />
    </>
  ) : (
    <Wrapper bg={backdrop_path}>
      <Helmet
        title={`${original_title ? original_title : original_name} | Naflix`}
      />
      <Container>
        <Poster
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt="poster"
        />
        <InfoContainer>
          <Title>
            {original_title ? original_title : original_name}{" "}
            {homepage && (
              <Sup>
                <Anchor href={homepage}>Homepage↗️</Anchor>
              </Sup>
            )}
            {imdb_id && (
              <Sup>
                <Anchor href={`https://www.imdb.com/title/${imdb_id}`}>
                  IMDB↗️
                </Anchor>
              </Sup>
            )}
          </Title>
          <ItemContainer>
            <Item>{release_date ? release_date : first_air_date}</Item>
            <Divider>&middot;</Divider>
            <Item>{runtime ? runtime : episode_run_time[0]} min</Item>
            <Divider>&middot;</Divider>
            <Item>
              ⭐️ {vote_average}/10 ({vote_count})
            </Item>
            <Divider>&middot;</Divider>
            {genres &&
              genres.map((genre, index) => (
                <Item key={genre.id}>
                  {index === genres.length - 1
                    ? genre.name
                    : `${genre.name} / `}
                </Item>
              ))}
            <Divider>&middot;</Divider>
            {spoken_languages &&
              spoken_languages.map((lang, index) => (
                <Item key={lang.iso_639_1}>
                  {index === spoken_languages.length - 1
                    ? lang.name
                    : `${lang.name} / `}
                </Item>
              ))}
          </ItemContainer>
          <Overview>{overview}</Overview>
          <DetailContext
            value={{
              companies: production_companies,
              countries: production_countries,
              trailers: data.videos.results,
            }}
          >
            <DetailTab />
          </DetailContext>
        </InfoContainer>
      </Container>
    </Wrapper>
  );
});

export default Detail;
