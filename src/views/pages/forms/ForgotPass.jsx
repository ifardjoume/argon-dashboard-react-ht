import React from "react";
// react component used to create sweet alerts
import ReactBSAlert from "react-bootstrap-sweetalert";
// reactstrap components
import { Button } from "reactstrap";

class ForgotPass extends React.Component {
  state = {};
  
  infoAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          info
          style={{ display: "block", marginTop: "-100px" }}
          title="Info"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          confirmBtnText="Ok"
          btnSize=""
        >
          A few words about this sweet alert ...
        </ReactBSAlert>
      )
    });
  };
 
  
 
  hideAlert = () => {
    this.setState({
      alert: null
    });
  };
  render() {
    return (
      <>
        {this.state.alert}
        <a href="#"onClick={this.infoAlert} >Forgot password?</a>
      </>
    );
  }
}

export default ForgotPass;