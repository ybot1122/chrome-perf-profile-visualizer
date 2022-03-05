import { useEffect, useState } from "react";
import AsyncEventsFilteredViewer from "./AsyncEventsFilteredViewer";
import styles from "../styles/AsyncEventsFilteredViewer.module.css";

const mouseDown = "InputLatency::MouseDown";
const mouseUp = "InputLatency::MouseUp";

const supportedEvents = {
  [mouseDown]: "MouseDown",
  [mouseUp]: "MouseUp",
};

const AsyncEventViewer = ({ data, isVisible }) => {
  const [asyncEvents, setAsyncEvents] = useState({});
  const [timestampRange, setTimestampRange] = useState();
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const asyncEvents = {};
    // Find pairs of async events
    data.forEach((e) => {
      if (
        e.cat === "benchmark,latencyInfo,rail" &&
        Object.keys(supportedEvents).includes(e.name)
      ) {
        if (e.ph === "b") {
          // start of async
          asyncEvents[e.id] = {
            begin: e,
          };
        } else if (e.ph === "e") {
          // end of async
          asyncEvents[e.id].end = e;
        }
      }
    });

    setAsyncEvents(asyncEvents);
  }, [data, setAsyncEvents]);

  useEffect(() => {
    // get events within timestamp
    if (timestampRange) {
      setFilteredEvents(
        data.filter(
          (e) =>
            e.ts >= timestampRange.start &&
            (e.ts <= timestampRange.end || e.ph === "e")
        )
      );
    }
  }, [timestampRange, setFilteredEvents, data]);

  return (
    <div
      style={{
        display: isVisible ? "block" : "none",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      <div style={{ width: "500px", marginLeft: "25px" }}>
        <p>
          Select a user interaction to view all the events that were started
          within that user interaction:
        </p>
        {Object.keys(asyncEvents).map((el, ind) => {
          const e = asyncEvents[el].begin;
          const start = e.ts;
          const end = asyncEvents[el].end?.ts ?? Number.MAX_SAFE_INTEGER;
          return (
            <button
              className={styles.topWindowItem}
              key={ind}
              onClick={() => setTimestampRange({ start, end })}
            >
              {supportedEvents[e.name]} at {e.ts}
            </button>
          );
        })}
      </div>
      <div style={{ margin: "50px" }}>
        {timestampRange && (
          <AsyncEventsFilteredViewer
            filteredEvents={filteredEvents}
            start={timestampRange.start}
            end={timestampRange.end}
          />
        )}
      </div>
    </div>
  );
};

export default AsyncEventViewer;
