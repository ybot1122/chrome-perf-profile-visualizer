import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
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
        <p className={styles.description}>Pick a flow to analyze</p>
        <h3>
          <a href="/visualizer?filename=hulu_playback">Hulu Playback</a>
        </h3>
        <h3>
          <a href="/visualizer?filename=hulu_slider">Hulu Slider</a>
        </h3>
        <h3>
          <a href="/visualizer?filename=hulu_lazyload">Hulu Lazy Load</a>
        </h3>
      </main>
    </div>
  );
}

/*
  <Upload
    title="Select Chrome Trace Data to Upload (*.json.gz format)"
    format=".json.gz"
  />
  <Upload
    title="Select Chrome Profile Data to Upload (*.json format)"
    format=".json"
  />
*/
