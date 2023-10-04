import React, {  useState } from "react";
import { createContext } from "react";

export const FilterDayMonth = createContext({});

export const ContextFilterDayMonth = (props) => {
  //exporto un array y una funcion para modificarlo
  const [initialDayMonth, setInitialDayMonth] = useState('month');
 
  return (
    <FilterDayMonth.Provider
      value={
        { initialDayMonth, setInitialDayMonth }
      }
    >
      {props.children}
    </FilterDayMonth.Provider>
  );
};

export default FilterDayMonth;