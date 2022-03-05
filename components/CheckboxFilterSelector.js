import styles from "../styles/Visualizer.module.css";

const CheckboxFilterSelector = ({
  label = "",
  prefix = "",
  onChange,
  key,
  isChecked,
  onOnly,
}) => {
  const id = `${prefix}_${label}_${key}`;
  return (
    <div className={styles.checkboxContainer}>
      {" "}
      <label htmlFor={id} className={styles.checkboxfilter} key={id}>
        <input
          id={id}
          type="checkbox"
          onChange={onChange}
          checked={isChecked}
        />
        {label}
      </label>
      <span className={styles.link} onClick={onOnly}>
        Only
      </span>
    </div>
  );
};

export default CheckboxFilterSelector;
