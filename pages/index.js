import Head from "next/head";
import Image from "next/image";

import Upload from "../components/Upload";
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
        <p className={styles.description}>
          This tool will help you view Chrome Trace and Chrome DevTools Profiler
          data side-by-side.
        </p>
      </main>

      <Upload
        title="Select Chrome Trace Data to Upload (*.json.gz format)"
        format=".json.gz"
      />

      <Upload
        title="Select Chrome Profile Data to Upload (*.json format)"
        format=".json"
      />
    </div>
  );
}
