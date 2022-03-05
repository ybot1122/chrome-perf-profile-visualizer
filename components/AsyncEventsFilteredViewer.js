import { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "../styles/AsyncEventsFilteredViewer.module.css";

const traceEvents = {
  b: "Async Begin",
  e: "Async End",
  i: "Instant",
  I: "Instant",
  X: "Complete", // has a dur property
};

const AsyncEventsFilteredViewer = ({ filteredEvents, start, end }) => {
  const [deAsyncedEvents, setDeAsyncedEvents] = useState([]);

  useEffect(() => {
    const n = [];
    filteredEvents.forEach((e) => {
      if (e.ph === "b") {
        // find the end event
        const endEvent = filteredEvents.find(
          (el) => el.ph === "e" && el.id === e.id && el.scope === e.scope
        );
        if (endEvent) {
          e.dur = endEvent.ts - e.ts;
          e.endEvent = endEvent;
        }
      }
      if (e.ph !== "e") {
        n.push(e);
      }
    });
    setDeAsyncedEvents(n);
  }, [filteredEvents, setDeAsyncedEvents]);
  const range = end - start;

  return (
    <div className={styles.container}>
      {deAsyncedEvents.map((el, ind) => {
        let width = "50px";

        if (el.ph === "X") {
          width = `${(el.dur / range) * 100}%`;
        } else if (el.ph === "b") {
          width = el.dur ? `${(el.dur / range) * 100}%` : "100%";
        }

        return (
          <div key={ind} className={styles.itemContainer}>
            <span className={styles.itemLabel}>
              {el.name} - {el.ph}
            </span>
            <span
              className={classNames(styles.item, {
                [styles.x]: el.ph === "X",
                [styles.i]: el.ph === "i" || el.ph === "I",
                [styles.b]: el.ph === "b",
              })}
              style={{
                left: `${((el.ts - start) / range) * 100}%`,
                width,
              }}
            ></span>
          </div>
        );
      })}
    </div>
  );
};

export default AsyncEventsFilteredViewer;
