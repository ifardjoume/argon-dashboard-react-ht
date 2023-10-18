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

  // return (
  //   <div className={styles.checkpointsBox}>
  //               <div className={styles.modalTitleContainer}>Checkpoints</div>

  //               <div className={styles.checksYDatas}>
  //                 <div className={styles.checks}>
  //                   {contentData?.shipment?.checkpoints?.map((c, i) => {
  //                     return (
  //                       <div className={styles.eachCheckpoint} key={i + 56}>
  //                         <div className={styles.iconAndLine}>
  //                           <BsCircleFill
  //                             className={
  //                               // contentData?.shipment?.checkpoints?.indexOf(c) ===
  //                               //   contentData?.shipment?.checkpoints?.length - 1 ||
  //                               contentData?.shipment?.checkpoints?.indexOf(
  //                                 c
  //                               ) === 0
  //                                 ? styles.checkpointsIcon2
  //                                 : styles.checkpointsIcon
  //                             }
  //                           />
  //                           {contentData?.shipment?.checkpoints?.indexOf(c) !==
  //                             contentData?.shipment?.checkpoints?.length -
  //                               1 && (
  //                             <div className={styles.intermediateLine}></div>
  //                           )}
  //                         </div>
  //                         <div className={styles.labName}>{c?.location}</div>
  //                       </div>
  //                     );
  //                   })}
  //                 </div>
  //                 <div className={styles.datas}>
  //                   {contentData?.shipment?.checkpoints?.map((c, i) => {
  //                     return (
  //                       <div className={styles.checkDate} key={i + 65}>
  //                         {convertirHoraLocal(
  //                           c?.timestamp,
  //                           company_detail.company.gmt
  //                         )}{" "}
  //                         - {c.temperature ? ` (${c?.temperature}°C)` : ""}
  //                       </div>
  //                     );
  //                   })}
  //                 </div>
  //               </div>
  //             </div>
  // )

  //   return (
  //     <div className={styles.container}>
  //       <div className={styles.check_data}>
  //         <div className={styles.check}>
  //           {contentData?.shipment?.checkpoints?.map((c, i) => {
  //             return (
  //               <>
  //                 <div className={styles.eachCheckpoint} key={i + 56}>
  //                   <BsCircleFill /> {c?.location}
  //                 </div>
  //                 <div className={styles.lineContainer}>
  //                     <div className={styles.line}></div>
  //                 </div>
  //               </>
  //             );
  //           })}
  //         </div>
  //         <div className={styles.data}>
  //           {contentData?.shipment?.checkpoints?.map((c, i) => {
  //             return (
  //                 <>
  //                  <div key={i + 65}>
  //                 {convertirHoraLocal(c?.timestamp, company_detail.company.gmt)} -{" "}
  //                 {c.temperature ? ` (${c?.temperature}°C)` : ""}
  //               </div>
  //               <div className={styles.lineContainer}>
  //               <div className={styles.lineInvisible}></div>
  //               </div>
  //                 </>

  //             );
  //           })}
  //         </div>
  //       </div>
  //     </div>
  //   );
  return (
    <VerticalTimeline
    lineColor="#ddd"
    className={styles.container}
     layout="one-column"
    >
        
      {contentData?.shipment?.checkpoints?.map((c, i) => (
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
        //  contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          //contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
          date=  {convertirHoraLocal(c?.timestamp, company_detail.company.gmt)}
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={<BsCircleFill />}
        
        >
          <h3 className="vertical-timeline-element-title">{c.location}</h3>
          <h4 className="vertical-timeline-element-subtitle">
            {c.temperature ? ` (${c?.temperature}°C)` : ""}
          </h4>
          {/* <h5 className="vertical-timeline-element-subtitle">
            {c.responsible_name}
          </h5> */}
         
          <p>
          {c.responsible_name}
          </p>
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
};

export default CheckpointsModal;
