import { useState } from "react";
import styles from "../styles/Visualizer.module.css";

const TimestampFilter = ({ defaultMin, defaultMax, setTsRange }) => {
  const [minTs, setMinTs] = useState(defaultMin);
  const [maxTs, setMaxTs] = useState(defaultMax);
  const numberOnlyOnChange = (evt) => {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === "paste") {
      key = theEvent.clipboardData.getData("text/plain");
    } else {
      // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  };

  return (
    <div>
      <h3 className={styles.filterheader}>Timestamp Range</h3>
      <table>
        <tbody>
          <tr>
            <td>Min:</td>
            <td>
              <input
                type="text"
                className={styles.tsFilterInput}
                onKeyPress={numberOnlyOnChange}
                defaultValue={minTs}
                onChange={(e) => setMinTs(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Max:</td>
            <td>
              <input
                className={styles.tsFilterInput}
                type="text"
                defaultValue={maxTs}
                onKeyPress={numberOnlyOnChange}
                onChange={(e) => setMaxTs(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <input
        type="submit"
        onClick={() => setTsRange({ minTs, maxTs })}
        id="tsfiltersubmit"
        value="Submit"
      />
    </div>
  );
};

export default TimestampFilter;
