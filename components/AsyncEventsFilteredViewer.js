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
      {filteredEvents.map((el, ind) => {
        return (
          <div
            className={classNames(styles.item, {
              [styles.x]: el.ph === "X",
              [styles.i]: el.ph === "i" || el.ph === "I",
            })}
            style={{
              marginLeft: `${((el.ts - start) / range) * 100}%`,
              width: el.ph === "X" ? `${(el.dur / range) * 100}%` : "inherit",
            }}
          >
            {el.name} - {el.ph}
          </div>
        );
      })}
    </div>
  );
};

export default AsyncEventsFilteredViewer;
