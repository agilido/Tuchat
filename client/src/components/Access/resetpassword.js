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
import { Link } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(3),
  },
  textFld: { width: 300 },
}));

export default function ResetPassword({ match }) {
  const classes = useStyles();

  const [ResetPasswordData, setResetPasswordData] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    error: false,
    errorMsg: "",
    success: false,
    successMsg: ""
  });

  const handleChange = (prop) => (event) => {
    setResetPasswordData({ ...ResetPasswordData, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setResetPasswordData({
      ...ResetPasswordData,
      showPassword: !ResetPasswordData.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    if (ResetPasswordData.password !== ResetPasswordData.confirmPassword) {
        setResetPasswordData({password: "", confirmPassword: ""});
        setTimeout(() => {
            setResetPasswordData({...ResetPasswordData, error: true, errorMsg: ""});
        }, 5000);
        return setResetPasswordData({...ResetPasswordData, error: true, errorMsg: "Passwords do not match"});
    }

    try {
      const { data } = await axios.put(
        `/api/auth/resetpassword/${match.params.resetToken}`,
        {
          password: ResetPasswordData.password,
        },
        config
      );

      setResetPasswordData(data.data);

    } catch (error) {
        setResetPasswordData({
        ...ResetPasswordData,
        error: true,
        errorMsg: error.response.data.error,
      });
      setTimeout(() => {
        setResetPasswordData({
          ...ResetPasswordData,
          error: false,
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
      <div className="registerBox">
        {/* <Typography component="h1" variant="h4">
              LOGO
            </Typography> */}
        <Grid></Grid>

        <div className="registerForm">
          <Typography className={classes.margin} component="h1" variant="h5">
            Change Your Password
          </Typography>
          <form onSubmit={handleResetPassword} noValidate autoComplete="off">

            {/* PASSWORD */}
            <Grid
              className={classes.margin}
              container
              spacing={1}
              alignItems="flex-end"
            >

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
                    type={ResetPasswordData.showPassword ? "text" : "password"}
                    value={ResetPasswordData.password}
                    onChange={handleChange("password")}
                    // helper text for an error
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {ResetPasswordData.showPassword ? (
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
                    type={ResetPasswordData.showPassword ? "text" : "password"}
                    value={ResetPasswordData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    // helper text for an error
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {ResetPasswordData.showPassword ? (
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
            {ResetPasswordData.error && <span>{ResetPasswordData.error}</span>}
            <Button
              className={classes.margin}
              color="primary"
              variant="contained"
              type="submit"
            >
              Change Password
            </Button>
          </form>
          <Grid className="loginSignup">
            <Typography variant="body1">
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
            </Typography>
          </Grid>
        </div>
      </div>
    </Grid>
  );
}
