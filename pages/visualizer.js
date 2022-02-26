import { useEffect, useState } from "react";
import Head from "next/head";

import Upload from "../components/Upload";
import styles from "../styles/Visualizer.module.css";

// import trace from "../public/trace_t2.json";
import profile from "../public/Profile-20220213T202324.json";
import useSelection from "../components/useSelection";
import CheckboxFilterSelector from "../components/CheckboxFilterSelector";
import EventRow from "../components/EventRow";
import TimestampFilter from "../components/TimestampFilter";

export default function Visualizer() {
  const data = profile;
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategory, isCategorySelected] = useSelection();
  const [selectedEventNames, setSelectedEventName, isEventNameSelected] = useSelection();
  const [tsRange, setTsRange] = useState({minTs: 0, maxTs: Number.MAX_SAFE_INTEGER});
  const [eventNames, setEventNames] = useState({});

  const renderData = () => {
      const result = [];
      events.forEach((event, ind) => {
        result.push(<EventRow event={event} ind={ind} />)
      });

      return (
      <div className={styles.data}>
        <div className={styles.datarowheader}><div>Timestamp</div><div>Event Category</div><div>Event Name</div></div>
          {result}
      </div>)
  }

  const renderCategories = () => {
      const result = [];
      categories.forEach((c, ind) => result.push(<CheckboxFilterSelector label={c} prefix="cat" onChange={() => setSelectedCategory(c)} key={ind} />));
      return <div><h3 className={styles.filterheader}>Event Categories</h3>{result}</div>;
  }

  const renderEventNames = () => {
    const k = Object.keys(eventNames);
    let result;

    if (!k || !k.length) {
      result = <p>Select a category to see event names</p>
    } else {
      result = k.map((k, ind) => <CheckboxFilterSelector label={`${k} (${eventNames[k]})`} prefix="ename" onChange={() => setSelectedEventName(k)} key={ind} />);
    }
    return <div><h3 className={styles.filterheader}>Event Names</h3>{result}</div>
  }

  const renderTimestampFilter = () => {
    return <TimestampFilter defaultMin={tsRange.minTs} defaultMax={tsRange.maxTs} setTsRange={setTsRange} />
  }

  // Sets the events array by filtering original data for just the selected categories
  useEffect(() => {
    const u = [];
    data.forEach((event) => {
      if (isCategorySelected(event.cat) && isEventNameSelected(event.name) && event.ts >= tsRange.minTs && event.ts <= tsRange.maxTs) {
        u.push(event);
      }
    })
    setEvents(u);
  }, [selectedCategories, selectedEventNames, tsRange, data, isCategorySelected, isEventNameSelected]);

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
    })
    setEventNames(enames);
  }, [events, data, isCategorySelected])

  // Sets the category options, only done once on mount
  useEffect(() => {
    const cat = [];
    data.forEach((event) => {
        if (!cat.find((el) => el === event.cat)) {
            cat.push(event.cat);
        }
    })
    setCategories(cat);
  }, [data])

  return (
    <div className={styles.container}>
      <Head>
        <title>Trace and Profile Visualizer</title>
        <meta
          name="description"
          content="A tool to visualize trace data and profile data from Chrome DevTools"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          This tool will help you view Chrome Trace and Chrome DevTools Profiler
          data side-by-side.
        </p>
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%'
        }}>
          <div className={styles.filterColumn}>
          {renderCategories()}
          {renderEventNames()}
          {renderTimestampFilter()}
          </div>
          <div style={{flexGrow: 1}}>
          {renderData()}
          </div>
        </div>
      </main>

    </div>
  );
}
