import { getImageUrl } from "../../utils/images.js";
import styles from "./CastList.module.css";

const MAX_CAST = 12;

function CastList({ cast = [] }) {
  const topCast = cast.slice(0, MAX_CAST);

  if (topCast.length === 0) {
    return <p className={styles.empty}>Cast information isn't available.</p>;
  }

  return (
    <ul className={styles.list}>
      {topCast.map((person) => {
        const photoUrl = getImageUrl(person.profile_path, "w185");
        return (
          <li key={person.credit_id} className={styles.person}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={person.name}
                loading="lazy"
                className={styles.photo}
              />
            ) : (
              <div className={styles.initial} aria-hidden="true">
                {person.name.charAt(0)}
              </div>
            )}
            <p className={styles.name}>{person.name}</p>
            <p className={styles.character}>{person.character}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default CastList;
