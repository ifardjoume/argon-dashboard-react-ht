import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis, 
  Tooltip,
  Legend,
 
} from "recharts";
import styles from './accelerationGraph.module.css'
import { GET_SHIPMENT_DETAIL } from "queries";
import { Spinner } from "reactstrap";
const AccelerationGraph = ({shipment_id}) => {
    const [ticksState, setTicksState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataState, setDataState] = useState([]);
  
    // query para data de graficos
    const [
      getShipment,
      {
        // loading: contentLoading,
        error: contentError,
        data: contentData,
      },
    ] = useLazyQuery(GET_SHIPMENT_DETAIL);
  
    //ESTRUCTURA DONDE SE VA A GUARDAR LA DATA QUE VA EN EL GRAFICO ----------------------------------------------------
    let data2 = [
      {
        counter: contentData?.shipment?.acceleration[0]?.counter,
        timestamp: contentData?.shipment?.acceleration[0]?.timestamp,
        millisec: Date.parse(contentData?.shipment?.acceleration[0]?.timestamp),
        x: contentData?.shipment?.acceleration[0]?.x,
        y: contentData?.shipment?.acceleration[0]?.y,
        z: contentData?.shipment?.acceleration[0]?.z,
      },
    ];
    let ticks = [];
  
  
    const getTimestamp = (tick) => {
      let date = new Date(tick);
      const timezoneOffset = date.getTimezoneOffset();
      date.setHours(date.getHours() /* + (timezoneOffset / 60) */);
  
      var month = date.getMonth() + 1; // Los meses van de 0 a 11, por lo que hay que sumarle 1
      var day = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // el 0 se convierte en 12
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = month + '/' + day + ' ' + hours + ':' + minutes + ' ' + ampm;
      return strTime;
  
    }
    const [data, setData] = useState({});
  
    useEffect(() => {
      const fetchShipments = async () => {
        try {
          await getShipment({ variables: { shipment_id } });
          // setData(contentData);
  
        } catch (error) {
          console.log(error);
        }
      };
      fetchShipments();
      for (let i = 0; i < contentData?.shipment?.acceleration?.length; i++) {
  
        data2.push({
          counter: contentData?.shipment?.acceleration[i]?.counter,
          timestamp: contentData?.shipment?.acceleration[i]?.timestamp?.toLocaleString(),
          millisec: Date.parse(contentData?.shipment?.acceleration[i]?.timestamp),
          x: contentData?.shipment?.acceleration[i]?.x,
          y: contentData?.shipment?.acceleration[i]?.y,
          z: contentData?.shipment?.acceleration[i]?.z,
        });
  
        setDataState(data2);
      }
  
  
    }, [contentData]);
  
    //seteo los ticks para el grafico
  
    useEffect(() => {
      dataState?.forEach((d) => {
        ticks.push(
          {
            counter: d?.counter,
            timestamp: d?.timestamp,
            millisec: Date.parse(d?.timestamp)
          }
        );
      });
  
      setTicksState(ticks);
  
    }, [dataState]);
  
    while (loading) {
      setTimeout(() => setLoading(false), 2000);
      return (
        <div className={styles.loading}>
        Loading...
        </div>
      );
    }
    return (
      <div className={styles.graphContainer}>
        {data2?.shipment?.acceleration?.length === 0 ? (
          localStorage.getItem("language") === "es" ? (
            <div className={styles.noData_msj}>No hay datos</div>
          ) : (
            <div className={styles.noData_msj}>No data</div>
          )
        ) : (
          <>
  
            <ResponsiveContainer width="97%" height="88%">
              <LineChart
                width="50%"
                height="50%"
                data={dataState}
                margin={{
                  top: window.screen.width < 1050 ? 2 : 6,
                  right: window.screen.width < 1050 ? 10 : 30,
                  left: 18,
                  bottom: 9,
                }}
              >
              
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis
                  dataKey="millisec"
                  // scale='time'
                  type="number"
                  ticks={ticksState?.millisec}
                  tick={{
                    color: "#00ABC8",
                    fontSize: "0.7vw",
                    fontFamily: "'Quattrocento Sans', sans-serif",
                  }}
                  tickMargin={6}
                  tickLine={true}
                  tickCount={10}
                  //tickFormatter={(tick) => convertSeconds(tick)}
                  tickFormatter={getTimestamp}
                  domain={['dataMin', 'dataMax']}
                >
                  {/* <Label
                    value={
                      localStorage.getItem("language") === "en"
                        ? "Time (days-hours-minutes-seconds)"
                        : "Tiempo (días-horas-minutos-segundos)"
                    }
                    offset={-8}
                    position="insideBottom"
                    fontFamily="'Quattrocento Sans', sans-serif"
                    fontSize="0.8vw"
                    stroke="#1B1464"
                    strokeWidth={0.3}
                  /> */}
                </XAxis>
                <YAxis
                  allowDataOverflow={true}
                  type="number"
                  yAxisId="1"
                  domain={["auto", "auto"]}
                  tick={{
                    color: "#00ABC8",
                    fontSize: "0.7vw",
                    fontFamily: "'Quattrocento Sans', sans-serif",
                  }}
                  tickCount={10}
                  tickLine={true}
                  padding={{ top: (window.screen.width * 6.25) / 300 }}
                >
                  <Label
                    value={
                      localStorage.getItem("language") === "en"
                        ? "Acceleration(G)"
                        : "Aceleracion(G)"
                    }
                    angle={-90}
                    position="left"
                    fontFamily="'Quattrocento Sans', sans-serif"
                    fontSize="0.8vw"
                    fill="#00ABC8"
                    fontWeight="lighter"
                  />
                </YAxis>
                <Tooltip
                    labelFormatter={(label) => `Fecha: ${getTimestamp(label)}`} 
                    formatter={(value) => `Valor: ${value}`}
                  />
                  <Legend />
                <Line
                  yAxisId="1"
                  type="monotone"
                  dataKey="x"
                  stroke="mediumaquamarine"
                  dot={false}
                // animationDuration={300}
                />
                <Line
                  yAxisId="1"
                  type="monotone"
                  dataKey="y"
                  stroke="orange"
                  // animationDuration={300}
                  dot={false}
                />
                <Line
                  yAxisId="1"
                  type="monotone"
                  dataKey="z"
                  stroke="steelBlue"
                  // animationDuration={300}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className={styles.textContainer}>
              <div className={styles.text}>
                X: <div className={styles.textLineBlue}></div>
              </div>
              <div className={styles.text}>
                Y: <div className={styles.textLineYellow}></div>
              </div>
              <div className={styles.text}>
                Z: <div className={styles.textLineCyan}></div>
              </div>
            </div>
          </>
        )}
      </div>
    );
}

export default AccelerationGraph