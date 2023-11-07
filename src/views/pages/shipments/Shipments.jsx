import React from "react";
import { FormGroup, Form, Input, Row, Col, Label, Button } from "reactstrap";
import styles from "./shipments.module.css";

const Shipments = () => {
      //estado para guardarme la info filtrada
  const [filters, setFilters] = useState({
    status: null,
    from_date: "",
    to_date: "",
    origin_id: "",
    origin_op_id: "",
    destination_id: "",
    destination_op_id: "",
    item_id: "",
    in_transit: false,
    qr: "",
    shipment_id: "",
  });
//HANDLERS ---------------------------------------------------------------------------------------------
  //handler cuando cambio filtros
  const handleChange = function (e) {
    if (e.target.value === "") {
      setFilters({
        ...filters,
        [e.target.name]: null,
      });
    } else {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handelSubmit = function (e) {
    e.preventDefault();
    console.log(filters);
  }
  return (
    <div style={{ width: "100%", height: "100vh" }}>
        <h2>Reports</h2>
      <Form className={styles.form}>
        <div className={styles.subContainer}>
           <FormGroup className={styles.origin_destination}>
          {/* origin */}
          <Label for="example-text-input" className={styles.label}>Origin</Label>
          <Input
            type="select"
            name="origin_id"
            id="example-select"
            className={styles.input}
            onChange={handleChange}
          >
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
            <option>Option 4</option>
            <option>Option 5</option>
          </Input>
          {/* destination */}
          <Label for="example-text-input" className={styles.label}>Destination</Label>
          <Input
            type="select"
            name="destination_id"
            id="example-select"
            className={styles.input}
            onChange={handleChange}
          >
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
            <option>Option 4</option>
            <option>Option 5</option>
          </Input>
        </FormGroup>

        <FormGroup className={styles.from_to}>
          {/* from */}
          <Label for="example-date-input" className={styles.label}>From</Label>
          <Input
            defaultValue={new Date().getFullYear() + "-11-23"}
            id="example-date-input"
            type="date"
            className={styles.input}
            name="from_date"
            onChange={handleChange}
          />
          {/* to */}
          <Label for="example-date-input" className={styles.label}>To</Label>
          <Input
            defaultValue={new Date().getFullYear() + "-11-23"}
            id="example-date-input"
            type="date"
            className={styles.input}
           name="to_date"
           onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className={styles.sender_receiver}>
          {/* sender */}
          <Label for="example-text-input" className={styles.label}>Sender</Label>
          <Input
            type="select"
            name="origin_op_id"
            id="example-select"
            className={styles.input}
            onChange={handleChange}
          >
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
            <option>Option 4</option>
            <option>Option 5</option>
          </Input>
          {/* receiver */}
          <Label for="example-text-input" className={styles.label}>Receiver</Label>
          <Input
            type="select"
            name="destination_op_id"
            id="example-select"
            className={styles.input}
            onChange={handleChange}
          >
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
            <option>Option 4</option>
            <option>Option 5</option>
          </Input>
        </FormGroup>  
        </div>
       

        <FormGroup className={styles.status_barcode_qr}>
          {/* shipment status */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
         
            }}
          >
            <Label for="example-text-input" className={styles.label}>Status</Label>
            <Input
              type="select"
              name="status"
              id="example-select"
              className={styles.input}
              onChange={handleChange}
            >
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </Input>
          </div>

          {/* BARCODE */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            
            }}
          >
            <Label for="example-date-input" className={styles.label}>Barcode</Label>
            <Input type="text" className={styles.input} name="barcode" onChange={handleChange} />
          </div>

          {/* qr */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
           
            }}
          >
            <Label for="example-date-input" className={styles.label}>Qr</Label>
            <Input type="text" className={styles.input} name="qr" onChange={handleChange}/>
          </div>

          {/* id */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
           
            }}
          >
            <Label for="example-date-input" className={styles.label}>Id</Label>
            <Input type="text" className={styles.input} name="shipment_id" onChange={handleChange}/>
          </div>
        </FormGroup>
        <div className={styles.buttons}>

        <Button className="btn-icon btn-3" color="primary" type="button" onClick={handelSubmit}>
          <span className="btn-inner--icon">
          <i class="fa-solid fa-magnifying-glass"></i>
          </span>
          <span className="btn-inner--text">Search</span>
        </Button>

          <Button className={styles.button}>Compare</Button>
          <Button className={styles.button}>Clear</Button>
        </div>
      </Form>
    </div>
  );
};

export default Shipments;
