import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import styles from "../styles/Visualizer.module.css";

import useSelection from "../components/useSelection";
import EventRow from "../components/EventRow";
import TimestampFilter from "../components/TimestampFilter";
import EventNameFilter from "../components/EventNameFilter";
import EventCategoryFilter from "../components/EventCategoryFilter";

export default function Visualizer() {
  const {
    query: { filename },
  } = useRouter();
  const [data, setData] = useState([]);
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

  useEffect(() => {
    let url;

    switch (filename) {
      case "hulu_playback":
        url = "hulu_profile_playback.json";
        break;
      case "hulu_slider":
        url = "hulu_profile_slider.json";
        break;
      case "hulu_lazyload":
        url = "hulu_profile_lazyload.json";
        break;
      case "dplus_slider":
        url = "dplus_profile_slider.json";
        break;
      case "dplus_playback":
        url = "dplus_profile_playback.json";
        break;
      default:
        return;
    }

    axios.get(`/${url}`).then((res) => {
      const data = res.data;
      data.sort((e1, e2) => e1.ts - e2.ts);
      setData(data);
    });
  }, [filename, setData]);

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
    <div className={styles.container}>
      <main className={styles.main}>
        <p className={styles.description}>
          This tool will help you view Chrome Trace and Chrome DevTools Profiler
          data side-by-side.
        </p>
        <div
          style={{
            display: "flex",
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
      </main>
    </div>
  );
}
