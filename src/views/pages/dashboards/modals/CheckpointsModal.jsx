import { useLazyQuery, useQuery } from "@apollo/client";

import { convertirHoraLocal } from "helpers";
import { GET_SHIPMENT_DETAIL } from "queries";
import React, { useEffect } from "react";
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
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HotelIcon from "@mui/icons-material/Hotel";
import RepeatIcon from "@mui/icons-material/Repeat";
import Typography from "@mui/material/Typography";

import "react-vertical-timeline-component/style.min.css";
import { createTheme } from "@mui/material";
import { Badge, CardBody, Spinner } from "reactstrap";

const CheckpointsModal = ({ shipment_id, dropdown }) => {
  //queries
  const [
    getShipment,
    {
       loading: contentLoading,
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
        
        } catch (error) {
          console.log(error);
        }
      };
      getShipmentDetail();
    }
  }, [shipment_id, contentData]);

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
if(contentLoading) return(
<div
style={{margin:"auto", width:"100%", textAlign:"center"}}
>
<Spinner className="spinner"/> 
</div>
)
 
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
                  variant="body2"
                  color="text.primary"
                >
                  {convertirHoraLocal(c?.timestamp, company_detail.company.gmt)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                <TimelineConnector style={{ backgroundColor: i === 0 && "transparent" } } />
                  <TimelineDot color={i === 0 ? "primary" : "grey"} />

                  <TimelineConnector style={{ backgroundColor: i === contentData?.shipment?.checkpoints?.length - 1 && "transparent" } } />
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
                    {c.location}
                  </Typography>
                  <Typography>
                    {c?.temperature ? ` (${c?.temperature}°C)` : ""} 
                  </Typography>
                  <Typography>
                     {c?.responsible_name} 
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </div>
      {/* para dropdown */}

      {contentData?.shipment?.status !== "TRANSIT" && (
        <div style={{ overflow: "auto" , paddingTop:"8%"}}>
          <div
            style={{
              fontSize: "1vw",
              color: "#1B1464",
              textAlign: "center",
              position: "sticky",
              top: "2%",
              zIndex: 1000, // Ajusta según sea necesario
              backgroundColor: "#fff", // Ajusta según sea necesario
              // border:"solid red 1px"
            }}
          >
            Time in transit (DD/HH/MM/SS): <br />
            {totalDuration ? convertSeconds(totalDuration) : ""}
          </div>
          <br />
          <div
            style={{
              display: "flex",
              marginLeft: "-30px",
              width: "100%",
              // border:"solid red 1px",
              // position: "relative",
            }}
          >
            <Timeline align="left">
              {contentData?.shipment?.checkpoints?.map((c, i) => (
                <TimelineItem key={i}>
                  <TimelineSeparator>
                    <TimelineDot
                      color={
                        i === 0 ||
                        i === contentData?.shipment?.checkpoints?.length - 1
                          ? "primary"
                          : "grey"
                      }
                    />
                    {i !== contentData?.shipment?.checkpoints?.length - 1 && (
                      <TimelineConnector />
                    )}
                  </TimelineSeparator>
                  <TimelineContent sx={{ minWidth: "150px" }}>
                    <Typography variant="h6">
                      {convertirHoraLocal(
                        c?.timestamp,
                        company_detail.company.gmt
                      )}
                    </Typography>
                    <Typography variant="h6" component="span">
                      {c.location}
                    </Typography>
                    <Typography>
                      {c?.temperature ? ` (${c?.temperature}°C)` : ""}
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
