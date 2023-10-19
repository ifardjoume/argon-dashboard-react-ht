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
const CheckpointsModal = ({ shipment_id }) => {
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
    const getShipmentDetail = async () => {
      await getShipment({ variables: { shipment_id } });
    };
    getShipmentDetail();
    console.log("desde el efect");
    console.log(contentData);
  }, [shipment_id, contentData]);

  return (
    <VerticalTimeline lineColor="#ddd" layout="one-column">
    {contentData?.shipment?.checkpoints?.map((c, i) => (
      <VerticalTimelineElement
        className="vertical-timeline-element--work custom-line" /* Agrega la clase personalizada aquí */
        //date={convertirHoraLocal(c?.timestamp, company_detail.company.gmt)}
        iconStyle={i==0? {background: "rgb(33, 150, 243)", color:"rgb(33, 150, 243)"}: { background: "rgb(33, 150, 243)", color: "#fff"} }
        icon={<BsCircleFill />}
      >
        <h3 className="vertical-timeline-element-title">{c.location} - {convertirHoraLocal(c?.timestamp, company_detail.company.gmt)}</h3>
        <h4 className="vertical-timeline-element-subtitle">
          {c.temperature ? ` (${c?.temperature}°C)` : ""} - {c.responsible_name}
        </h4>
        
      </VerticalTimelineElement>
    ))}
  </VerticalTimeline>
  );
};

export default CheckpointsModal;
