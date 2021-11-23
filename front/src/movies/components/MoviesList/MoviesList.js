import MovieCard from '../MovieCard/MovieCard';

const MoviesList = (props) => {
  return (
    <ul className="place-list">
      {props.items.map((movie) => (
        <MovieCard
          imageUrl={movie.imageUrl}
          id={movie.id}
          title={movie.title}
          description={movie.description}
          year={movie.year}
          key={movie.description}
          onClick={props.onClick}
          onDelete={props.onDeleteMovie}
        />
      ))}
    </ul>
  );
};

export default MoviesList;
