import React, { useState, useEffect } from "react";
import "./authPage.css";
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
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(3),
  },
  textFld: { width: 300 },
}));

export default function Register({ handleLoginVisibility }) {
  const classes = useStyles();

  const [RegisterData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    error: false,
    errorMsg: "",
    passError: false,
  });

  let history = useHistory();

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

  const handleRegister = async (event) => {
    event.preventDefault();
    console.log("handle register triggered");
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    if (!RegisterData.password || !RegisterData.username) {
      return setRegisterData({
        ...RegisterData,
        error: true,
        errorMsg: "Please provide data",
      });
    }
    if (RegisterData.password !== RegisterData.confirmPassword) {
      console.log("passwords do not match");

      setRegisterData({ ...RegisterData, password: "", confirmPassword: "" });
      setTimeout(() => {
        setRegisterData({ ...RegisterData, passError: false, errorMsg: "" });
      }, 5000);
      // AddExtraProps(FormControl, "error");
      return setRegisterData({
        ...RegisterData,
        passError: true,
        errorMsg: "Passwords do not match",
      });
    }
    try {
      const { data } = await axios.post(
        "/api/auth/register",
        {
          username: RegisterData.username,
          email: RegisterData.email,
          password: RegisterData.password,
        },
        config
      );
      localStorage.setItem("authToken", data.token);
      setRegisterData({
        ...RegisterData,
        error: false,
      });
    } catch (error) {
      setRegisterData({
        ...RegisterData,
        error: true,
        errorMsg: error.response.data.error,
      });
      console.log("axios error" + RegisterData.errorMsg);
      setTimeout(() => {
        setRegisterData({
          ...RegisterData,
          error: true,
          errorMsg: error.response.data.error,
        });
      }, 5000);
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
                  error={RegisterData.error}
                  id="username"
                  label="User name"
                  onChange={handleChange("username")}
                  className={classes.textFld}
                  value={RegisterData.username}
                  inputProps={{ tabIndex: "1" }}
                  // helper text for an error
                />
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
                  error={RegisterData.error}
                  id="email"
                  label="E-mail address"
                  onChange={handleChange("email")}
                  className={classes.textFld}
                  value={RegisterData.email}
                  inputProps={{ tabIndex: "2" }}
                  // helper text for an error
                />
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
                  error={RegisterData.passError || RegisterData.error}
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
                  error={RegisterData.passError || RegisterData.error}
                >
                  <InputLabel htmlFor="standard-adornment-password">
                    Confirm password
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
              </Grid>
            </Grid>
            <Button
              className={classes.margin}
              color="primary"
              variant="contained"
              type="submit"
              tabIndex="5"
            >
              Register
            </Button>
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
                  Sign In
                </Button>
              </Link>
            </Typography>
          </Grid>
        </div>
      </div>
    </Grid>
  );
}
