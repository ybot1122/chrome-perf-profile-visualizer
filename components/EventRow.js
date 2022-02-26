import { useEffect, useState } from "react";
import styles from '../styles/Visualizer.module.css'

// TODO: npm i pretty-print-json

const EventRow = ({ind, event}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const row = <div className={styles.datarow} key={ind}><div>{event.ts}</div><div>{event.cat}</div><div>{event.name}</div></div>;

    const expanded = (isExpanded) ? <div className={styles.datajson}>Hello</div>: null;
    return <>
        <div className={styles.datarow} key={ind} onClick={() => setIsExpanded(!isExpanded)}><div>{event.ts}</div><div>{event.cat}</div><div>{event.name}</div></div>
        {expanded}
    </>
}

export default EventRow;
