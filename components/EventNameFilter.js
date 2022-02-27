import styles from "../styles/Visualizer.module.css";

import CheckboxFilterSelector from "./CheckboxFilterSelector";

const EventNameFilter = ({
  eventNames,
  toggleSelectedEventName,
  isEventNameSelected,
  setSelectedEventNames,
}) => {
  const k = Object.keys(eventNames);
  let result;

  if (!k || !k.length) {
    result = <p>Select a category to see event names</p>;
  } else {
    result = k.map((k, ind) => (
      <CheckboxFilterSelector
        label={`${k} (${eventNames[k]})`}
        prefix="ename"
        onChange={() => toggleSelectedEventName(k)}
        key={ind}
        isChecked={isEventNameSelected(k)}
      />
    ));
  }
  return (
    <div>
      <h3 className={styles.filterheader}>
        Event Names{" "}
        <span onClick={() => setSelectedEventNames(k)}>Select All</span>
      </h3>
      {result}
    </div>
  );
};

export default EventNameFilter;
