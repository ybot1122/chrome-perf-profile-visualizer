import { useEffect, useState } from "react";
import styles from "../styles/Visualizer.module.css";
import JSONPretty from "react-json-pretty";

const EventRow = ({ ind, event }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const row = (
    <div
      className={styles.datarow}
      key={ind}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div>{event.ts}</div>
      <div>{event.cat}</div>
      <div>{event.name}</div>
    </div>
  );

  const expanded = isExpanded ? (
    <div className={styles.datajson}>
      <JSONPretty data={event} style={{ fontSize: "1.5em" }} />
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
