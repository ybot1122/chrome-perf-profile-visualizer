import styles from '../styles/Visualizer.module.css'

const CheckboxFilterSelector = ({label = '', prefix = '', onChange}) => {
      const id = `${prefix}_${label}`;
      return <label htmlFor={id} className={styles.checkboxfilter} key={id}><input id={id} type="checkbox" onChange={onChange} />{label}</label>;
};

export default CheckboxFilterSelector;
