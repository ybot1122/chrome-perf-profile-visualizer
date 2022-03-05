import { useEffect, useState } from "react";
import styles from "../styles/Visualizer.module.css";

import useSelection from "./useSelection";
import EventRow from "./EventRow";
import TimestampFilter from "./TimestampFilter";
import EventNameFilter from "./EventNameFilter";
import EventCategoryFilter from "./EventCategoryFilter";

const VisualizerTable = ({ data, isVisible }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [
    selectedCategories,
    toggleSelectedCategory,
    setSelectedCategories,
    isCategorySelected,
  ] = useSelection();
  const [
    selectedEventNames,
    toggleSelectedEventName,
    setSelectedEventNames,
    isEventNameSelected,
  ] = useSelection();
  const [tsRange, setTsRange] = useState({
    minTs: 0,
    maxTs: Number.MAX_SAFE_INTEGER,
  });
  const [eventNames, setEventNames] = useState({});

  const renderData = () => {
    const result = [];
    events.forEach((event, ind) => {
      result.push(<EventRow event={event} ind={ind} minTs={tsRange.minTs} />);
    });

    return (
      <div className={styles.data}>
        <div className={styles.datarowheader}>
          <div className={styles.datarowtimestamp}>Timestamp (µs)</div>
          <div className={styles.datarowsm}>PID</div>
          <div className={styles.datarowsm}>TID</div>
          <div className={styles.datarowdata}>Event Category</div>
          <div className={styles.datarowdata}>Event Name</div>
        </div>
        {result}
      </div>
    );
  };

  // Sets the events array by filtering original data for just the selected categories
  useEffect(() => {
    const u = [];
    data.forEach((event) => {
      if (
        isCategorySelected(event.cat) &&
        isEventNameSelected(event.name) &&
        event.ts >= tsRange.minTs &&
        event.ts <= tsRange.maxTs
      ) {
        u.push(event);
      }
    });
    setEvents(u);
  }, [
    selectedCategories,
    selectedEventNames,
    tsRange,
    data,
    isCategorySelected,
    isEventNameSelected,
  ]);

  // Sets options for event names to check
  useEffect(() => {
    const enames = {};
    data.forEach((event) => {
      if (isCategorySelected(event.cat)) {
        if (!enames[event.name]) {
          enames[event.name] = 0;
        }
        enames[event.name] += 1;
      }
    });
    setEventNames(enames);
  }, [events, data, isCategorySelected]);

  // Sets the category options, only done once on mount
  useEffect(() => {
    const cat = [];
    data.forEach((event) => {
      if (!cat.find((el) => el === event.cat)) {
        cat.push(event.cat);
      }
    });
    cat.sort();
    setCategories(cat);
  }, [data]);

  return (
    <div
      style={{
        display: isVisible ? "flex" : "none",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      <div className={styles.filterColumn}>
        <EventCategoryFilter
          categories={categories}
          toggleSelectedCategory={toggleSelectedCategory}
          isCategorySelected={isCategorySelected}
          setSelectedCategories={setSelectedCategories}
        />
        <EventNameFilter
          eventNames={eventNames}
          toggleSelectedEventName={toggleSelectedEventName}
          isEventNameSelected={isEventNameSelected}
          setSelectedEventNames={setSelectedEventNames}
        />
        <TimestampFilter
          defaultMin={tsRange.minTs}
          defaultMax={tsRange.maxTs}
          setTsRange={setTsRange}
          data={data}
        />
      </div>
      <div style={{ flex: 1 }}>{renderData()}</div>
    </div>
  );
};

export default VisualizerTable;
