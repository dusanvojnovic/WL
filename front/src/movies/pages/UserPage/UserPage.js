import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { useHttpClient } from '../../../shared/hooks/http-hook';
import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';
import Modal from '../../../shared/components/UIElements/Modal';
import MoviesList from '../../components/MoviesList/MoviesList';
import classes from './UserPage.module.css';
import Button from '../../../shared/components/UIElements/Button';

const UserPage = () => {
  const [loadedMovies, setLoadedMovies] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;
  const history = useHistory();

  const goToSearchPageHandler = () => {
    history.push('/search');
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/movies/user/${userId}`
        );
        setLoadedMovies(responseData.movies);
      } catch (err) {}
    };
    fetchMovies();
  }, [sendRequest, userId]);

  const deleteMovieHandler = (deletedMovieId) => {
    setLoadedMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== deletedMovieId)
    );
  };

  return (
    <>
      {error && (
        <Modal show header="An Error Occured!" onClick={clearError}>
          {error}
        </Modal>
      )}
      {isLoading && <LoadingSpinner asOverlay />}
      <div className={classes.welcomeMessage}>
        <h2>Add Movie to your WatchList</h2>
        <Button onClick={goToSearchPageHandler}>ADD MOVIE</Button>
      </div>
      {!isLoading && loadedMovies && (
        <div className={classes.movies}>
          <MoviesList items={loadedMovies} onDeleteMovie={deleteMovieHandler} />
        </div>
      )}
    </>
  );
};

export default UserPage;
