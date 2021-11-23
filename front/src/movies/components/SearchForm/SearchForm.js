import { useState, useCallback, useEffect } from 'react';
import useForm from '../../../shared/hooks/form-hook';
import Input from '../../../shared/components/Form/Input';
import Button from '../../../shared/components/UIElements/Button';
import Modal from '../../../shared/components/UIElements/Modal';
import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';
import MovieItem from '../MovieItem/MovieItem';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import classes from './SearchForm.module.css';

const MOVIE_DB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
const MOVIE_DB_API_KEY = '3dee8a140ebfcf57cbbd5b3e745e6ad0';
// const MOVIE_DB_INFO_URL = 'https://api.themoviedb.org/3/movie';
const MOVIE_DB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const SearchForm = () => {
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: true,
      },
    },
    true
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [findedMovies, setFindedMovies] = useState([]);

  const formSubmitionHandler = useCallback(
    async (event) => {
      try {
        const responseData = await sendRequest(
          `${MOVIE_DB_SEARCH_URL}?api_key=${MOVIE_DB_API_KEY}&query=${formState.inputs.title.value}`
        );

        console.log(responseData.results);

        const searchResults = [];

        responseData.results.forEach((el) => {
          searchResults.push({
            movieTitle: el['title'],
            year: el.release_date.split('-')[0],
            imageUrl: `${MOVIE_DB_IMAGE_URL}${el.poster_path}`,
            description: el['overview'],
            id: el.id,
          });
        });
        setFindedMovies(searchResults);
        if (searchResults.length === 0) {
        }
      } catch (err) {}
    },
    [formState.inputs.title.value, sendRequest]
  );

  const movies = findedMovies.map((movie) => (
    <MovieItem
      key={movie.id}
      movieId={movie.id}
      movieTitle={movie.movieTitle}
      year={movie.year}
      description={movie.description}
      imageUrl={movie.imageUrl}
    />
  ));

  useEffect(() => {
    const listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        formSubmitionHandler();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [formSubmitionHandler]);

  return (
    <>
      {error && (
        <Modal show header="An Error Occured!" onClick={clearError}>
          {error}
        </Modal>
      )}
      <form onSubmit={formSubmitionHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <div className={classes.form}>
          <Input
            className={classes.searchInput}
            id="title"
            type="text"
            placeholder="Search"
            onInput={inputHandler}
            validators={[]}
          />
          <Button onClick={formSubmitionHandler}> Search </Button>
        </div>
        <div className={classes.results}>{movies}</div>
      </form>
    </>
  );
};

export default SearchForm;
