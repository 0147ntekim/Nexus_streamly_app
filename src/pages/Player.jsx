import { useParams } from "react-router-dom";

function Player() {
  const { id } = useParams();
  return <h1>Now Playing Movie: {id}</h1>;
}
export default Player;