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
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(3),
  },
  textFld: { width: 300 },
}));

export default function Login({ history }) {
  const classes = useStyles();

  const [LoginData, setLoginData] = useState({
    login: "",
    password: "",
    showPassword: false,
    error: false,
    errorMsg: "",
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
      const { data } = await axios.post(
        "/api/auth/login",
        {
          email: LoginData.login,
          password: LoginData.password,
        },
        config
      );
      localStorage.setItem("authToken", data.token);
      history.push("/");
      setLoginData({
        ...LoginData,
        error: false,
      });
    } catch (error) {
      setLoginData({
        ...LoginData,
        error: true,
        errorMsg: error.response.data.error,
      });
      setTimeout(() => {
        setLoginData({
          ...LoginData,
          error: true,
          errorMsg: "",
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
      <div className="loginBox">
        {/* <Typography component="h1" variant="h4">
              LOGO
            </Typography> */}
        <Grid></Grid>

        <div className="loginForm">
          <Typography className={classes.margin} component="h1" variant="h4">
            Sign In
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
                  error={LoginData.error}
                  id="login"
                  label={LoginData.errorMsg ? LoginData.errorMsg : "E-mail"}
                  onChange={handleChange("login")}
                  className={classes.textFld}
                  value={LoginData.login}
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
              alignContent="space-around"
            >
              {/* PASSWORD */}

              <Grid item>
                <VpnKeySharp />
              </Grid>

              <Grid item>
                <FormControl error={LoginData.error}>
                  <InputLabel htmlFor="standard-adornment-password">
                    {LoginData.errorMsg ? LoginData.errorMsg : "Password"}
                  </InputLabel>
                  <Input
                    id="password"
                    className={classes.textFld}
                    type={LoginData.showPassword ? "text" : "password"}
                    value={LoginData.password}
                    onChange={handleChange("password")}
                    inputProps={{ tabIndex: "2" }}
                    // helper text for an error
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
                  {/* <FormHelperText id="component-error-text">
                    {LoginData.errorMsg}
                  </FormHelperText> */}
                </FormControl>
              </Grid>
            </Grid>
            <Grid>
              <Link to="/fpassword" className="fpassword-link">
                Forgot account?
              </Link>
            </Grid>

            <Button
              className={classes.margin}
              color="primary"
              variant="contained"
              tabIndex="3"
              type="submit"
            >
              Sign In
            </Button>
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
