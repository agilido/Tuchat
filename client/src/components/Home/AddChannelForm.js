import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
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
}) {
  const [open, setOpen] = React.useState(false);
  const [channelInfo, setChannelInfo] = useState({
    name: "",
    description: "",
  });
  const [ReqState, setReqState] = useState({
    error: false,
    errorMsg: "",
  });

  //   const showAddChannelForm = () => {
  //     setOpen(true);
  //   };
  const handleClose = () => {
    setShowChannelForm(false);
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
    }
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    const userData = {
      _id: localStorage.getItem("dIresu"),
      name: localStorage.getItem("name"),
    };
    const channelData = {
      channelId: uuidv4(),
      ...channelInfo,
      messages: [],
    };
    try {
      const { data } = await axios.post(
        "/api/channel/add",
        {
          userData,
          channelData,
        },
        config
      );
    } catch (error) {
      return null;
    }
  };

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
          <Button onClick={createChannel} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
