import styles from "../styles/Visualizer.module.css";
import fstyles from "../styles/FilterStyles.module.css";
import { useEffect, useState } from "react";

const enames = [
  "InputLatency::MouseDown",
  "InputLatency::MouseUp",
  "InputLatency::GestureScrollEnd",
];

const UserInteractionFinder = ({ data, minFormRef, setMinTs }) => {
  const [userInteractions, setUserInteractions] = useState([]);

  useEffect(() => {
    setUserInteractions(
      data.filter(
        (e) => e.cat === "benchmark,latencyInfo,rail" && enames.includes(e.name)
      )
    );
  }, [setUserInteractions, data]);

  return (
    <div>
      <p>Click a user interaction to set the starting timestamp.</p>
      <ul className={fstyles.uiSelector}>
        {userInteractions.map((el, ind) => (
          <li
            key={ind}
            onClick={() => {
              setMinTs(el.ts);
              minFormRef.current.value = el.ts;
            }}
          >
            {el.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserInteractionFinder;
