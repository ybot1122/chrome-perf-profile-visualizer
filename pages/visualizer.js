import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import styles from "../styles/Visualizer.module.css";
import VisualizerTable from "../components/VisualizerTable";
import classNames from "classnames";

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
        <p className={styles.description}>
          This tool will help you view Chrome DevTools Profiler data.
        </p>
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
            Async Events
          </p>
        </nav>
        <VisualizerTable data={data} isVisible={tab === "visualizerTable"} />
        {tab === "asyncEvents" && <div>Async</div>}
      </main>
    </div>
  );
}
