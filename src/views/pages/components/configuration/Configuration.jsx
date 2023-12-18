import React, { useState } from "react";
import { Collapse, Card, CardBody } from "reactstrap";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";

const AccordionItem = ({ title, isOpen, onToggle, children }) => (
  <>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#f0f0f0",
        padding: "10px",
        cursor: "pointer",
        border: "1px solid #ccc",
      }}
      onClick={onToggle}
    >
      <h3>{title}</h3>
      {isOpen ? <BsChevronUp /> : <BsChevronDown />}
    </div>
    <Collapse isOpen={isOpen}>
      <Card>
        <CardBody style={{ marginBottom: 0, border: "solid red 1px" }}>
          {/* Contenido del acordeón */}
          {children}
        </CardBody>
      </Card>
    </Collapse>
  </>
);

const Configuration = () => {
  const [isOpen, setIsOpen] = useState({
    company: false,
    branches: false,
    users: false,
    checkpoints: false,
    operators: false,
    temperature_alerts: false,
    rc_static: false,
    devices: false,
  });

  const toggleAccordion = (accordion) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [accordion]: !prevState[accordion],
    }));
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Settings</h1>
      <div style={{ width: "80%", margin: "auto" }}>

        {/* company */}
        <AccordionItem
          title="My company"
          isOpen={isOpen.company}
          onToggle={() => toggleAccordion("company")}
        >
          <p>Información del acordeón...</p>
        </AccordionItem>

        {/* branches */}
        <AccordionItem
          title="My branches"
          isOpen={isOpen.branches}
          onToggle={() => toggleAccordion("branches")}
        >
          <p>Información del acordeón...</p>
        </AccordionItem>

        {/* operators */}
        <AccordionItem
          title="My operators"
          isOpen={isOpen.operators}
          onToggle={() => toggleAccordion("operators")}
        >
          <p>Información del acordeón...</p>
        </AccordionItem>

        {/* users*/}
        <AccordionItem
          title="My users"
          isOpen={isOpen.users}
          onToggle={() => toggleAccordion("users")}
        >
          <p>Información del acordeón...</p>
        </AccordionItem>

        {/* checkpoints*/}
        <AccordionItem
          title="My checkpoints"
          isOpen={isOpen.checkpoints}
          onToggle={() => toggleAccordion("checkpoints")}
        >
          <p>Información del acordeón...</p>
        </AccordionItem>

        {/* temperature_alerts */}
        <AccordionItem
          title="Temperature alerts"
          isOpen={isOpen.temperature_alerts}
          onToggle={() => toggleAccordion("temperature_alerts")}
        >
          <p>Información del acordeón...</p>
        </AccordionItem>

        {/* rc_static */}
        <AccordionItem
          title="RC+Static"
          isOpen={isOpen.rc_static}
          onToggle={() => toggleAccordion("rc_static")}
        >
          <p>Información del acordeón...</p>
        </AccordionItem>
        
        {/* devices */}
        <AccordionItem
          title="My devices"
          isOpen={isOpen.devices}
          onToggle={() => toggleAccordion("devices")}
        >
          <p>Información del acordeón...</p>
        </AccordionItem>
      </div>
    </>
  );
};

export default Configuration;
