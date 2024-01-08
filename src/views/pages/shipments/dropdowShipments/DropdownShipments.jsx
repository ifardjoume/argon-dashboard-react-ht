import React from "react";
import styles from "../shipments.module.css";
import TempGraph from "./tempGraph/tempGraph";
import AccelerationGraph from "./accelerationGraph/AccelerationGraph";

import Comments from "views/pages/dashboards/modals/Comments";
import CheckpointsModal from "views/pages/dashboards/modals/CheckpointsModal";

const DropdownShipments = ({ shipment_id,data}) => {

  return (
    <div className={styles.dropdownShipments}>
      <div className={styles.temp_acc_check_container}>
        <div className={styles.tempGraphContainer}>
          <TempGraph shipment_id={shipment_id} />
        </div>
        <div className={styles.accelerationGraphContainer}>
          <AccelerationGraph shipment_id={shipment_id} />
        </div>
        <div className={styles.checkpointsContainer}>
        
            <CheckpointsModal
              shipment_id={shipment_id}
              dropdown={true}
              checkpointsData={data}
            />
       
        </div>
      </div>

      <div className={styles.commentsContainer}>
        <Comments shipment_id={shipment_id} />
      </div>
    </div>
  );
};

export default DropdownShipments;
