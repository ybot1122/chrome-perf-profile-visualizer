import { useEffect, useState } from "react";
import AsyncEventsFilteredViewer from "./AsyncEventsFilteredViewer";
import styles from "../styles/AsyncEventsFilteredViewer.module.css";
import CheckboxFilterSelector from "./CheckboxFilterSelector";
import useSelection from "./useSelection";
import classNames from "classnames";

const mouseDown = "InputLatency::MouseDown";
const mouseUp = "InputLatency::MouseUp";
const gestureScrollBegin = "InputLatency::GestureScrollBegin";
const gestureScrollEnd = "InputLatency::GestureScrollEnd";
const gestureScrollUpdate = "InputLatency::GestureScrollUpdate";
const mouseWheel = "InputLatency::MouseWheel";

const supportedEvents = {
  [mouseDown]: "MouseDown",
  [mouseUp]: "MouseUp",
  [gestureScrollBegin]: "GestureScrollBegin",
  [gestureScrollEnd]: "GestureScrollEnd",
  [gestureScrollUpdate]: "GestureScrollUpdate",
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
  const [selectedButtonInd, setSelectedButtonInd] = useState(-1);
  const [
    selectedEventNames,
    toggleSelectedEventName,
    setSelectedEventNames,
    isEventNameSelected,
  ] = useSelection();

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

          const eWithinTime = getEventsWithinTime(
            data,
            asyncEvents[e.id].begin.ts,
            asyncEvents[e.id].end.ts
          );
          asyncEvents[e.id].hasUrlEvent = Object.keys(eWithinTime).find((dd) =>
            dd.includes("ResourceSendRequest")
          );
        }
      }
    });

    setAsyncEvents(asyncEvents);
  }, [data, setAsyncEvents]);

  const getEventsWithinTime = (inputdata, start, end) => {
    const eventNames = {};
    inputdata.forEach((e) => {
      if (e.ts >= start && e.ts <= end) {
        if (e.ph !== "e") {
          if (!eventNames[e.name]) {
            eventNames[e.name] = 0;
          }
          eventNames[e.name] += 1;
        }
      }
    });
    return eventNames;
  };

  useEffect(() => {
    if (timestampRange) {
      const eventNames = getEventsWithinTime(
        data,
        timestampRange.start,
        timestampRange.end
      );
      setEventCounts(eventNames);
      setSelectedEventNames(Object.keys(eventNames));
    }
  }, [data, timestampRange, setSelectedEventNames]);

  useEffect(() => {
    // get events within timestamp
    if (timestampRange) {
      const n = [];
      data.forEach((e) => {
        if (e.ts >= timestampRange.start && e.ts <= timestampRange.end) {
          if (e.ph === "b") {
            // find the end event
            const endEvent = data.find((el) => isMatchingAsyncEnd(e, el));
            if (endEvent) {
              e.dur = endEvent.ts - e.ts;
              e.endEvent = endEvent;
            }
          }
          if (e.ph !== "e") {
            if (isEventNameSelected(e.name)) {
              n.push(e);
            }
          }
        }
      });
      setFilteredEvents(n);
    }
  }, [timestampRange, setFilteredEvents, data, isEventNameSelected]);

  return (
    <section style={{ display: isVisible ? "inherit" : "none" }}>
      <div
        style={{
          display: "flex",
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

            const hasUrlEventString = asyncEvents[el].hasUrlEvent
              ? "(URL Event)"
              : undefined;
            return (
              <button
                className={classNames(styles.topWindowItem, {
                  [styles.selectedButton]: ind === selectedButtonInd,
                })}
                key={ind}
                onClick={() => {
                  setSelectedButtonInd(ind);
                  setTimestampRange({ start, end, topEvent: e });
                }}
                disabled={ind === selectedButtonInd}
              >
                {supportedEvents[e.name]} at {e.ts} {hasUrlEventString}
              </button>
            );
          })}
        </div>
        <div className={styles.topRowSelectors}>
          {Object.keys(eventCounts)
            .sort()
            .map((el, ind) => (
              <CheckboxFilterSelector
                label={`${el}: ${eventCounts[el]}`}
                key={ind}
                onChange={() => toggleSelectedEventName(el)}
                isChecked={isEventNameSelected(el)}
                onOnly={() => setSelectedEventNames([el])}
              />
            ))}
        </div>
      </div>

      <div style={{ margin: "25px", border: "3px black solid" }}>
        {timestampRange && (
          <>
            <p className={classNames(styles.b, styles.key)}>
              Blue background is an async event with a Start and End event. We
              have combined them for you.
            </p>
            <p className={classNames(styles.x, styles.key)}>
              Purple background is a standalone event with a duration.
            </p>
            <p className={classNames(styles.i, styles.key)}>
              Gray background is an instantaneous event. It does not have a
              duration, but is hardcoded to help visualize its start.
            </p>
            <AsyncEventsFilteredViewer
              filteredEvents={filteredEvents}
              start={timestampRange.start}
              end={timestampRange.end}
              topEvent={timestampRange.topEvent}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default AsyncEventViewer;
