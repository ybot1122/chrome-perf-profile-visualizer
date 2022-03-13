import { useEffect, useState } from "react";
import styles from "../styles/Visualizer.module.css";
import JSONPretty from "react-json-pretty";
import classNames from "classnames";

const EventRow = ({ ind, event, minTs }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const timeDiff = minTs ? `(+${event.ts - minTs})` : null;

  const row = (
    <div
      className={classNames(styles.datarow, {
        [styles.highlighted]: isHighlighted,
      })}
      key={ind}
    >
      <div className={styles.datarowtimestamp}>
        {event.ts} {timeDiff}
      </div>
      <div className={styles.datarowsm}>{event.pid}</div>
      <div className={styles.datarowsm}>{event.tid}</div>
      <div
        className={classNames(styles.datarowdata, styles.datarowclickable)}
        onClick={() => setIsHighlighted(!isHighlighted)}
      >
        {event.cat} <span>(click to highlight this row)</span>
      </div>
      <div
        className={classNames(styles.datarowdata, styles.datarowclickable)}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {event.name} <span>(click to view JSON)</span>
      </div>
    </div>
  );

  const expanded = isExpanded ? (
    <div className={styles.datajson}>
      <JSONPretty data={event} style={{ fontSize: "1.5em" }} />
      <p className={styles.link}>
        <a
          href="https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview#"
          target="_blank"
          rel="noreferrer"
        >
          See Docs for Trace Event Format
        </a>
      </p>
    </div>
  ) : null;
  return (
    <>
      {row}
      {expanded}
    </>
  );
};

export default EventRow;
