
export const ShipmentsContext = createContext({});

export const ContexShipmentsContext = (props) => {
  //exporto un array y una funcion para modificarlo
  const [allShipments, setAllShipments] = useState([]);
console.log('estoy en el context de shipments')	
console.log(allShipments)
  return (
    <ShipmentsContext.Provider
      value={
        { initialDayMonth, setInitialDayMonth }
      }
    >
      {props.children}
    </ShipmentsContext.Provider>
  );
};
export default ShipmentsContext;