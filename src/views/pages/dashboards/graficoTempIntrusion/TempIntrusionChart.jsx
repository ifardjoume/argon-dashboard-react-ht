import { useLazyQuery } from '@apollo/client';
import { GET_SHIPMENT_DETAIL } from 'queries';
import React, { useEffect } from 'react';

const TempIntrusionChart = ({ shipment_id }) => {
  // Lazy query para traerme el content de los viajes 
  const [
    getShipment,
    {
      error: contentError,
      data: contentData,
    },
  ] = useLazyQuery(GET_SHIPMENT_DETAIL);

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

  console.log(shipment_id);
  console.log(contentData);

  return (
    <div>TempIntrusionChart{shipment_id}</div>
  );
};

export default TempIntrusionChart;