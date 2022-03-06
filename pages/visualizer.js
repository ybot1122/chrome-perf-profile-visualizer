// https://blog.logrocket.com/how-javascript-works-optimizing-the-v8-compiler-for-efficiency/
// https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/life_of_a_frame.md#Steps

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import styles from "../styles/Visualizer.module.css";
import VisualizerTable from "../components/VisualizerTable";
import classNames from "classnames";
import AsyncEventViewer from "../components/AsyncEventViewer";

export default function Visualizer() {
  const [tab, setTab] = useState("visualizerTable");
  const {
    query: { filename },
  } = useRouter();
  const [data, setData] = useState([]);

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
      case "netflix_slider":
        url = "netflix_profile_slider.json";
        break;
      case "netflix_playback":
        url = "netflix_profile_playback.json";
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

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 style={{ textAlign: "center" }}>
          Chrome Performance Profile for: {filename}
        </h1>
        <nav className={styles.navBar}>
          <p
            className={classNames(styles.navTab, {
              [styles.navTabActive]: tab === "visualizerTable",
            })}
            onClick={() => setTab("visualizerTable")}
          >
            Table View
          </p>
          <p
            className={classNames(styles.navTab, {
              [styles.navTabActive]: tab === "asyncEvents",
            })}
            onClick={() => setTab("asyncEvents")}
          >
            UI Drilldown
          </p>
        </nav>
        <VisualizerTable data={data} isVisible={tab === "visualizerTable"} />
        <AsyncEventViewer data={data} isVisible={tab === "asyncEvents"} />
      </main>
    </div>
  );
}
