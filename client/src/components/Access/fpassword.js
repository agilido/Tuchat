import React, { useState } from "react";
import "./authPage.css";
import { TextField, Button, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import FormHelperText from "@material-ui/core/FormHelperText";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2.5),
  },
  textFld: { width: 300 },
}));

export default function ForgotPassword() {
  const classes = useStyles();

  const [fpasswordData, setfpasswordData] = useState({
    email: "",
    error: false,
    errorMsg: "",
    success: "",
    successMsg: "",
  });

  const handleChange = (prop) => (event) => {
    setfpasswordData({ ...fpasswordData, [prop]: event.target.value });
  };

  const handlefpassword = async (event) => {
    event.preventDefault();
    const config = {
      header: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      const { data } = await axios.post(
        "/api/auth/fpassword",
        { email: fpasswordData.email },
        config
      );
      setfpasswordData({
        ...fpasswordData,
        success: true,
        successMsg: "Reset password e-mail sent.",
        error: false,
        errorMsg: "",
      });
    } catch (error) {
      localStorage.removeItem("authToken");
      setfpasswordData({
        ...fpasswordData,
        error: true,
        errorMsg: error.response.data.error,
      });
    }
  };

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <div className="loginBox">
        <div className="loginForm">
          <Typography className={classes.margin} component="h1" variant="h4">
            Find Your Account
          </Typography>
          <Typography className={classes.margin} component="h1" variant="body1">
            <p>
              Please enter your email <br></br> to search for your account.
            </p>
          </Typography>
          <form onSubmit={handlefpassword} noValidate>
            <Grid
              className={classes.margin}
              container
              spacing={2}
              alignItems="flex-end"
            >
              {/* email */}

              <Grid item>
                <TextField
                  id="login"
                  label="E-mail address"
                  onChange={handleChange("email")}
                  className={classes.textFld}
                  value={fpasswordData.email}
                  // helper text for an error
                />
                <FormHelperText error id="component-error-text">
                  {fpasswordData.errorMsg ? fpasswordData.errorMsg : null}
                </FormHelperText>
                <FormHelperText id="component-error-text">
                  {fpasswordData.successMsg}
                </FormHelperText>
              </Grid>
            </Grid>
            <Button
              className={classes.margin}
              color="primary"
              variant="contained"
              type="submit"
            >
              Send
            </Button>
            <Grid
              className={classes.margin}
              container
              spacing={1}
              alignItems="flex-end"
            ></Grid>
          </form>
          <p>
            <Link to="/login">
              <Button
                variant="outlined"
                color="primary"
                style={{ margin: "10px", maxWidth: "100px" }}
              >
                Cancel
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </Grid>
  );
}
