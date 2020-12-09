import { Container, TextField } from "@material-ui/core";
import React, { Component } from "react";
import "./login.css";
export class Login extends Component {
  render() {
    return (
      <div className="loginBox">
        <Container maxWidth="sm">
          <TextField id="standard-basic" label="Standard" color="secondary" />
          <TextField id="standard-basic" label="Standard" />
        </Container>
      </div>
    ); //TODO: STWÓRZY FORMULARZ LOGOWANIA
  }
}

export default Login;
