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

export const useFailedUncertain= () => {
  const { initialDayMonth, setInitialDayMonth } = useContext(FilterDayMonth);
  const token = localStorage.getItem('token')
  const [filterData, setFilterData] = useState("allShips");
  const [info, setInfo] = useState({});

  //traigo la data por mes/semana segun el filtro
  function fetchData(type, company_id) {
    const request = axios.get(
      `${SERVER_URL}/getAllValues/${company_id}/${type}`,
      { headers: { authorization: `Bearer ${token}` } }
    );

    request
      .then((result) => {
        setInfo(result.data?.values?.[0]);
      })
      .catch((error) => console.error("Error:", error));
  }

  // QUERIES/MUTATIONS/SUBSCRIPTIONS -----------------------------------------------------------------------
  //subscription de viajes terminados
  const {
    // loading: updatedShipLoading,
    // error: updatedShipError,
    data: updatedShipData,
  } = useSubscription(SHIPMENTS_UPDATED_SUBSCRIPTION);


  // CUANDO SE INICIA EL COMPONENTE -------------------------------------------------------------------------
  useEffect(() => {
    fetchData(initialDayMonth, company_id);
console.log(initialDayMonth)
  }, [initialDayMonth, updatedShipData, company_id]);

  // ESTADOS LOCALES -------------------------------------------------------------------------------------------
  //seteo de fechas desde el año/semana anterior
  const today = new Date();
  const lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));
  // const [finalDate, setFinalDate] = useState(new Date(new Date()));

  //estructura de datos para el ultimo año
  let yearData = [
    {
      name: localStorage.getItem("language") === "en" ? "Jan" : "Ene",
      x: 0,
      y: 0,
      z: 0,
      id: 0,
    },
    { name: "Feb", x: 0, y: 0, z: 0, id: 0 },
    { name: "Mar", x: 0, y: 0, z: 0, id: 0 },
    {
      name: localStorage.getItem("language") === "en" ? "Apr" : "Abr",
      x: 0,
      y: 0,
      z: 0,
      id: 0,
    },
    { name: "May", x: 0, y: 0, z: 0, id: 0 },
    { name: "Jun", x: 0, y: 0, z: 0, id: 0 },
    { name: "Jul", x: 0, y: 0, z: 0, id: 0 },
    { name: "Ago", x: 0, y: 0, z: 0, id: 0 },
    { name: "Sep", x: 0, y: 0, z: 0, id: 0 },
    { name: "Oct", x: 0, y: 0, z: 0, id: 0 },
    { name: "Nov", x: 0, y: 0, z: 0, id: 0 },
    {
      name: localStorage.getItem("language") === "en" ? "Dec" : "Dic",
      x: 0,
      y: 0,
      z: 0,
      id: 0,
    },
  ];

  //estructura de datos para la ultima semana
  let weekData = [
    {
      name: localStorage.getItem("language") === "en" ? "Sun" : "Dom",
      x: 0,
      y: 0,
      z: 0,
      id: 0,
    },
    {
      name: localStorage.getItem("language") === "en" ? "Mon" : "Lun",
      x: 0,
      y: 0,
      z: 0,
      id: 0,
    },
    {
      name: localStorage.getItem("language") === "en" ? "Tue" : "Mar",
      x: 0,
      y: 0,
      z: 0,
      id: 0,
    },
    {
      name: localStorage.getItem("language") === "en" ? "Wed" : "Mié",
      x: 0,
      y: 0,
      z: 0,
      id: 0,
    },
    {
      name: localStorage.getItem("language") === "en" ? "Thu" : "Jue",
      x: 0,
      y: 0,
      z: 0,
      id: 0,
    },
    {
      name: localStorage.getItem("language") === "en" ? "Fri" : "Vie",
      x: 0,
      y: 0,
      z: 0,
      id: 0,
    },
    {
      name: localStorage.getItem("language") === "en" ? "Sat" : "Sáb",
      x: 0,
      y: 0,
      z: 0,
      id: 0,
    },
  ];

  //recorro la data de viajes completos y las guardo segun su status en la data del graph
  if (info && initialDayMonth === "month") {
    let id = 12;
    for (let i = 1; i <= 12; i++) {
      let fecha = new Date(
        new Date(new Date(lastYear).setDate(1)).setMonth(today.getMonth() + i)
      );
      let numberMonth = fecha.getMonth();
      yearData[numberMonth].id = id;
      id--;
      fecha = fecha.toISOString().slice(0, 10);
      for (let j = 0; j < info?.stadistic_data?.length; j++) {
        if (
          info?.stadistic_data[j]?.date.slice(0, 10) === fecha &&
          filterData === "allShips"
        ) {
          yearData[numberMonth].x = info?.stadistic_data[j].successful;
          yearData[numberMonth].y = info?.stadistic_data[j].uncertain;
          yearData[numberMonth].z = info?.stadistic_data[j].failed;
        } else if (
          info?.stadistic_data[j]?.date.slice(0, 10) === fecha &&
          filterData === "succShips"
        ) {
          yearData[numberMonth].x = info?.stadistic_data[j].successful;
          yearData[numberMonth].y = 0;
          yearData[numberMonth].z = 0;
        } else if (
          info?.stadistic_data[j]?.date.slice(0, 10) === fecha &&
          filterData === "uncertShips"
        ) {
          yearData[numberMonth].x = 0;
          yearData[numberMonth].y = info?.stadistic_data[j].uncertain;
          yearData[numberMonth].z = 0;
        } else if (
          info?.stadistic_data[j]?.date.slice(0, 10) === fecha &&
          filterData === "failShips"
        ) {
          yearData[numberMonth].x = 0;
          yearData[numberMonth].y = 0;
          yearData[numberMonth].z = info?.stadistic_data[j].failed;
        }
      }
    }
    yearData.sort(function (a, b) {
      return b.id - a.id;
    });
  }

  //recorro la data y seteo en el array hecho por default, luego lo ordeno por fecha
  if (info && initialDayMonth === "day") {
    let id = 0;
    for (let i = 0; i <= 6; i++) {
      let fecha = new Date(new Date(new Date().setDate(today.getDate() - i)));
      let numberDayOfWeek = fecha.getDay();
      weekData[numberDayOfWeek].id = id;
      id--;
      fecha = fecha.toISOString().slice(0, 10);
      for (let j = 0; j < info?.stadistic_data?.length; j++) {
        if (
          info?.stadistic_data[j]?.date.slice(0, 10) === fecha &&
          filterData === "allShips"
        ) {
          weekData[numberDayOfWeek].x = info?.stadistic_data[j].successful;
          weekData[numberDayOfWeek].y = info?.stadistic_data[j].uncertain;
          weekData[numberDayOfWeek].z = info?.stadistic_data[j].failed;
        } else if (
          info?.stadistic_data[j]?.date.slice(0, 10) === fecha &&
          filterData === "succShips"
        ) {
          weekData[numberDayOfWeek].x = info?.stadistic_data[j].successful;
          weekData[numberDayOfWeek].y = 0;
          weekData[numberDayOfWeek].z = 0;
        } else if (
          info?.stadistic_data[j]?.date.slice(0, 10) === fecha &&
          filterData === "uncertShips"
        ) {
          weekData[numberDayOfWeek].x = 0;
          weekData[numberDayOfWeek].y = info?.stadistic_data[j].uncertain;
          weekData[numberDayOfWeek].z = 0;
        } else if (
          info?.stadistic_data[j]?.date.slice(0, 10) === fecha &&
          filterData === "failShips"
        ) {
          weekData[numberDayOfWeek].x = 0;
          weekData[numberDayOfWeek].y = 0;
          weekData[numberDayOfWeek].z = info?.stadistic_data[j].failed;
        }
      }
    }
    weekData.sort(function (a, b) {
      return a.id - b.id;
    });
  }

  //manejo de filtros
  const handleFilters = function (e) {
    setFilterData(e.target.value);
  };
let cosa=0
return {cosa}  
}