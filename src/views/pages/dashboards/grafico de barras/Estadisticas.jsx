import React, { useState, useEffect, useContext } from "react";


import { useSubscription } from "@apollo/client";
//import { SHIPMENTS_UPDATED_SUBSCRIPTION } from "../../queries";
import axios from "axios";
//import { FormattedMessage } from "react-intl";
import styles from "./estadisticas.module.css";
import { SHIPMENTS_UPDATED_SUBSCRIPTION } from "queries";
import { SERVER_URL, company_id } from "const";
import FilterDayMonth from "context/filterDayMonth";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function Estadisticas() {
  const { initialDayMonth, setInitialDayMonth } = useContext(FilterDayMonth);

  const token = localStorage.getItem("token");
  const [filterData, setFilterData] = useState("allShips");
  const [info, setInfo] = useState({});

  //traigo la data por mes/semana segun el filtro
  //  async function fetchData(type, company_id) {
  //     const request = await axios.get(
  //       `${SERVER_URL}/getAllValues/${company_id}/${type}`,
  //       { headers: { authorization: `Bearer ${token}` } }
  //     );

  //     request
  //       .then((result) => {
  //         setInfo(result.data?.values?.[0]);
  //       })
  //       .catch((error) => console.error("Error:", error));
  //   }

  // QUERIES/MUTATIONS/SUBSCRIPTIONS -----------------------------------------------------------------------
  //subscription de viajes terminados
  const {
    // loading: updatedShipLoading,
    // error: updatedShipError,
    data: updatedShipData,
  } = useSubscription(SHIPMENTS_UPDATED_SUBSCRIPTION);

  // CUANDO SE INICIA EL COMPONENTE -------------------------------------------------------------------------
  useEffect(() => {
    // fetchData(initialDayMonth, company_id);
    console.log("desde grafico");
try {
 const fetch2 = async () => {
      const request = await axios.get(
        `${SERVER_URL}/getAllValues/${company_id}/${initialDayMonth}`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      console.log(request.data.values[0]);
      setInfo(request?.data?.values?.[0])
    };
    fetch2()    
} catch (error) {
   console.log(error)
   console.log('error tratando de traer la data de estadisticas') 
}
    
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

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        {initialDayMonth === "day" && "Weekly stadistics"}
        {initialDayMonth === "month" && " Annual stadistics"}
        <div className={styles.textContainer}>
        {initialDayMonth === "month" ? (
          <span className={styles.text}>*Last 12 months</span>
        ) : (
          <span className={styles.text}>*Last 7 days</span>
        )}
      </div>
      </h2>
   
      {/* Filtros por estado */}
      <span className={styles.buttonsTitle}> Filter</span>
      <div className={styles.buttonsContainer}>
        <button
          className={
            filterData === "allShips"
              ? styles.filterButton1Selected
              : styles.filterButton1
          }
          value="allShips"
          onClick={handleFilters}
        >
          Completed
        </button>
        <button
          className={
            filterData === "succShips"
              ? styles.filterButton2Selected
              : styles.filterButton2
          }
          value="succShips"
          onClick={handleFilters}
        >
          Succeeded
        </button>
        <button
          className={
            filterData === "uncertShips"
              ? styles.filterButton3Selected
              : styles.filterButton3
          }
          value="uncertShips"
          onClick={handleFilters}
        >
          Uncertain
        </button>
        <button
          className={
            filterData === "failShips"
              ? styles.filterButton4Selected
              : styles.filterButton4
          }
          value="failShips"
          onClick={handleFilters}
        >
          Failed
        </button>
      </div>
      {/* Grafico  */}
      <div className={styles.graphContainer}>
        {console.log("info", weekData)}
        <ResponsiveContainer width="100%" height="100%" >
        <BarChart
          data={initialDayMonth === "month" ? yearData : weekData}
          barSize={10}
          stackOffset={"none"}
          className={styles.stadisticGraph}
        style={{  left:"-10px" }}
        >
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis
            dataKey="name"
           /*  padding={{ left: window.screen.width <= 450 ? 0 : 8 }} */
            tickLine={false}
            tick={{
              fontSize: window.screen.width > 800 ? "0.8vw" : "2vw",
              color: "#1B1464",
            }}
          
          />
          <YAxis
            type="number"
            tick={{
              fontSize: window.screen.width > 800 ? "0.8vw" : "2vw",
              color: "#1B1464",
            }}
            allowDecimals={false}
          />
          <Bar
            dataKey="x"
            stackId="a"
            fill="#2dce89"//verde
            radius={[12, 10, 10, 12]}
          />
          <Bar
            dataKey="y"
            stackId="a"
            fill="#5e72e4"//amarillo
            radius={[12, 10, 10, 12]}
          />
          <Bar
            dataKey="z"
            stackId="a"
            fill="#f5365c"//rojo
            radius={[12, 10, 10, 12]}
          />
        </BarChart>
        </ResponsiveContainer>
       
      
      </div>
     
    
    </div>
  );

// const data = [
//     {
//       name: 'Page A',
//       uv: 4000,
//       pv: 2400,
//       amt: 2400,
//     },
//     {
//       name: 'Page B',
//       uv: 3000,
//       pv: 1398,
//       amt: 2210,
//     },
//     {
//       name: 'Page C',
//       uv: 2000,
//       pv: 9800,
//       amt: 2290,
//     },
//     {
//       name: 'Page D',
//       uv: 2780,
//       pv: 3908,
//       amt: 2000,
//     },
//     {
//       name: 'Page E',
//       uv: 1890,
//       pv: 4800,
//       amt: 2181,
//     },
//     {
//       name: 'Page F',
//       uv: 2390,
//       pv: 3800,
//       amt: 2500,
//     },
//     {
//       name: 'Page G',
//       uv: 3490,
//       pv: 4300,
//       amt: 2100,
//     },
//   ];
//   return (

//       <BarChart
//         width={500}
//         height={300}
//         data={data}
//         margin={{
//           top: 20,
//           right: 30,
//           left: 20,
//           bottom: 5,
//         }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
       
       
//         <Bar dataKey="pv" stackId="a" fill="#8884d8" />
//         <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
//       </BarChart>
  
//   );
}
