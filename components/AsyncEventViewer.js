import { useEffect, useState } from "react";

const AsyncEventViewer = ({ data, isVisible }) => {
  const [asyncEvents, setAsyncEvents] = useState({});

  useEffect(() => {
    const asyncEvents = {};
    // Find pairs of async events
    data.forEach((e) => {
      if (
        (e.cat === "benchmark,latencyInfo,rail" &&
          e.name === "InputLatency::MouseDown") ||
        e.name === "InputLatency::MouseUp"
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
  }, [data]);

  console.log(asyncEvents);
  Object.keys(asyncEvents).map((el) => console.log(el));

  return (
    <div
      style={{
        display: isVisible ? "block" : "none",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      <h1>hello</h1>
      {Object.keys(asyncEvents).map((el) => (
        <div>{asyncEvents[el].begin.name}</div>
      ))}
    </div>
  );
};

export default AsyncEventViewer;
