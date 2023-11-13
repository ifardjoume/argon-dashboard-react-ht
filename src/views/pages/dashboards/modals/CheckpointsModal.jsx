import { useLazyQuery, useQuery } from "@apollo/client";

import { convertirHoraLocal } from "helpers";
import { GET_SHIPMENT_DETAIL } from "queries";
import React, { useEffect } from "react";
import { BsCircleFill } from "react-icons/bs";
import styles from "./checkpointModal.module.css";
import { GET_COMPANY_DETAIL } from "queries";
import { company_id } from "../../../../const";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { widgetEvents } from "variables/general";
const CheckpointsModal = ({ shipment_id, gmt }) => {
  //queries
  const [
    getShipment,
    {
      // loading: contentLoading,
      error: contentError,
      data: contentData,
    },
  ] = useLazyQuery(GET_SHIPMENT_DETAIL);

  //query para traerme las branches de la compañia
  const {
    // loading: branchesLoading,
    error: branchesError,
    data: company_detail,
  } = useQuery(GET_COMPANY_DETAIL, {
    variables: {
      company_id,
    },
  });

  useEffect(() => {
    if (shipment_id) {
      const getShipmentDetail = async () => {
        try {
          await getShipment({ variables: { shipment_id } });
          console.log("desde el efect");
          console.log(contentData);
        } catch (error) {
          console.log(error);
        }
      };
      getShipmentDetail();
    }
  }, [shipment_id, contentData]);
  const totalDuration =
    contentData?.shipment?.acceleration[
      contentData?.shipment?.acceleration?.length - 1
    ]?.counter;

  const convertSeconds = (totalSeconds) => {
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const days = Math.floor(totalSeconds / (3600 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div style={{ overflow: "auto", maxHeight: "60vh" }}>
      {contentData?.shipment?.status === "TRANSIT" ? (
        <VerticalTimeline lineColor="#ddd" layout="one-column">
          {contentData?.shipment?.checkpoints?.map((c, i) => (
            <VerticalTimelineElement
              className="vertical-timeline-element--work custom-line" /* Agrega la clase personalizada aquí */
              iconStyle={
                i == 0
                  ? {
                      background: "rgb(33, 150, 243)",
                      color: "rgb(33, 150, 243)",
                    }
                  : { background: "rgb(33, 150, 243)", color: "#fff" }
                  
              }
              icon={<BsCircleFill  />} 
              key={c.id}
            >
              <h3
                className="vertical-timeline-element-title"
                style={{ fontSize: "20px" }}
              >
                {c.location} -{" "}
                {convertirHoraLocal(c?.timestamp, gmt)}
              </h3>
              <h4
                className="vertical-timeline-element-subtitle"
                style={{ fontSize: "15px" }}
              >
                {c.temperature ? ` (${c?.temperature}°C)` : ""} -{" "}
                {c.responsible_name}
              </h4>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      ) : (
        <>
        {/* para dropdown */}
          {/* <div
            style={{
              fontSize: "1vw",
              color: "#1B1464",
              textAlign: "center",
              position: "sticky",
              top: 0,
              zIndex: 1000, // Ajusta según sea necesario
              backgroundColor: "#fff", // Ajusta según sea necesario
            }}
          >
            Time in transit (DD/HH/MM/SS): <br />
            {totalDuration ? convertSeconds(totalDuration) : ""}
          </div>
          <br />

          <VerticalTimeline lineColor="#ddd" layout="one-column" >
            {contentData?.shipment?.checkpoints?.map((c, i, checkpoints) => {
              const isLastCheckpoint = i === checkpoints.length - 1;
              
              return (
                <VerticalTimelineElement
                  className="vertical-timeline-element--work custom-line"
                  iconStyle={
                    i === 0 || isLastCheckpoint
                      ? {
                          background: "rgb(33, 150, 243)",
                          color: "rgb(33, 150, 243)",
                          borderBottom: isLastCheckpoint ? "none" : "",
                             
                        }
                      : { background: "rgb(33, 150, 243)", color: "#fff", display:"flex" }
                  }
                
                  icon={<BsCircleFill  />}
                  key={c.id}
                >
                  <h3
                    className="vertical-timeline-element-title"
                    style={{ fontSize: "1vw" }}
                  >
                    {c.location}
                  </h3>
                  <h3
                    className="vertical-timeline-element-title"
                    style={{ fontSize: "0.8vw" }}
                  >
                    {convertirHoraLocal(
                      c?.timestamp,
                      company_detail.company.gmt
                    )}
                  </h3>
                  <h4
                    className="vertical-timeline-element-subtitle"
                    style={{ fontSize: "0.8vw" }}
                  >
                    {c.temperature ? ` (${c?.temperature}°C)` : ""} -{" "}
                    {c.responsible_name}
                  </h4>
                </VerticalTimelineElement>
              );
            })}
          </VerticalTimeline> */}

          <>
          <div
            style={{
              fontSize: "1vw",
              color: "#1B1464",
              textAlign: "center",
              position: "sticky",
              top: 0,
              zIndex: 1000, // Ajusta según sea necesario
              backgroundColor: "#fff", // Ajusta según sea necesario
              marginTop:"2%",
              marginBottom:"2%"
            }}
          >
            Time in transit (DD/HH/MM/SS): <br />
            {totalDuration ? convertSeconds(totalDuration) : ""}
          </div>
          <br />
            <div className={styles.gOnlychecksYDatas}>
          <div className={styles.gOnlyChecks}>
            {contentData?.shipment?.checkpoints?.map((c, i) => {
              return (
                <div className={styles.gOnlyEachCheckpoint} key={i + 56}>
                  <div className={styles.gOnlyiconAndLine}>
                    <BsCircleFill
                      className={
                        // contentData?.shipment?.checkpoints?.indexOf(c) ===
                        //   contentData?.shipment?.checkpoints?.length - 1 ||
                        contentData?.shipment?.checkpoints?.indexOf(c) === 0
                          ? styles.gOnlyCheckpointsIcon2
                          : styles.gOnlyCheckpointsIcon
                      }
                    />
                    {contentData?.shipment?.checkpoints?.indexOf(c) !==
                      contentData?.shipment?.checkpoints?.length - 1 && (
                      <div className={styles.gOnly_intermediateLine}></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* checpoints */}
          <div className={styles.gOnlyDatas}>
            {contentData?.shipment?.checkpoints?.map((c, i) => {
              return (
                <div className={styles.gOnlyCheckDate} key={i + 65}>
                  <div className={styles.gOnlyLabName}>
                    {c?.location} - {c?.responsible_name}
                  </div>

                  <div className={styles.gOnlyDate_Temperature}>
                    {/* {getTimestamp(c?.timestamp)} -{" "} */}
                    {convertirHoraLocal(c?.timestamp,gmt)}{""}
                    {c.temperature ? ` (${c?.temperature}°C)` : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
          </>
        
        </>
      )}
    </div>
  );
};

export default CheckpointsModal;
