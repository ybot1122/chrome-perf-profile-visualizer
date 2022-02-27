import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import styles from "../styles/Visualizer.module.css";

import hulu_profile_playback from "../public/hulu_profile_playback.json";
import hulu_profile_slider from "../public/hulu_profile_slider.json";
import hulu_profile_lazyload from "../public/hulu_profile_lazyload.json";
import useSelection from "../components/useSelection";
import EventRow from "../components/EventRow";
import TimestampFilter from "../components/TimestampFilter";
import EventNameFilter from "../components/EventNameFilter";
import EventCategoryFilter from "../components/EventCategoryFilter";

export default function Visualizer() {
  const {
    query: { filename },
  } = useRouter();
  const [data, setData] = useState();
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
          <div className={styles.datarowtimestamp}>Timestamp</div>
          <div className={styles.datarowdata}>Event Category</div>
          <div className={styles.datarowdata}>Event Name</div>
        </div>
        {result}
      </div>
    );
  };

  useEffect(() => {
    switch (filename) {
      case "hulu_playback":
        setData(hulu_profile_playback);
        break;
      case "hulu_slider":
        setData(hulu_profile_slider);
        break;
      case "hulu_lazyload":
        setData(hulu_profile_lazyload);
        break;
      default:
        break;
    }
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
            />
          </div>
          <div style={{ flex: 1 }}>{renderData()}</div>
        </div>
      </main>
    </div>
  );
}
