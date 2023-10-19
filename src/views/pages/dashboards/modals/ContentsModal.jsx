import { useLazyQuery, useQuery } from "@apollo/client";

import { convertirHoraLocal } from "helpers";
import { GET_SHIPMENT_DETAIL } from "queries";
import React, { useEffect } from "react";
import styles from "./contentsModal.module.css";
import { GET_COMPANY_DETAIL } from "queries";
import { company_id } from "../../../../const";
import { Spinner } from "reactstrap";
import "../../../../assets/css/myCss/global.css";
import Barcode from "react-barcode";

const ContentsModal = ({ shipment_id }) => {
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
if(shipment_id){
    const getShipmentDetail = async () => {
      await getShipment({ variables: { shipment_id } });
    };
    getShipmentDetail();
    console.log("desde el efect");
    console.log(contentData); 
}
   

  }, [shipment_id, contentData]);

  return (
    <>
      {contentLoading && <Spinner className="spinner" />}

      {contentData?.shipment?.contents.length !== 0 ? (
        <div className={styles.modalContent}>
          {contentData?.shipment?.contents?.map((ship) => (
            <div className={styles.modalData} key={ship.id}>
              {/* {generateBarcode(ship.id)} */}
              <Barcode
                value={ship.id}
                width={(window.screen.width * 0.18) / 100}
                height={(window.screen.width * 2) / 100}
                fontSize={(window.screen.width * 1.02) / 100}
                textAlign="center"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.modalLoading}>
          {/* <Spinner className="spinner" /> */}No contents to show
        </div>
      )}
    </>
  );
};

export default ContentsModal;
