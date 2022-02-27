import { useEffect, useState } from "react";
import styles from "../styles/Visualizer.module.css";
import JSONPretty from "react-json-pretty";

const EventRow = ({ ind, event, minTs }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const timeDiff = minTs ? `(+${event.ts - minTs})` : null;

  const row = (
    <div
      className={styles.datarow}
      key={ind}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={styles.datarowtimestamp}>
        {event.ts} {timeDiff}
      </div>
      <div className={styles.datarowdata}>{event.cat}</div>
      <div className={styles.datarowdata}>{event.name}</div>
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
