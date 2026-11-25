import { useParams } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();
  return <h1>Movie Details: {id}</h1>;
}
export default MovieDetails;