import React from "react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  ReferenceArea,
} from "recharts";

import styles from "./shipmentsToCompare.module.css";
import { convertirHoraLocal } from "helpers";

const ShipmentsToCompare = ({ dataToCompare, gmt }) => {
  console.log("esta es la data");
  console.log(dataToCompare);
 
  const [loading, setLoading] = useState(true);
  const [dataState, setDataState] = useState([]);
  const [ticksState, setTicksState] = useState([]);
  const colors = ["#E0271F", "#77E01F", "#1FD8E0", "pink", "orange"];

  //ESTRUCTURA DONDE SE VA A GUARDAR LA DATA QUE VA EN EL GRAFICO ----------------------------------------------------
  let data = [];
  let ticks = [];

  //RECORRO LA DATA CUANDO SE INICIALIZA EL COMPONENTE -------------------------------------------------
  useEffect(() => {
    dataToCompare?.shipmentsToCompare?.forEach((ship, i) => {
      console.log(ship);
      ship.temperature_readings.forEach((temp) => {
        data.push({
          [`#${ship.shipment_id.split("-")[1]}`]: temp.cv
            ? temp.cv
            : temp.value,
          counter: Date.parse(temp.timestamp),
          value: temp.cv ? temp.cv : temp.value,
        });
      });
    });

    setDataState([...dataState, data]);

    data.forEach((data) => {
      ticks.push(data.counter);
    });

    ticks.sort((a, b) => a - b);
    setTicksState(
      ticks.filter((item, i) => {
        return ticks.indexOf(item) === i;
      })
    );
  }, [dataToCompare]);

  // LOADING ---------------------------------------------------------------------------
  while (loading) {
    setTimeout(() => setLoading(false), 2000);
    return (
      <>
        <div
          className={styles.loading}
          data-loading-text={
            localStorage.getItem("language") === "es"
              ? "Comparando..."
              : "Comparing..."
          }
        ></div>

        {/* <div className={styles.loadingSpinner}>
          <CircularProgress />
        </div> */}
      </>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={dataState[0]}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="counter"
          /* interval={0} */
          scale="time"
          type="number"
          ticks={ticksState}
          tick={{
            color: "#00ABC8",
            fontSize: "0.7vw",
            fontFamily: "'Quattrocento Sans', sans-serif",
          }}
          tickMargin={6}
          tickLine={true}
          tickFormatter={(tick) => convertirHoraLocal(tick, gmt)}
          domain={["auto", "auto"]}
        />

        <YAxis>
          <Label
            value={
              localStorage.getItem("language") === "en"
                ? "Temperature(°C)"
                : "Temperatura(°C)"
            }
            angle={-90}
            position="left"
            fontFamily="'Quattrocento Sans', sans-serif"
            fontSize="1vw"
            fill="#00ABC8"
            fontWeight="lighter"
          />
        </YAxis>

        <Tooltip
          labelFormatter={(label) => `Fecha: ${convertirHoraLocal(label, gmt)}`}
          formatter={(value) => `Valor: ${value}`}
        />
        <Legend />
        {dataToCompare.shipmentsToCompare.map((ship, i) => {
          return (
            <Line
              key={ship.shipment_id}
              type="monotone"
              dataKey={`#${ship.shipment_id.split("-")[1]}`}
              stroke={colors[i]}
              dot={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ShipmentsToCompare;
