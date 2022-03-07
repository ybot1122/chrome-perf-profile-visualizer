import { useEffect, useState } from "react";
import AsyncEventsFilteredViewer from "./AsyncEventsFilteredViewer";
import styles from "../styles/AsyncEventsFilteredViewer.module.css";

const mouseDown = "InputLatency::MouseDown";
const mouseUp = "InputLatency::MouseUp";

const supportedEvents = {
  [mouseDown]: "MouseDown",
  [mouseUp]: "MouseUp",
};

const isMatchingAsyncEnd = (e1, e2) =>
  e1.name === e2.name &&
  e1.ph === "b" &&
  e2.ph === "e" &&
  e1.id === e2.id &&
  e1.scope === e2.scope &&
  !!e1.id2 === !!e2.id2 &&
  ((e1.id2 &&
    e2.id2 &&
    e2.id2 &&
    e1.id2.global === e2.id2.global &&
    e1.id2.local === e2.id2.local) ||
    (!e1.id2 && !e2.id2));

const AsyncEventViewer = ({ data, isVisible }) => {
  const [asyncEvents, setAsyncEvents] = useState({});
  const [timestampRange, setTimestampRange] = useState();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventCounts, setEventCounts] = useState({});

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
      const n = [];
      const eventNames = {};
      data.forEach((e) => {
        if (e.ts >= timestampRange.start && e.ts <= timestampRange.end) {
          if (e.ph === "b") {
            // find the end event
            const endEvent = filteredEvents.find((el) =>
              isMatchingAsyncEnd(e, el)
            );
            if (endEvent) {
              e.dur = endEvent.ts - e.ts;
              e.endEvent = endEvent;
            }
          }
          if (e.ph !== "e") {
            n.push(e);

            if (!eventNames[e.name]) {
              eventNames[e.name] = 0;
            }
            eventNames[e.name] += 1;
          }
        }
      });
      setFilteredEvents(n);
      setEventCounts(eventNames);
    }
  }, [timestampRange, setFilteredEvents, data, setEventCounts]);

  return (
    <>
      <div
        style={{
          display: isVisible ? "flex" : "none",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <div className={styles.topRowSelectors}>
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
        <div className={styles.topRowSelectors}>
          {Object.keys(eventCounts).map((el) => (
            <p>
              {el}: {eventCounts[el]}
            </p>
          ))}
        </div>
      </div>
      <div style={{ margin: "25px", border: "3px black solid" }}>
        {timestampRange && (
          <AsyncEventsFilteredViewer
            filteredEvents={filteredEvents}
            start={timestampRange.start}
            end={timestampRange.end}
          />
        )}
      </div>
    </>
  );
};

export default AsyncEventViewer;
