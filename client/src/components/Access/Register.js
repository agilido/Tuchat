import React, { useState, useEffect } from "react";
import "./styles.css";
import { TextField, Button, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AccountCircle from "@material-ui/icons/AccountCircle";
import EmailIcon from "@material-ui/icons/Email";
import VpnKeySharp from "@material-ui/icons/VpnKeySharp";
import LockIcon from "@material-ui/icons/Lock";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import FormHelperText from "@material-ui/core/FormHelperText";
import axios from "axios";
// gitfix
const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
  },
  margin: {
    margin: theme.spacing(3),
  },
  helper: {
    position: "absolute",
  },
  textFld: { width: 300 },
  wrapper: {
    margin: theme.spacing(3),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
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

export default function Register({ history }) {
  const classes = useStyles();

  const [RegisterData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
  });
  const [ReqState, setReqState] = useState({
    error: false,
    errorMsg: "",
    errorTxtMsg: "",
    emailErr: false,
    emailErrMsg: "",
    passError: false,
    passErrMsg: "",
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
    setRegisterData({ ...RegisterData, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setRegisterData({
      ...RegisterData,
      showPassword: !RegisterData.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  function emailIsValid(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleRegister = async (event) => {
    event.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    if (!RegisterData.password || !RegisterData.username) {
      setReqState({
        error: true,
        errorMsg: "Required",
      });
      return setTimeout(() => {
        setReqState({
          error: false,
          errorMsg: "",
        });
      }, 5000);
    }
    if (!emailIsValid(RegisterData.email)) {
      setReqState({
        emailErr: true,
        emailErrMsg: "E-mail address is invalid",
      });
      setTimeout(() => {
        setReqState({
          emailErr: false,
          emailErrMsg: "",
        });
      }, 5000);
    }

    if (RegisterData.password !== RegisterData.confirmPassword) {
      return setReqState({
        passError: true,
        passErrMsg: "Passwords do not match",
      });
    }

    try {
      setReqState({ loading: true });
      const { data } = await axios.post(
        "/api/auth/register",
        {
          username: RegisterData.username,
          email: RegisterData.email,
          password: RegisterData.password,
        },
        config
      );
      setReqState({
        error: false,
        loading: false,
        success: true,
      });
    } catch (error) {
      if (error.response.status == 500) {
        return setReqState({
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
        {/* <Typography component="h1" variant="h4">
              LOGO
            </Typography> */}
        <Grid></Grid>

        <div className="registerForm">
          <Typography className={classes.margin} component="h1" variant="h4">
            Sign Up
          </Typography>
          <form onSubmit={handleRegister} noValidate autoComplete="off">
            <Grid
              className={classes.margin}
              container
              spacing={1}
              alignItems="flex-end"
            >
              {/* USERNAME */}

              <Grid item>
                <AccountCircle />
              </Grid>
              <Grid item>
                <TextField
                  error={
                    ReqState.error &&
                    ReqState.errorMsg !== "Please enter valid e-mail address"
                  }
                  id="username"
                  label="Username"
                  onChange={handleChange("username")}
                  className={classes.textFld}
                  value={RegisterData.username}
                  inputProps={{ tabIndex: "1" }}
                />
                <FormHelperText
                  error={ReqState.passError || ReqState.error}
                  className={classes.helper}
                >
                  {(ReqState.error &&
                    ReqState.errorMsg !== "E-mail already exists" &&
                    ReqState.errorMsg !==
                      "Please enter valid e-mail address") ||
                  !RegisterData.username
                    ? ReqState.errorMsg
                    : null}
                </FormHelperText>
              </Grid>
            </Grid>

            <Grid
              className={classes.margin}
              container
              spacing={1}
              alignItems="flex-end"
            >
              {/* E-Mail */}

              <Grid item>
                <EmailIcon />
              </Grid>
              <Grid item>
                <TextField
                  error={ReqState.emailErr || ReqState.errorMsg}
                  id="email"
                  label="E-mail"
                  onChange={handleChange("email")}
                  className={classes.textFld}
                  value={RegisterData.email}
                  inputProps={{ tabIndex: "2" }}
                />
                <FormHelperText
                  error={ReqState.emailErr || ReqState.error}
                  className={classes.helper}
                >
                  {ReqState.emailErr ||
                  (ReqState.error &&
                    ReqState.errorMsg !== "Username already exists") ||
                  !RegisterData.email
                    ? ReqState.errorMsg || ReqState.emailErrMsg
                    : null}
                </FormHelperText>
              </Grid>
            </Grid>

            <Grid
              className={classes.margin}
              container
              spacing={1}
              alignItems="flex-end"
            >
              {/* PASSWORD */}

              <Grid item>
                <VpnKeySharp />
              </Grid>

              <Grid item>
                <FormControl
                  error={
                    ReqState.passError ||
                    (ReqState.errorMsg &&
                      ReqState.errorMsg !== "Please enter valid e-mail address")
                  }
                >
                  <InputLabel htmlFor="standard-adornment-password">
                    Password
                  </InputLabel>
                  <Input
                    id="password"
                    className={classes.textFld}
                    type={RegisterData.showPassword ? "text" : "password"}
                    value={RegisterData.password}
                    inputProps={{ tabIndex: "3" }}
                    onChange={handleChange("password")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {RegisterData.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormHelperText
                  error={ReqState.passError || ReqState.error}
                  className={classes.helper}
                >
                  {ReqState.passError ||
                  (ReqState.errorMsg &&
                    !RegisterData.password &&
                    ReqState.errorMsg !== "Please enter valid e-mail address")
                    ? ReqState.errorMsg
                    : null}
                </FormHelperText>
              </Grid>
            </Grid>

            <Grid
              className={classes.margin}
              container
              spacing={1}
              alignItems="flex-end"
            >
              {/* CONFIRM PASSWORD */}

              <Grid item>
                <LockIcon />
              </Grid>

              <Grid item>
                <FormControl
                  error={
                    ReqState.passError ||
                    (ReqState.errorMsg &&
                      ReqState.errorMsg !== "Please enter valid e-mail address")
                  }
                >
                  <InputLabel htmlFor="standard-adornment-password">
                    Confirm Password
                  </InputLabel>
                  <Input
                    id="password"
                    className={classes.textFld}
                    type={RegisterData.showPassword ? "text" : "password"}
                    value={RegisterData.confirmPassword}
                    inputProps={{ tabIndex: "4" }}
                    onChange={handleChange("confirmPassword")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {RegisterData.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormHelperText
                  error={ReqState.error || ReqState.passError}
                  className={classes.helper}
                >
                  {ReqState.passError ||
                  (ReqState.errorMsg &&
                    !RegisterData.password &&
                    ReqState.errorMsg !== "Please enter valid e-mail address")
                    ? ReqState.passErrMsg || ReqState.errorMsg
                    : null}
                </FormHelperText>
              </Grid>
            </Grid>
            <Typography variant="h6">
              {ReqState.successMsg ? ReqState.successMsg : null}
              {ReqState.errorTxtMsg ? ReqState.errorTxtMsg : null}
            </Typography>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                tabIndex="5"
                className={buttonSubmit}
                disabled={ReqState.loading}
                style={{ marginTop: "10px" }}
              >
                Register
              </Button>
              {ReqState.loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </form>
          <Grid className="loginSignup">
            <Typography style={{ marginBottom: "20px" }} variant="body1">
              Have an account?{" "}
              <Link to="/login">
                <Button
                  variant="outlined"
                  color="primary"
                  tabIndex="6"
                  style={{ margin: "10px", maxWidth: "100px" }}
                >
                  Log In
                </Button>
              </Link>
            </Typography>
          </Grid>
        </div>
      </div>
    </Grid>
  );
}
