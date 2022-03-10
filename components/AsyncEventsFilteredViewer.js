import { useState } from "react";
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

  const startDiff = el.ts - start;

  return (
    <>
      <div
        key={ind}
        className={styles.itemContainer}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.itemLabel}>
          {el.name} {durationString} (+{startDiff}µs)
        </span>
        <span
          className={classNames(styles.item, {
            [styles.x]: el.ph === "X",
            [styles.i]: el.ph === "i" || el.ph === "I" || el.ph === "n",
            [styles.b]: el.ph === "b",
          })}
          style={{
            left: `${(startDiff / range) * 100}%`,
            width,
          }}
        ></span>
      </div>
      {isOpen && <JSONPretty data={el} style={{ fontSize: "1.5em" }} />}
    </>
  );
};

const AsyncEventsFilteredViewer = ({
  filteredEvents,
  start,
  end,
  startEventName,
}) => {
  const range = end - start;

  const topEvent = filteredEvents.find((el) => {
    console.log(el.ts - start, el.name, startEventName);
    return el.ts - start === 0 && el.name === startEventName;
  });

  if (!topEvent) return null;

  return (
    <>
      <div id="featured-event" className={styles.featuredEvent}>
        <Row el={topEvent} ind={-1} start={start} range={range} />
      </div>
      <div className={styles.container}>
        {filteredEvents.map((el, ind) =>
          el.ts - start !== 0 && el.name !== startEventName ? (
            <div key={ind}>
              <Row el={el} ind={ind} start={start} range={range} />
            </div>
          ) : null
        )}
      </div>
    </>
  );
};

export default AsyncEventsFilteredViewer;
