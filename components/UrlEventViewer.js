import { useEffect, useState } from "react";

const UrlEventViewer = ({ data, isVisible }) => {
  const [urlEvents, setUrlEvents] = useState([]);
  const [activeReqEvents, setActiveReqEvents] = useState([]);
  const [activeReqId, setActiveReqId] = useState();

  useEffect(() => {
    const es = [];
    data.forEach((e) => {
      if (e.name.includes("Resource") && e?.args?.data?.requestId) {
        es.push(e);
      }
    });
    setUrlEvents(es);
  }, [data]);

  useEffect(() => {
    const es = [];
    urlEvents.forEach((e) => {
      if (e.args.data.requestId === activeReqId) {
        es.push(e);
      }
    });
    setActiveReqEvents(es);
  }, [activeReqId]);

  return (
    <div style={{ display: isVisible ? "inherit" : "none", margin: "15px" }}>
      <h1>This page is a work in progress</h1>
      {activeReqEvents && (
        <div style={{ border: "1px black solid" }}>
          {activeReqEvents.map((el, ind) => (
            <p key={ind}>
              {el.name}: {el.ts}
            </p>
          ))}
        </div>
      )}
      {urlEvents.map((el, ind) => {
        return (
          el?.args?.data?.url && (
            <p key={ind} onClick={() => setActiveReqId(el.args.data.requestId)}>
              {el.ts}: {el.args.data.url} | RequestID: {el.args.data.requestId}
            </p>
          )
        );
      })}
    </div>
  );
};

export default UrlEventViewer;
