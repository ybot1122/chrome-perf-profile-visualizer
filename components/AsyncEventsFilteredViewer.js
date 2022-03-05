import classNames from "classnames";
import styles from "../styles/AsyncEventsFilteredViewer.module.css";

const traceEvents = {
  i: "Instant",
  I: "Instant",
  X: "Complete", // has a dur property
};

const AsyncEventsFilteredViewer = ({ filteredEvents, start, end }) => {
  const range = end - start;

  return (
    <div className={styles.container}>
      {filteredEvents.map((el, ind) => (
        <p
          className={classNames(styles.item, {
            [styles.x]: el.ph === "X",
            [styles.i]: el.ph === "i" || el.ph === "I",
          })}
          style={{
            // top: 50 * ind
            marginLeft: (el.ts - start) / range,
          }}
        >
          {el.name} - {traceEvents[el.ph]}
        </p>
      ))}
    </div>
  );
};

export default AsyncEventsFilteredViewer;
