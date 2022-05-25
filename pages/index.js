import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import uploadStyles from "../styles/UploadForm.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chrome Profile Visualizer</title>
        <meta
          name="description"
          content="Make sense of your Chrome profile data"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Chrome Performance Profile Analyzer</h1>
          <p>
            The Chrome browser has a profiler tool which can be used to learn
            about your website&apos;s runtime performance. This website offers
            some basic options to analyze your Chrome Performance Profile
            traces. Some features include:
            <ul>
              <li>Filter out specific events</li>
              <li>Filter out events based on timestamp</li>
              <li>Quickly locate timestamps for user interaction events</li>
            </ul>
          </p>
        </div>
        <h2>Try one of these examples traces to analyze:</h2>
        <table className={styles.pickTable}>
          <tbody>
            <tr>
              <th>Flow Name</th>
              <th>Hulu</th>
              <th>DisneyPlus</th>
              <th>Netflix</th>
            </tr>
            <tr>
              <td>Slider Click: From a loaded page, click a slider button</td>
              <td>
                <Link href="/visualizer?filename=hulu_slider">
                  <a>Hulu Slider</a>
                </Link>
              </td>
              <td>
                <Link href="/visualizer?filename=dplus_slider">
                  <a>DisneyPlus Slider</a>
                </Link>
              </td>
              <td>
                <Link href="/visualizer?filename=netflix_slider">
                  <a>Netflix Slider</a>
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                Scrolling Lazy Load: From a loaded page, scroll down and trigger
                a lazy load.
              </td>
              <td>
                <Link href="/visualizer?filename=hulu_lazyload">
                  <a>Hulu Lazyload</a>
                </Link>
              </td>
              <td>
                <Link href="/visualizer?filename=dplus_lazyload">
                  <a>DisneyPlus Lazyload</a>
                </Link>
              </td>
              <td>
                <Link href="/visualizer?filename=netflix_lazyload">
                  <a>Netflix Lazyload</a>
                </Link>
              </td>
            </tr>
            <tr>
              <td>Open Playback: From a loaded page, open playback.</td>
              <td>
                <Link href="/visualizer?filename=hulu_playback">
                  <a>Hulu Playback</a>
                </Link>
              </td>
              <td>
                <Link href="/visualizer?filename=dplus_playback">
                  <a>DisneyPlus Playback</a>
                </Link>
              </td>
              <td>
                <Link href="/visualizer?filename=netflix_playback">
                  <a>Netflix Playback</a>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
        <h3>
          See{" "}
          <a href="https://docs.google.com/document/d/1ZpdC4CI-iEybPGgdufnCWU0LtvGs2GEWMswLLCRq4b8/edit?usp=sharing">
            an analysis
          </a>{" "}
          on these user flows.
        </h3>
        <h2>Upload one of your own traces (WIP)</h2>
        <div className={uploadStyles.uploadForm}>
          <input
            type="file"
            accept="application/json,application/JSON,.json"
          ></input>
          <button disabled>Upload</button>
        </div>
        <div>
          <h3>
            Question, issues, bugs:{" "}
            <a href="https://github.com/ybot1122/csep590-wi22-final-project/tree/main">
              GitHub
            </a>
          </h3>
        </div>
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
