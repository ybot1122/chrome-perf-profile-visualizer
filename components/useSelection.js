import { useState } from "react";

const useSelection = () => {
    const [selected, _setSelected] = useState([]);

    const toggleSelected = (val) => {
        const ind = selected.findIndex((e) => val === e);
        const updated = [...selected];
        if (ind > -1) {
            updated.splice(ind, 1);
        } else {
            updated.push(val);
        }
        _setSelected(updated);
    }

    const isSelected = (val) => selected.find((e) => e === val);

    return [selected, toggleSelected, isSelected]
};

export default useSelection;
