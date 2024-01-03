import { useLazyQuery, useQuery } from '@apollo/client';
import { company_id } from '../../../../../const';
import { GET_COMPANY_DETAIL } from 'queries';
import { GET_SHIPMENT_DETAIL } from 'queries';
import React, { useEffect, useState } from 'react'
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
    ReferenceLine, } from 'recharts';
import styles from './tempGraph.module.css'
import { Spinner } from 'reactstrap';
const TempGraph = ({shipment_id}) => {
  
    //query para traerme las branches de la compañia
    const {
        // loading: branchesLoading,
        error: branchesError,
        data: company_detail,
      } = useQuery(GET_COMPANY_DETAIL, {
        variables: {
          company_id:company_id
        },
      });
    // Lazy query para traerme el content de los viajes 
    const [
      getShipment,
      {
        error: contentError,
        data: contentData,
      },
    ] = useLazyQuery(GET_SHIPMENT_DETAIL);
  
    let checkpoints = contentData?.shipment?.checkpoints;
    let last_checkpoint = contentData?.shipment?.last_checkpoint;

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
        last_checkpoint: last_checkpoint?.temperature,
        last_responsible_name: last_checkpoint?.responsible_name,
        last_location: last_checkpoint?.location,
        last_label: last_checkpoint?.label,
      });
    }
    //pushear todos los checkpoints al array de datastate y luego ordenarlos x timestamp!!!!!!!!!!!
    checkpoints?.forEach((checkpoint) => {
      data.push({
        value: checkpoint ? checkpoint?.temperature : null,
        checkpoint: checkpoint ? checkpoint?.temperature : null, // Agregar el checkpoint
        responsible_name: checkpoint ? checkpoint?.responsible_name : null,
        location: checkpoint ? checkpoint?.location : "",
        label: checkpoint ? checkpoint?.label : "",
        timestamp: checkpoint?.timestamp.toLocaleString(),
        millisec: Date.parse(checkpoint?.timestamp),
        intrusion: checkpoint?.hall !== null ? checkpoint?.hall : 0,
      });
    });
    data.sort((a, b) => a.millisec - b.millisec);
    setDataState(data);
  }, [contentData, checkpoints]);
   //LOADING ---------------------------------------------------------------------------
  
   while (loading) {
    setTimeout(() => setLoading(false), 2000);
    return (
      <div className={styles.loading}>
        <Spinner />
      </div>
    );
  }
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const tooltipStyle = {
        background: "#ffffff",
        padding: "10px",
        border: "1px solid #ccc",
      };

      return (
        <div style={tooltipStyle}>
          <p style={{ display: "flex" }}>
            <div>{`Fecha: ${getTimestamp(label)}`}</div>

            {payload[0]?.payload?.checkpoint && (
              <div style={{ marginLeft: "10px" }}>
                {`Checkpoint: ${
                  payload[0]?.payload?.label ? payload[0]?.payload?.label : ""
                } - ${payload[0]?.payload?.location} - ${
                  payload[0]?.payload?.responsible_name
                }`}
              </div>
            )}
          </p>

          <p style={{ color: "#00ABC8" }}>Temp: {payload[0]?.value}°C</p>
          {payload[1]?.payload?.value && (
            <p style={{ color: "#FF001F" }}>
              {`Intrusion: ${
                payload[1]?.value === 1 || payload[1]?.value === 0
                  ? payload[1]?.value
                  : 0
              }`}
            </p>
          )}
        </div>
      );
    }

    return null;
  };


  return (
    dataState?.[1] ? (
        <div className={styles.graphContainer}>
          {/* GRAFICO solo para dropdown de reportes */}

          <ResponsiveContainer width="105%" height="84%">
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
              {/* EJE X */}

              <XAxis
                dataKey="millisec"
                type="number"
                ticks={dataState?.millisec}
                tick={{
                  color: "#00ABC8",
                  fontSize: "0.7vw",
                  fontFamily: "'Quattrocento Sans', sans-serif",
                }}
                tickMargin={6}
                tickLine={true}
                tickCount={20}
                //tickFormatter={(tick) => convertSeconds(tick)}
                //tickFormatter={getTimestamp}
                tickFormatter={getTimestamp}
                domain={["dataMin", "dataMax"]}
              ></XAxis>

              <YAxis
                yAxisId="left"
                dataKey="value"
                type="number"
                tick={{
                  color: "#00ABC8",
                  fontSize: "0.7vw",
                  fontFamily: "'Quattrocento Sans', sans-serif",
                }}
                tickCount={10}
                tickLine={true}
                padding={{ top: (window.screen.width * 6.25) / 100 }}
                domain={[0, "dataMax"]}
              >
                <Label
                  value={
                    localStorage.getItem("language") === "en"
                      ? "Temperature(°C)"
                      : "Temperatura(°C)"
                  }
                  angle={-90}
                  position="left"
                  fontFamily="'Quattrocento Sans', sans-serif"
                  fontSize="0.8vw"
                  fill="#00ABC8"
                  fontWeight="lighter"
                />
              </YAxis>

              <YAxis
                yAxisId="right"
                dataKey="intrusion"
                type="category"
                tick={{
                  color: "#00ABC8",
                  fontSize: "0.7vw",
                  fontFamily: "'Quattrocento Sans', sans-serif",
                }}
                tickMargin={6}
                tickCount={10}
                tickLine={false}
                orientation="right"
                padding={{ bottom: (window.screen.width * 20.8) / 100 }}
                domain={["0", "1"]}
              >
                <Label
                  value={
                    localStorage.getItem("language") === "en"
                      ? "Intrusions"
                      : "Intrusiones"
                  }
                  angle={-90}
                  position="insideRight"
                  fontFamily="'Quattrocento Sans', sans-serif"
                  fontSize="0.8vw"
                  fill="#FF001F"
                  fontWeight="lighter"
                />
              </YAxis>

              <Tooltip content={<CustomTooltip />} />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="value"
                stroke="#00ABC8"
                dot={false}
              />

              <Line
                yAxisId="right"
                type="step"
                dataKey="intrusion"
                stroke="#FF001F"
                dot={false}
              />
                 <Line
                yAxisId="left"
                type="monotone"
                dataKey="checkpoint"
                stroke="#00ABC8"
                dot={{ stroke: "#00ABC8", strokeWidth: 5, fill: "white" }}
              />
              <ReferenceLine
                y={data[0].max} // Usamos el valor máximo del primer punto de datos como ejemplo
                stroke="orange"
                strokeDasharray="5 5"
                label={`Max: ${data[0].max}`}
                yAxisId="left"
              />

              <ReferenceLine
                y={data[0].min} // Usamos el valor mínimo del primer punto de datos como ejemplo
                stroke="orange"
                strokeDasharray="5 5"
                label={`Min: ${data[0].min}`}
                yAxisId="left"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={styles.noData}>
            No data
        </div>
      )
  )
}

export default TempGraph