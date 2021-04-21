import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Snackbar, TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import { green } from "@material-ui/core/colors";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles((theme) => ({
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "92%",
    left: "78%",
    marginTop: -12,
    marginLeft: -12,
  },
  alert: {
    backgroundColor: green[500],
    color: "white",
  },
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    "& TextField": {
      margin: "100px",
    },
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function AddChannelForm({
  showAddChannelForm,
  setShowChannelForm,
  getChannels,
}) {
  const classes = useStyles();
  const [channelInfo, setChannelInfo] = useState({
    name: "",
    description: "",
  });
  const [ReqState, setReqState] = useState({
    error: false,
    errorMsg: "",
    loading: false,
    success: false,
    successMsg: "",
    addedNotification: false,
  });

  const buttonSubmit = clsx({
    [classes.buttonSuccess]: ReqState.success,
  });

  const handleClose = () => {
    setShowChannelForm(false);
    setReqState({
      error: false,
      erroMsg: "",
      success: false,
    });
  };

  const handleChange = (e) => {
    setChannelInfo({
      ...channelInfo,
      [e.target.id]: e.target.value,
    });
  };

  const createChannel = async (e) => {
    e.preventDefault();

    if (!channelInfo.name) {
      setReqState({
        error: true,
        errorMsg: "Field required",
      });
      return setTimeout(() => {
        setReqState({ error: false, errorMsg: "" });
      }, 5000);
    } else {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      const channelData = {
        channelId: uuidv4(),
        ...channelInfo,
        messages: [],
      };
      try {
        setReqState({
          loading: true,
          error: false,
          errorMsg: "",
          success: false,
          successMsg: "",
        });
        await axios.post(
          "/api/channel/add",
          {
            channelData,
          },
          config
        );
        setReqState({
          loading: false,
          success: true,
          successMsg: "Channel added!",
          addNotification: true,
        });
        getChannels();
        handleClose();
        return setTimeout(() => {
          setReqState({
            success: false,
            successMsg: "",
          });
        }, 5000);
      } catch (error) {
        if (error.response.status === 500) {
          setReqState({
            loading: false,
            error: true,
            errorMsg: "Server error",
          });
        } else {
          setReqState({ loading: false });
          setReqState({
            loading: false,
            error: true,
            errorMsg: error.response.data.err,
          });
          setTimeout(() => {
            setReqState({
              error: false,
              errorMsg: "",
            });
          }, 5000);
        }
        return error.response.data.err;
      }
    }
  };

  useEffect(() => {
    if (ReqState.success) {
      setChannelInfo({
        name: "",
        description: "",
      });
    }
  }, [ReqState.success]);

  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={showAddChannelForm}>
        Open dialog
      </Button> */}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={showAddChannelForm}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Add channel
        </DialogTitle>
        <form onSubmit={createChannel} autoComplete="off">
          <DialogContent dividers>
            <TextField
              margin="normal"
              id="standard-basic"
              label="Name"
              variant="outlined"
              required
              error={ReqState.error}
              id="name"
              value={channelInfo.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              id="standard-basic"
              label="Description"
              variant="outlined"
              id="description"
              onChange={handleChange}
              value={channelInfo.description}
            />
          </DialogContent>
          <DialogActions>
            {ReqState.success ? (
              <Typography
                style={{ color: green[500], fontSize: "18px" }}
                variant="h6"
              >
                {ReqState.successMsg}
              </Typography>
            ) : null}
            {ReqState.error ? (
              <Typography
                style={{ color: "red", fontSize: "18px" }}
                variant="h6"
              >
                {ReqState.errorMsg}
              </Typography>
            ) : null}
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={buttonSubmit}
              disabled={ReqState.loading}
            >
              Add
            </Button>
            {ReqState.loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        ContentProps={{
          className: classes.alert,
        }}
        open={ReqState.addNotification}
        autoHideDuration={6000}
        message={ReqState.successMsg}
      />
    </div>
  );
}
