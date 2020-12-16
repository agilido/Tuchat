import React, { useState } from "react";
import "./login.css";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
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

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(3),
  },
  textFld: { width: 300 },
}));

export default function Login() {
  const classes = useStyles();

  const [LoginData, setLoginData] = useState({
    login: "",
    password: "",
    showPassword: false,
    error: false,
  });

  const handleChange = (prop) => (event) => {
    setLoginData({ ...LoginData, [prop]: event.target.value });
    console.log("xd");
  };

  const handleClickShowPassword = () => {
    setLoginData({ ...LoginData, showPassword: !LoginData.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    // TODO: handlelogin
  };

  // function AddExtraProps(Component, extraProps) {
  //   return <Component.type {...Component.props} {...extraProps} />;
  // } TODO: ERROR HANDLING

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Paper elevation={3}>
        <div className="loginBox">
          <div className="loginPad">
            <Typography className={classes.margin} component="h1" variant="h4">
              LOGO
            </Typography>
          </div>
          {/* LOGIN PAD ONLY ON PCS, NO ON MOBILE */}

          <div className="loginForm">
            <Typography className={classes.margin} component="h1" variant="h4">
              Sign in
            </Typography>
            <form noValidate autoComplete="off">
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
                    id="login"
                    label="Username or e-mail address"
                    onChange={handleChange("login")}
                    className={classes.textFld}
                    value={LoginData.login}
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
                  <FormControl>
                    <InputLabel htmlFor="standard-adornment-password">
                      Password
                    </InputLabel>
                    <Input
                      id="password"
                      className={classes.textFld}
                      type={LoginData.showPassword ? "text" : "password"}
                      value={LoginData.password}
                      onChange={handleChange("password")}
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
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                className={classes.margin}
                color="primary"
                variant="contained"
              >
                Sign In
              </Button>
            </form>
            <Grid className="loginSignup">
              <Typography variant="body1">
                <p>
                  Don't have an account?{" "}
                  <Button color="primary">Sign up</Button>
                </p>
              </Typography>
            </Grid>
          </div>
        </div>
      </Paper>
    </Grid>
  );
}
