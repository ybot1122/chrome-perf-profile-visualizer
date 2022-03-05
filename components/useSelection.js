import { useState, useCallback } from "react";

const useSelection = () => {
  const [selected, _setSelected] = useState([]);

  const toggleSelected = useCallback(
    (val) => {
      const ind = selected.findIndex((e) => val === e);
      const updated = [...selected];
      if (ind > -1) {
        updated.splice(ind, 1);
      } else {
        updated.push(val);
      }
      _setSelected(updated);
    },
    [selected, _setSelected]
  );

  const setSelected = useCallback((d) => _setSelected(d), [_setSelected]);

  const isSelected = useCallback(
    (val) => selected.find((e) => e === val),
    [selected]
  );

  return [selected, toggleSelected, setSelected, isSelected];
};

export default useSelection;
