import { useEffect, useState } from "react";
import Head from "next/head";

import Upload from "../components/Upload";
import styles from "../styles/Home.module.css";

// import trace from "../public/trace_t2.json";
import profile from "../public/Profile-20220213T202324.json";
import useSelection from "../components/useSelection";

export default function Visualizer() {
  const data = profile;
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategory, isCategorySelected] = useSelection();

  const [eventNames, setEventNames] = useState({});

  const renderData = () => {
      const result = [];
      events.forEach((event) => {
        result.push(<tr><td>{event.ts}</td><td>{event.cat}</td><td>{event.name}</td></tr>)
      });

      return (<table><tbody>
          <tr><th>Timestamp</th><th>Event Category</th><th>Event Name</th></tr>
          {result}
          </tbody>
      </table>)
  }

  const renderCategories = () => {
      const result = [];
      categories.forEach((c, ind) => {
        const id = `cat_${ind}`;
        result.push(<label for={id} style={{display: 'block'}}><input id={id} type="checkbox" onChange={(e) => {
          console.log(selectedCategories);
          console.log(e);
          console.log(document.getElementById(id))
          console.log(document.getElementById(id).labels[0].innerText);
          setSelectedCategory(document.getElementById(id).labels[0].innerText)}
        } />{c}</label>);
      })

      return <div style={{
        textAlign: 'left'}}>{result}</div>;
  }

  const renderEventNames = () => {
    return <ul>{Object.keys(eventNames).map((k) => <li>{k}: {eventNames[k]}</li>)}</ul>
  }

  // Sets the events array by filtering original data for just the selected categories
  useEffect(() => {
    const u = [];
    data.forEach((event) => {
      if (isCategorySelected(event.cat)) {
        u.push(event);
      }
    })
    setEvents(u);
  }, [selectedCategories]);

  // Sets options for event names to check
  useEffect(() => {
    const enames = {};
    events.forEach((event) => {
      if (!enames[event.name]) {
        enames[event.name] = 0;
      }
      enames[event.name] += 1;
    })
    setEventNames(enames);
  }, [events])

  // Sets the category options, only done once on mount
  useEffect(() => {
    const cat = [];
    data.forEach((event) => {
        if (!cat.find((el) => el === event.cat)) {
            cat.push(event.cat);
        }
    })
    setCategories(cat);
  }, [])

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
          <div>
          {renderCategories()}
          {renderEventNames()}
          </div>
          <div>
          {renderData()}
          </div>
        </div>
      </main>

    </div>
  );
}
