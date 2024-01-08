import { useLazyQuery, useQuery } from "@apollo/client";

import { convertirHoraLocal } from "helpers";
import { GET_SHIPMENT_DETAIL } from "queries";
import React, { useEffect, useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import styles from "./checkpointModal.module.css";
import { GET_COMPANY_DETAIL } from "queries";
import { company_id } from "../../../../const";
// import {
//   VerticalTimeline,
//   VerticalTimelineElement,
// } from "react-vertical-timeline-component";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";

import "react-vertical-timeline-component/style.min.css";
import { checkboxClasses, createTheme } from "@mui/material";
import { Badge, CardBody, Spinner } from "reactstrap";

const CheckpointsModal = ({ shipment_id, dropdown,checkpointsData  }) => {
  const[filteredCheckpoints,setFilteredCheckpoints]=useState([])
  //queries

  const [
    getShipment,
    { loading: contentLoading, error: contentError, data: contentData },
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
        } catch (error) {
          console.log(error);
        }
      };
      getShipmentDetail();
    }
    setFilteredCheckpoints(checkpointsData)
    console.log(checkpointsData)
  }, [shipment_id, contentData, checkpointsData]);

  let totalDuration = null;

  if (dropdown) {
    totalDuration =
      contentData?.shipment?.acceleration[
        contentData?.shipment?.acceleration?.length - 1
      ]?.counter;
  }

  const convertSeconds = (totalSeconds) => {
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const days = Math.floor(totalSeconds / (3600 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  if (contentLoading)
    return (
      <div style={{ margin: "auto", width: "100%", textAlign: "center" }}>
        <Spinner className="spinner" />
      </div>
    );

  return (
    <>
      <div style={{ overflow: "auto", maxHeight: "60vh" }}>
        {contentData?.shipment?.status === "TRANSIT" && (
          <Timeline>
            {contentData?.shipment?.checkpoints?.map((c, i) => (
              <TimelineItem key={i}>
                <TimelineOppositeContent
                  sx={{ m: "auto 0" }}
                  align="right"
                  // variant="body2"
                  color="text.primary"
                  variant="h6"
                >
                  <div style={{ color: "#1B1464" }}>
                    {
                      convertirHoraLocal(
                        c?.timestamp,
                        company_detail.company.gmt
                      ).split("  ")[0]
                    }{" "}
                    -{" "}
                    {
                      convertirHoraLocal(
                        c?.timestamp,
                        company_detail.company.gmt
                      ).split("  ")[1]
                    }{" "}
                    <br />
                    <strong>
                      {c?.temperature ? ` ${c?.temperature}°C` : ""}
                    </strong>
                  </div>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector
                    style={{ backgroundColor: i === 0 && "transparent" }}
                  />
                  <TimelineDot
                    style={{
                      backgroundColor:
                        i === contentData?.shipment?.checkpoints?.length - 1
                          ? "#00ABC8"
                          : "#bdbdbd",
                      //color: i === data?.shipment?.checkpoints?.length - 1 ? "#FFFFFF" : "#000000" // Puedes ajustar el color del texto según tu diseño
                    }}
                  />

                  <TimelineConnector
                    style={{
                      backgroundColor:
                        i === contentData?.shipment?.checkpoints?.length - 1 &&
                        "transparent",
                    }}
                  />
                </TimelineSeparator>
                <TimelineContent
                  sx={{ py: "12px", px: 2 }}
                  className={
                    i === 0 ||
                    i === contentData?.shipment?.checkpoints?.length - 1
                      ? "special"
                      : ""
                  }
                >
                  <Typography variant="h6" component="span">
                    <div style={{ color: "#00AAC8" }}>
                      {c.label ? `${c.label}: ${c?.location}` : c.location}
                    </div>
                  </Typography>

                  <Typography variant="h6">{c?.responsible_name}</Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </div>
      {/* para dropdown */}

      {contentData?.shipment?.status !== "TRANSIT" && (
        <div style={{ overflow: "auto", paddingTop: "8%", height: "50vh", width:"100%" }}>
          <div
            style={{
              display: "flex",
              marginLeft: "-3vw",
              width: "100%",
              // border:"solid red 1px",
              // position: "relative",
            }}
          >
          
            <Timeline align="left">
      
              {filteredCheckpoints?.checkpoints?.map((c, i) => (
                <TimelineItem key={i}>
                  <TimelineSeparator>
                    <TimelineDot
                      style={{
                        backgroundColor:
                          i === filteredCheckpoints?.checkpoints?.length - 1
                            ? "#00ABC8"
                            : "#bdbdbd",
                        //color: i === data?.shipment?.checkpoints?.length - 1 ? "#FFFFFF" : "#000000" // Puedes ajustar el color del texto según tu diseño
                      }}
                    />
                    {i !== filteredCheckpoints?.checkpoints?.length -1 && (
                      <TimelineConnector />
                    )}
                  </TimelineSeparator>
                  <TimelineContent sx={{ minWidth: "150px" }}>
                    <Typography variant="h6">
                      {convertirHoraLocal(
                        c?.timestamp,
                        company_detail?.company?.gmt
                      )}
                    </Typography>
                    <Typography variant="h6">
                      {c?.temperature ? ` ${c?.temperature.toFixed(2)}°C` : ""}
                    </Typography>
                    <Typography variant="h6" component="span">
                      {c.location}
                      <div
                        style={{
                          display: "flex",
                          // justifyContent: "space-between",
                        }}
                      >
                  
                        {c?.label && (
                          <label
                            style={{
                              // backgroundColor: "#00ABC8",
                              color: "#00ABC8",
                              fontSize: "0.8vw",
                              display: "flex",
                              //justifyContent: "center",
                              alignItems: "center",
                              // padding: "0.2vw",
                              // borderRadius: "0.3vw",
                              // width: "5.5vw",
                            }}
                          >
                            {c?.label}
                          </label>
                        )}
                      </div>
                    </Typography>

                    <Typography>{c?.responsible_name}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckpointsModal;
