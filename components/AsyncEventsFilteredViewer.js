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
};

const Row = ({ el, start, range, ind }) => {
  const [isOpen, setIsOpen] = useState(false);
  let width = "50px";

  if (el.ph === "X") {
    width = `${(el.dur / range) * 100}%`;
  } else if (el.ph === "b") {
    width = el.dur ? `${(el.dur / range) * 100}%` : "100%";
  }

  return (
    <>
      <div
        key={ind}
        className={styles.itemContainer}
        onClick={() => setIsOpen(!isOpen)}
      >
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
      {isOpen && <JSONPretty data={el} style={{ fontSize: "1.5em" }} />}
    </>
  );
};

const isMatchingAsyncEnd = (e1, e2) =>
  e1.ph === "b" &&
  e2.ph === "e" &&
  e1.id === e2.id &&
  e1.scope === e2.scope &&
  e1.id2 &&
  e2.id2 &&
  e1.id2.global === e2.id2.global &&
  e1.id2.local === e2.id2.local;

const AsyncEventsFilteredViewer = ({ filteredEvents, start, end }) => {
  const [deAsyncedEvents, setDeAsyncedEvents] = useState([]);

  useEffect(() => {
    const n = [];
    filteredEvents.forEach((e) => {
      if (e.ph === "b") {
        // find the end event
        const endEvent = filteredEvents.find((el) => isMatchingAsyncEnd(e, el));
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
      {deAsyncedEvents.map((el, ind) => (
        <Row el={el} ind={ind} start={start} range={range} />
      ))}
    </div>
  );
};

export default AsyncEventsFilteredViewer;
