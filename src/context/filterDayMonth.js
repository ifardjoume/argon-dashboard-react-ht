import React, { useState } from "react";
import { createContext } from "react";

export const FilterDayMonth = createContext({});

export const ContextFilterDayMonth = (props) => {
  //exporto un array y una funcion para modificarlo
  const [initialDayMonth, setInitialDayMonth] = useState(
    localStorage.getItem("initialDayMonth") || "day"
  );
 const [custom_date, setCustom_date] = useState(
    localStorage.getItem("custom_date") || null
  );
console.log('desde context')
console.log(custom_date)
console.log(initialDayMonth)

  return (
    <FilterDayMonth.Provider value={{ initialDayMonth, setInitialDayMonth,custom_date,setCustom_date }}>
      {props.children}
    </FilterDayMonth.Provider>
  );
};

export default FilterDayMonth;
