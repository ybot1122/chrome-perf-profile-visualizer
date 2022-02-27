import styles from "../styles/Visualizer.module.css";

import CheckboxFilterSelector from "./CheckboxFilterSelector";

const EventCategoryFilter = ({
  categories,
  toggleSelectedCategory,
  isCategorySelected,
  setSelectedCategories,
}) => {
  const result = [];

  categories.forEach((c, ind) =>
    result.push(
      <CheckboxFilterSelector
        label={c}
        prefix="cat"
        onChange={() => toggleSelectedCategory(c)}
        key={ind}
        isChecked={isCategorySelected(c)}
      />
    )
  );
  return (
    <div>
      <h3 className={styles.filterheader}>
        Event Categories{" "}
        <span onClick={() => setSelectedCategories(categories)}>
          Select All
        </span>
      </h3>
      {result}
    </div>
  );
};

export default EventCategoryFilter;
