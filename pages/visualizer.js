// https://blog.logrocket.com/how-javascript-works-optimizing-the-v8-compiler-for-efficiency/
// https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/life_of_a_frame.md#Steps
// Update Layer: https://groups.google.com/a/chromium.org/g/blink-dev/c/j7YQtj0Yyxs and https://stackoverflow.com/questions/25724126/chrome-devtools-timeline-update-layer-tree-event
// https://chromium.googlesource.com/chromium/src/+/HEAD/net/docs/life-of-a-url-request.md
// Blinkon: https://www.youtube.com/channel/UCIfQb9u7ALnOE4ZmexRecDg
//

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import styles from "../styles/Visualizer.module.css";
import VisualizerTable from "../components/VisualizerTable";
import classNames from "classnames";
import AsyncEventViewer from "../components/AsyncEventViewer";
import Link from "next/link";
import UrlEventViewer from "../components/UrlEventViewer";

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
      case "dplus_lazyload":
        url = "dplus_profile_lazyload.json";
        break;
      case "netflix_lazyload":
        url = "netflix_profile_lazyload.json";
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
      <Link href="/">
        <a>Back to home</a>
      </Link>
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

          <p
            className={classNames(styles.navTab, {
              [styles.navTabActive]: tab === "urlEventViewer",
            })}
            onClick={() => setTab("urlEventViewer")}
          >
            URL Events
          </p>
        </nav>
        <VisualizerTable data={data} isVisible={tab === "visualizerTable"} />
        <AsyncEventViewer data={data} isVisible={tab === "asyncEvents"} />
        <UrlEventViewer data={data} isVisible={tab === "urlEventViewer"} />
      </main>
    </div>
  );
}
