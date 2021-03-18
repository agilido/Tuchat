import React, { useState } from "react";
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
import { Link } from 'react-router-dom';

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
  });
  const handleChange = (prop) => (event) => {
    setRegisterData({ ...RegisterData, [prop]: event.target.value });
    console.log("xd");
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
        {/* LOGIN PAD ONLY ON PCS, NOT ON MOBILE */}

        <div className="registerForm">
          <Typography className={classes.margin} component="h1" variant="h4">
            Sign Up
          </Typography>
          <form noValidate autoComplete="off">
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
                  id="username"
                  label="User name"
                  onChange={handleChange("username")}
                  className={classes.textFld}
                  value={RegisterData.username}
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
                  id="email"
                  label="E-mail address"
                  onChange={handleChange("email")}
                  className={classes.textFld}
                  value={RegisterData.email}
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
                    type={RegisterData.showPassword ? "text" : "password"}
                    value={RegisterData.password}
                    onChange={handleChange("password")}
                    // helper text for an error
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
                <FormControl>
                  <InputLabel htmlFor="standard-adornment-password">
                    Confirm password
                  </InputLabel>
                  <Input
                    id="password"
                    className={classes.textFld}
                    type={RegisterData.showPassword ? "text" : "password"}
                    value={RegisterData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    // helper text for an error
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
            >
              Register
            </Button>
          </form>
          <Grid className="loginSignup">
            <Typography variant="body1">
              <p>
                Have an account?{" "}
                <Link to="/login">
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ margin: "10px", maxWidth: "100px" }}
                    onClick={handleLoginVisibility}
                  >
                    Log in
                  </Button>
                </Link>
              </p>
            </Typography>
          </Grid>
        </div>
      </div>
    </Grid>
  );
}
