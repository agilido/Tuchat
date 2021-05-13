import React, { useState, useEffect } from "react";
import "./styles.css";
import { TextField, Button, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { green } from "@material-ui/core/colors";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import axios from "axios";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import SendIcon from "@material-ui/icons/Send";
import FormHelperText from "@material-ui/core/FormHelperText";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2.5),
  },
  textFld: { width: 300 },
  root: {
    display: "flex",
    alignItems: "center",
  },
  helper: {
    position: "absolute",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    left: 136,
    top: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function ForgotPassword({ history }) {
  const classes = useStyles();

  const [fpasswordData, setfpasswordData] = useState({
    email: "",
  });
  const [ReqState, setReqState] = useState({
    error: false,
    errorMsg: "",
    errorTxtMsg: "",
    loading: false,
    success: false,
    successMsg: "",
  });

  const buttonSubmit = clsx({
    [classes.buttonSuccess]: ReqState.success,
  });

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/");
    }
  }, [history]);

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
      if (!fpasswordData.email) {
        setReqState({
          error: true,
          errorMsg: "Please enter an e-mail address",
        });
        return setTimeout(() => {
          setReqState({
            error: false,
            errorMsg: "",
          });
        }, 5000);
      }

      if (!/\S+@\S+\.\S+/.test(fpasswordData.email)) {
        setReqState({
          error: true,
          errorMsg: "Please enter valid e-mail address",
        });
        return setTimeout(() => {
          setReqState({
            error: false,
            errorMsg: "",
          });
        }, 5000);
      }

      setReqState({ loading: true });

      const { data } = await axios.post(
        "/api/auth/fpassword",
        { email: fpasswordData.email },
        config
      );

      setReqState({
        loading: false,
        success: true,
        successMsg: data.data,
        error: false,
        errorMsg: "",
      });
    } catch (error) {
      localStorage.removeItem("authToken");
      if (error.response.status == 500) {
        setReqState({
          loading: false,
          error: true,
          errorTxtMsg: "Unable to connect to server",
        });
      } else {
        setReqState({
          loading: false,
          error: true,
          errorMsg: error.response.data.error,
        });
        setTimeout(() => {
          setReqState({
            error: false,
            errorMsg: "",
          });
        }, 5000);
      }
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
      <div className="registerBox">
        <div className="loginForm">
          <Typography className={classes.margin} component="h1" variant="h5">
            Reset Your Password
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
                  error={ReqState.error}
                  label="E-mail address"
                  onChange={handleChange("email")}
                  className={classes.textFld}
                  value={fpasswordData.email}
                  // helper text for an error
                />
                <FormHelperText
                  error={ReqState.error}
                  className={classes.helper}
                >
                  {ReqState.errorMsg && ReqState.errorMsg}
                </FormHelperText>
                <Typography style={{ marginTop: "20px" }} variant="h6">
                  {ReqState.successMsg ? ReqState.successMsg : null}
                  {ReqState.errorTxtMsg ? ReqState.errorTxtMsg : null}
                </Typography>
              </Grid>
            </Grid>
            <div className={classes.wrapper}>
              <Fab
                aria-label="send"
                color="primary"
                className={buttonSubmit}
                type="submit"
                disabled={ReqState.loading}
              >
                {ReqState.success ? <CheckIcon /> : <SendIcon />}
              </Fab>
              {ReqState.loading && (
                <CircularProgress size={68} className={classes.fabProgress} />
              )}
            </div>

            <Grid
              className={classes.margin}
              container
              spacing={1}
              alignItems="flex-end"
            ></Grid>
          </form>

          <Link to="/login">
            <Button
              variant="outlined"
              color="primary"
              style={{
                margin: "10px",
                marginBottom: "25px",
                maxWidth: "100px",
              }}
            >
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </Grid>
  );
}
