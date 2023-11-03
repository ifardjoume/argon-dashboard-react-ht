import React, { useState, useEffect } from "react";
import { useLazyQuery } from '@apollo/client';
import { GET_SHIPMENT_DETAIL } from 'queries';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Bar,
  ReferenceLine,
} from "recharts";

import styles from "./RegistroTemperaturaIntrusion.module.css";
import temperatura from "./temperatura.png";
// import CircularProgress from "@mui/material/CircularProgress";

const TempIntrusionChart = ({ shipment_id }) => {
  // Lazy query para traerme el content de los viajes 
  const [
    getShipment,
    {
      error: contentError,
      data: contentData,
    },
  ] = useLazyQuery(GET_SHIPMENT_DETAIL);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        await getShipment({
          variables: {
            shipment_id: shipment_id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchShipment();
  }, [getShipment, shipment_id, contentData]);

  console.log(shipment_id);
  console.log(contentData);
//funcion para convertir los segundos en formado dd-hh-mm-ss
const convertSeconds = (totalSeconds) => {
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const days = Math.floor(totalSeconds / (3600 * 24));

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const getTimestamp = (tick) => {
  let date = new Date(tick);
  const timezoneOffset = date.getTimezoneOffset();
  date.setHours(date.getHours() /* + (timezoneOffset / 60) */);

  var month = date.getMonth() + 1; // Los meses van de 0 a 11, por lo que hay que sumarle 1
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // el 0 se convierte en 12
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = month + "/" + day + " " + hours + ":" + minutes + " " + ampm;
  return strTime;
};

const [loading, setLoading] = useState(true);
const [dataState, setDataState] = useState();

//ESTRUCTURA DONDE SE VA A GUARDAR LA DATA QUE VA EN EL GRAFICO ----------------------------------------------------

let data = [
  {
    value: contentData?.shipment?.temperature_readings?.[0]?.cv ? contentData?.shipment?.temperature_readings?.[0]?.cv : contentData?.shipment?.temperature_readings?.[0]?.value,
    counter: 0,
    formattedCounter: "0d 0h 0m 0s",
    intrusion: 0,
    timestamp: contentData?.shipment?.temperature_readings?.[0]?.timestamp,
    millisec: Date.parse(contentData?.shipment?.temperature_readings?.[0]?.timestamp),
    max: contentData?.shipment?.temperature_range?.max,
    min:contentData?.shipment?.temperature_range?.min
  },
];
let ticks = [];
//RECORRO LA DATA CUANDO SE INICIALIZA EL COMPONENTE -------------------------------------------------
useEffect(() => {
  const fetchShipment = async () => {
    try {
      await getShipment({
        variables: {
          shipment_id: shipment_id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  fetchShipment();

  
  for (let i = 0; i < contentData?.shipment?.temperature_readings?.length; i++) {
    let hasIntrusion = false;

    for (let j = 0; j < contentData?.shipment?.intrusions?.length; j++) {
      if (contentData?.shipment?.temperature_readings?.[i]?.counter === contentData?.shipment?.intrusions[j].init_counter) {
        hasIntrusion = true;
        break;
      } else if (
        contentData?.shipment?.temperature_readings?.[i]?.counter === contentData?.shipment?.intrusions[j].final_counter
      ) {
        hasIntrusion = false;
      }
    }
    data.push({
      value: contentData?.shipment?.temperature_readings?.[i]?.cv ? contentData?.shipment?.temperature_readings?.[i]?.cv : contentData?.shipment?.temperature_readings?.[i]?.value,
      counter: contentData?.shipment?.temperature_readings[i]?.counter,
      formattedCounter: convertSeconds(contentData?.shipment?.temperature_readings[i]?.counter),
      intrusion: hasIntrusion ? 1 : 0,
      timestamp: contentData?.shipment?.temperature_readings[i]?.timestamp.toLocaleString(),
      millisec: Date.parse(contentData?.shipment?.temperature_readings[i]?.timestamp),
    
    });
  }

  setDataState(data);
}, [contentData]);

  return (
    <div>TempIntrusionChart{shipment_id}</div>
  );
};

export default TempIntrusionChart;