import { Link, useHistory } from 'react-router-dom';
import { useContext } from 'react';

import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';
import Modal from '../../../shared/components/UIElements/Modal';
import { AuthContext } from '../../../shared/context/auth-context';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import classes from './MovieItem.module.css';

const MovieItem = (props) => {
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();

  const sendData = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        'http://localhost:5000/api/movies',
        'POST',
        JSON.stringify({
          title: props.movieTitle,
          year: props.year,
          description: props.description,
          movieId: props.movieId,
          imageUrl: props.imageUrl,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authCtx.token}`,
        }
      );
      history.push(`/${authCtx.userId}/movies`);
    } catch (err) {}
  };

  return (
    <>
      {error && (
        <Modal show header="An Error Occured" onClick={clearError}>
          {error}
        </Modal>
      )}
      {isLoading && <LoadingSpinner asOverlay />}
      <Link to="/user" onClick={sendData} className={classes.movieLink}>
        <h2>
          {props.movieTitle} - {props.year}
        </h2>
      </Link>
    </>
  );
};

export default MovieItem;
