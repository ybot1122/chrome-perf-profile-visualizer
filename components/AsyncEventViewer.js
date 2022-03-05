import { useEffect, useState } from "react";

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
    setFilteredEvents(
      data.filter(
        (e) => e.ts >= timestampRange.start && e.ts <= timestampRange.end
      )
    );
  }, [timestampRange, setFilteredEvents]);

  return (
    <div
      style={{
        display: isVisible ? "block" : "none",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      <h1>hello</h1>
      {Object.keys(asyncEvents).map((el, ind) => {
        const e = asyncEvents[el].begin;
        const start = e.ts;
        const end = asyncEvents[el].end?.ts ?? Number.MAX_SAFE_INTEGER;
        return (
          <div key={ind} onClick={() => setTimestampRange({ start, end })}>
            {supportedEvents[e.name]} at {e.ts}
          </div>
        );
      })}
      {filteredEvents.map((el) => (
        <p>{el.name}</p>
      ))}
    </div>
  );
};

export default AsyncEventViewer;
