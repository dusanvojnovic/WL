import { useContext, useState } from 'react';
import { AuthContext } from '../../../shared/context/auth-context';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import Button from '../../../shared/components/UIElements/Button';
import Modal from '../../../shared/components/UIElements/Modal';

import classes from './MovieCard.module.css';

const MovieCard = (props) => {
  const authCtx = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [showModal, setShowModal] = useState();

  const deleteMovieHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/movies/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: `Bearer ${authCtx.token}`,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <div className={classes.card}>
      {showModal && (
        <Modal
          show
          header="Confirm Delete"
          onClick={() => setShowModal(false)}
          onButtonClick={deleteMovieHandler}
          buttonText="YES"
        >
          Are you sure you want to delete this movie?
        </Modal>
      )}
      <div
        className={classes.front}
        style={{ backgroundImage: `url(${props.imageUrl})` }}
      ></div>
      <div className={classes.back}>
        <div className={classes.movieInfo}>
          <div className={classes.title}>
            {props.title}
            <span className={classes.date}>({props.year})</span>
          </div>
          <p>{props.description}</p>
          <Button onClick={() => setShowModal(true)}>DELETE</Button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
