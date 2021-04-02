import React, { useState, useEffect } from "react";
import "./authPage.css";
import { TextField, Button, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AccountCircle from "@material-ui/icons/AccountCircle";
import VpnKeySharp from "@material-ui/icons/VpnKeySharp";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import { Link } from "react-router-dom";
import clsx from "clsx";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(3),
  },
  textFld: { width: 300 },
  helper: {
    position: "absolute",
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
    top: "74%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function Login({ history }) {
  const classes = useStyles();

  const [LoginData, setLoginData] = useState({
    login: "",
    password: "",
    showPassword: false,
  });
  const [ReqState, setReqState] = useState({
    error: false,
    errorMsg: "",
    errorTxtMsg: "",
    loading: false,
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
    setLoginData({ ...LoginData, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setLoginData({ ...LoginData, showPassword: !LoginData.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      if (!LoginData.login || !LoginData.password) {
        setReqState({ error: true, errorMsg: "Required" });
        return setTimeout(() => {
          setReqState({
            error: false,
            errorMsg: "",
          });
        }, 5000);
      }
      setReqState({ loading: true });
      const { data } = await axios.post(
        "/api/auth/login",
        {
          email: LoginData.login,
          username: LoginData.login,
          password: LoginData.password,
        },
        config
      );
      localStorage.setItem("authToken", data.token);
      history.push("/");
      setReqState({
        error: false,
        errorMsg: "",
      });
    } catch (error) {
      if (error.response.status === 500) {
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
      <div className="loginBox">
        {/* <Typography component="h1" variant="h4">
              LOGO
            </Typography> */}
        <Grid></Grid>

        <div className="loginForm">
          <Typography className={classes.margin} component="h1" variant="h4">
            Log In
          </Typography>

          <form onSubmit={handleLogin} noValidate autoComplete="off">
            <Grid
              className={classes.margin}
              container
              spacing={1}
              alignItems="flex-end"
            >
              {/* LOGIN */}

              <Grid item>
                <AccountCircle />
              </Grid>
              <Grid item>
                <TextField
                  error={ReqState.error}
                  id="login"
                  label="Username or E-mail"
                  onChange={handleChange("login")}
                  className={classes.textFld}
                  value={LoginData.login}
                  inputProps={{ tabIndex: "1" }}
                  // helper text for an error
                />
                <FormHelperText
                  error={ReqState.error}
                  className={classes.helper}
                >
                  {ReqState.errorMsg && ReqState.errorMsg}
                </FormHelperText>
              </Grid>
            </Grid>
            <Grid
              className={classes.margin}
              container
              spacing={1}
              alignItems="flex-end"
              alignContent="space-around"
            >
              {/* PASSWORD */}

              <Grid item>
                <VpnKeySharp />
              </Grid>

              <Grid item>
                <FormControl error={ReqState.error}>
                  <InputLabel htmlFor="standard-adornment-password">
                    Password
                  </InputLabel>
                  <Input
                    id="password"
                    className={classes.textFld}
                    type={LoginData.showPassword ? "text" : "password"}
                    value={LoginData.password}
                    onChange={handleChange("password")}
                    inputProps={{ tabIndex: "2" }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {LoginData.showPassword ? (
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
                  error={ReqState.error}
                  className={classes.helper}
                >
                  {ReqState.errorMsg && ReqState.errorMsg}
                </FormHelperText>
              </Grid>
            </Grid>
            <Grid>
              <Link to="/fpassword" className="fpassword-link">
                Forgot account?
              </Link>
            </Grid>

            <Typography style={{ marginTop: "7px" }} variant="h6">
              {ReqState.errorTxtMsg ? ReqState.errorTxtMsg : null}
            </Typography>

            <Button
              className={classes.buttonSubmit}
              color="primary"
              variant="contained"
              tabIndex="3"
              type="submit"
              style={{ margin: "12px" }}
              disabled={ReqState.loading}
            >
              Log in
            </Button>
            {ReqState.loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </form>
          <Grid className="loginSignup">
            <Typography style={{ marginBottom: "20px" }} variant="body1">
              Don't have an account?{" "}
              <Link to="/register">
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ margin: "10px", maxWidth: "100px" }}
                >
                  Sign up
                </Button>
              </Link>
            </Typography>
          </Grid>
        </div>
      </div>
    </Grid>
  );
}
