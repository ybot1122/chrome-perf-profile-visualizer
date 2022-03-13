import { useEffect, useState } from "react";

const UrlEventViewer = ({ data, isVisible }) => {
  const [urlEvents, setUrlEvents] = useState([]);

  useEffect(() => {
    const es = [];
    data.forEach((e) => {
      if (e.name === "ResourceSendRequest") {
        es.push(e);
      }
    });
    setUrlEvents(es);
  }, [data]);

  return (
    <div style={{ display: isVisible ? "inherit" : "none", margin: "15px" }}>
      {urlEvents.map((el, ind) => (
        <p key={ind}>
          {el.ts}:{" "}
          <a href="#" target="_blank" rel="noreferrer">
            {el.args.data.url}
          </a>
        </p>
      ))}
    </div>
  );
};

export default UrlEventViewer;
