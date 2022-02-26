import { useEffect, useState } from "react";
import Head from "next/head";

import Upload from "../components/Upload";
import styles from "../styles/Home.module.css";

// import trace from "../public/trace_t2.json";
import profile from "../public/Profile-20220213T202324.json";

export default function Visualizer() {
  const input = profile;
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [eventNames, setEventNames] = useState({});

  const renderData = () => {
      const result = [];
      input.forEach((event) => {
        if (event.cat === selectedCategory) {
            result.push(<tr><td>{event.ts}</td><td>{event.cat}</td><td>{event.name}</td></tr>)
        }
      });

      return (<table>
          <tr><th>Timestamp</th><th>Event Category</th><th>Event Name</th></tr>
          {result}
      </table>)
  }

  const renderCategories = () => {
      const result = [<option>Pick a Category</option>];
      categories.forEach((c) => {
        result.push(<option>{c}</option>);
      })

      return <select onChange={(e) => setSelectedCategory(e.target.value)}>{result}</select>
  }

  const renderEventNames = () => {
    return <ul>{Object.keys(eventNames).map((k) => <li>{k}: {eventNames[k]}</li>)}</ul>
  }

  useEffect(() => {
    const enames = {};
    input.forEach((event) => {
        if (event.cat === selectedCategory) {
            if (!enames[event.name]) {
                enames[event.name] = 0;
            }
            enames[event.name] += 1;
        }
    })
    setEventNames(enames);
  }, [selectedCategory])

  useEffect(() => {
    const cat = [];
    input.forEach((event) => {
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
        {renderCategories()}
        {renderEventNames()}
        {renderData()}
      </main>

    </div>
  );
}
