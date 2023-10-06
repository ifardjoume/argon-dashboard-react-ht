import React, { useEffect, useState, useContext } from "react";
import { useSubscription } from "@apollo/client";
import {
  SHIPMENTS_CREATED_SUBSCRIPTION,
  SHIPMENTS_UPDATED_SUBSCRIPTION,
} from "../queries";
import axios from "axios";
import { company_id, SERVER_URL } from "../const";
import { logOut, parseJwt } from "../helpers.js";
import {access_parced} from '../const'
import FilterDayMonth from "context/filterDayMonth";

export const useShipments = () => {
  
    const token = localStorage.getItem("token");
  if (!parseJwt(localStorage.getItem("token")).SUDO) {
    if (access_parced.dash_control === false) logOut();
  }
  const { initialDayMonth, setInitialDayMonth } = useContext(FilterDayMonth);
   
  // ESTADOS LOCALES ------------------------------------------------------------------------
  //estados donde me guardo la info traida de la query
  const [inTransitShipsState, setInTransitShipsState] = useState(0);
  const [allData, setAllData] = useState({
    completedShipsState: 0,
    succShipsState: 0,
    uncertShipsState: 0,
    failShipsState: 0,
    branchesWithMoreAlerts: [],
    causes: [],
  });

  //estados donde me guardo la info de fechas anteriores
  const [prevData, setPrevData] = useState({
    prevCompletedShipsState: 0,
    prevSuccShipsState: 0,
    prevUncertShipsState: 0,
    prevFailShipsState: 0,
  });

  //estado para los loading
  const [loading, setLoading] = useState(true);

  //estado para el filtro inicial mes/día
  const [initialFilter, setInitialFilter] = useState("month");

  //estados y variables para el seteo de fechas y filtros mes/dia
  const date = new Date();
  const firstDayOfMonth = new Date().setDate("01");
  const [initialDay, setInitialDay] = useState(
    new Date(new Date().setHours("00", "00", "00"))
  );
  const [initialMonth, setInitialMonth] = useState(
    new Date(new Date(firstDayOfMonth).setHours("00", "00", "00"))
  );
  const [yesterday, setYesterday] = useState(
    new Date(new Date() - 86400000).toISOString().split("T")[0]
  );
  const [initialPrevMonth, setInitialPrevMonth] = useState(
    new Date(new Date(new Date(firstDayOfMonth).setMonth(date.getMonth() - 1)))
      .toISOString()
      .split("T")[0]
  );

  //estado para setear info segun dia o mes
  const handlerInitialFilter = function (e) {
    setInitialFilter(e.target.value);
    setInitialDayMonth(e.target.value)
  };

  //TRAIGO LA DATA DESDE EL SERVIDOR SEGUN FILTRO MES/DIA ------------------------------------------------------------------
  async function fetchData(type, company_id) {

    const result = await axios.get(
      `${SERVER_URL}/getAllValues/${company_id}/${type}`,
      { headers: { authorization: `Bearer ${token}` } }
    );
 

    try {
      //data actual de viajes en transito

      let totalInTransit = 0;
      for (
        let i = 0;
        i < result?.data?.values[0]?.in_transit?.length;
        i++
      ) {
        totalInTransit =
          totalInTransit +
          result?.data?.values[0]?.in_transit[i]?.in_transit;
      }
      setInTransitShipsState(totalInTransit);
      //data actual de viajes completos
      if (
        initialDay.toISOString().split("T")[0] ===
        result?.data?.values[0]?.stadistic_data[0]?.date?.split("T")[0] ||
        initialMonth.toISOString().split("T")[0] ===
        result?.data?.values[0]?.stadistic_data[0]?.date?.split("T")[0]
      ) {

        setAllData({
          ...allData,
          completedShipsState:
            result.data?.values[0]?.stadistic_data[0]?.successful +
            result.data?.values[0]?.stadistic_data[0]?.uncertain +
            result.data?.values[0]?.stadistic_data[0]?.failed,
          succShipsState:
            result.data?.values[0]?.stadistic_data[0]?.successful,
          uncertShipsState:
            result.data?.values[0]?.stadistic_data[0]?.uncertain,
          failShipsState: result.data?.values[0]?.stadistic_data[0]?.failed,
          branchesWithMoreAlerts: result.data?.ordered?.slice(0, 4),
          causes: initialDay.toISOString().split("T")[0] === result?.data?.values[0]?.causes[0]?.date?.split("T")[0] || initialMonth.toISOString().split("T")[0] === result?.data?.values[0]?.causes[0]?.date?.split("T")[0] ? result.data?.values[0]?.causes[0] : 0,
        });
      } else {

        setAllData({
          ...allData,
          completedShipsState: 0,
          succShipsState: 0,
          uncertShipsState: 0,
          failShipsState: 0,
          branchesWithMoreAlerts: 0,
          causes: 0,
        });
      }

      // datos de dia/mes anterior
      if (
        yesterday ===
        result.data?.values[0]?.stadistic_data[1]?.date?.split("T")[0] ||
        initialPrevMonth ===
        result.data?.values[0]?.stadistic_data[1]?.date.split("T")[0]
      ) {
        setPrevData({
          ...prevData,
          prevCompletedShipsState:
            result.data.values[0]?.stadistic_data[1]?.successful +
            result.data.values[0]?.stadistic_data[1]?.uncertain +
            result.data.values[0]?.stadistic_data[1]?.failed,
          prevSuccShipsState:
            result.data.values[0]?.stadistic_data[1]?.successful,
          prevUncertShipsState:
            result.data.values[0]?.stadistic_data[1]?.uncertain,
          prevFailShipsState:
            result.data.values[0]?.stadistic_data[1]?.failed,
        });
      } else {
        setPrevData({
          ...prevData,
          prevCompletedShipsState: 0,
          prevSuccShipsState: 0,
          prevUncertShipsState: 0,
          prevFailShipsState: 0,
        });
      }
      setLoading(false);
     
     
    }
    catch (error) {
      console.error("Error:", error);
      console.log(error);
      setLoading(false);
    };
  }

  // QUERIES / SUBSCRIPTIONS / MUTATIONS --------------------------------------------------------------------------
  //subscription para viajes iniciados
  const {
    data: createdShipData,
    error: createdShipError,
    // loading: createdShipLoading,
  } = useSubscription(SHIPMENTS_CREATED_SUBSCRIPTION);

  //subscription para viajes cerrados
  const {
    // loading: updatedShipLoading,
    error: updatedShipError,
    data: updatedShipData,
  } = useSubscription(SHIPMENTS_UPDATED_SUBSCRIPTION);

  // CUANDO SE INICIA EL COMPONENTE ---------------------------------------------------------------------------------
  useEffect(() => {

    setLoading(true);
    if (company_id) {
      fetchData(initialFilter, company_id);
    } else {
      setLoading(false);
    }
    // setLoading(false);
  }, [initialFilter, company_id, updatedShipData, createdShipData]);

  //MANEJO DE ERRORES ------------------------------------------------------------------------------------------------
  if (createdShipError)
    console.log(
      "Hubo un error en la subscription de viajes iniciados",
      createdShipError
    );
  if (updatedShipError)
    console.log(
      "Hubo un error en la subscription de viajes cerrados",
      updatedShipError
    );

  
  return [inTransitShipsState,loading, allData, handlerInitialFilter,prevData,initialFilter]
      
}
