import { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "../styles/AsyncEventsFilteredViewer.module.css";
import JSONPretty from "react-json-pretty";

const traceEvents = {
  b: "Async Begin",
  e: "Async End",
  i: "Instant",
  I: "Instant",
  X: "Complete", // has a dur property
  P: "Sample Event (deprecated)",
};

const Row = ({ el, start, range, ind }) => {
  const [isOpen, setIsOpen] = useState(false);
  let width = "50px";

  if (el.ph === "X") {
    width = `${(el.dur / range) * 100}%`;
  } else if (el.ph === "b") {
    width = el.dur ? `${(el.dur / range) * 100}%` : "100%";
  }

  const durationString = el.dur
    ? `(duration: ${el.dur}µs)`
    : "(instantaneous event)";

  return (
    <>
      <div
        key={ind}
        className={styles.itemContainer}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.itemLabel}>
          {el.name} {durationString}
        </span>
        <span
          className={classNames(styles.item, {
            [styles.x]: el.ph === "X",
            [styles.i]: el.ph === "i" || el.ph === "I" || el.ph === "n",
            [styles.b]: el.ph === "b",
          })}
          style={{
            left: `${((el.ts - start) / range) * 100}%`,
            width,
          }}
        ></span>
      </div>
      {isOpen && <JSONPretty data={el} style={{ fontSize: "1.5em" }} />}
    </>
  );
};

const AsyncEventsFilteredViewer = ({ filteredEvents, start, end }) => {
  const range = end - start;

  return (
    <div className={styles.container}>
      {filteredEvents.map((el, ind) => (
        <span key={ind}>
          <Row el={el} ind={ind} start={start} range={range} />
        </span>
      ))}
    </div>
  );
};

export default AsyncEventsFilteredViewer;
