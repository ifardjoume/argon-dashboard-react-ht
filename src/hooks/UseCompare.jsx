
import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_SHIPMENTS_TO_COMPARE } from "queries";

let array = [];
let error = false;
export const useCompare = () => {
  const [arrayState, setArrayState] = useState([]);
  const [errorState, setErrorState] = useState(false);


  const [
    lazyGetShipmentsToCompare,
  ] = useLazyQuery(GET_SHIPMENTS_TO_COMPARE);

  const clearSelection = () => {
    let shipsChecked = document.getElementsByName("shipsTocompare");
    let shipsLen = shipsChecked.length;
    for (let i = 0; i < shipsLen; i++) {
      shipsChecked[i].checked = false
    }

    array = [];
    setArrayState([])
  }
  const handleCheck = (e) => {
  
    if (e.target.checked) {
      array.push(e.target.value);
      setArrayState([...arrayState, e.target.value]);
    } else {

      let idToRemove = e.target.value;
      let filtered = array.filter((id) => id !== idToRemove);
      array = filtered;
      setArrayState(filtered);

    }

  };



  const compareShipments = async (arrayState, company_id, onAction, errorMsj) => {

    if (array.length < 2 || array.length === 0 || array.length > 5) {
      setArrayState([])

      errorMsj()
    } else {
      lazyGetShipmentsToCompare({
        variables: {
          company_id: company_id,
          shipments_ids: arrayState
        },
      })
        .then(result => {
          onAction(result.data);

        })
        .catch(error => {
          console.log(error)
        })
    }

  };
  return { arrayState, errorState, compareShipments, handleCheck, clearSelection };
};
