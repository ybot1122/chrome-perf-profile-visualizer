import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

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
        <p>
          Chrome browser has a profiler tool which can be used to learn about
          your website&apos;s runtime performance.
        </p>
        <p className={styles.description}>Pick some data to analyze</p>
        <table className={styles.pickTable}>
          <tbody>
            <tr>
              <th>Flow Name</th>
              <th>Hulu</th>
              <th>Netflix</th>
              <th>DisneyPlus</th>
            </tr>
            <tr>
              <td>From a loaded page, open playback.</td>
              <td>
                <Link href="/visualizer?filename=hulu_playback">
                  <a>Hulu Playback</a>
                </Link>
              </td>
              <td>TBD</td>
              <td>TBD</td>
            </tr>
            <tr>
              <td>From a loaded page, click a slider button</td>
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
              <td>TBD</td>
            </tr>
            <tr>
              <td>From a loaded page, scroll down and trigger a lazy load.</td>
              <td>
                <Link href="/visualizer?filename=hulu_playback">
                  <a>Hulu Playback - star</a>
                </Link>
              </td>
              <td>TBD</td>
              <td>TBD</td>
            </tr>
          </tbody>
        </table>
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
