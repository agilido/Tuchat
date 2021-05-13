import { Button, Grid, Typography } from "@material-ui/core";
import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { ChannelContext } from "../../../context/channel";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import GroupIcon from "@material-ui/icons/Group";
import InfoRoundedIcon from "@material-ui/icons/InfoRounded";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { socket } from "../../../context/socket";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "black",
    backgroundColor: "white",
    borderRadius: "12px",
    width: "30%",
    marginLeft: "15px",
    display: "flex",
    direction: "column",
  },
  header: {
    marginTop: "29px",
    marginBottom: "29px",
  },
  margin: {
    marginTop: "2%",
  },
  list: {
    width: "70%",
    maxWidth: 360,

    borderRadius: "12px",
  },
  collapse: {
    backgroundColor: "#edf0f5",
  },
  endRule: {
    marginTop: "auto",
    marginBottom: "10%",
    backgroundColor: "#f48fb1",
    "&:hover": {
      backgroundColor: "#aa647b",
    },
  },
  disabledIcon: {
    margin: "auto",
  },
}));
export default function ChannelInfo({ getChannels }) {
  const classes = useStyles();

  const { activeChannel, setActiveChannel } = useContext(ChannelContext);
  const [showList, setShowList] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const switchShow = () => {
    setShowList(!showList);
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };
  const handleLeaveConfirmation = () => {
    setShowConfirmation(!showConfirmation);
  };

  const leaveChannel = async () => {
    try {
      socket.emit("leaveChannel", activeChannel);
      await axios
        .post("api/channel/leavechannel", activeChannel, config)
        .then(() => {
          setActiveChannel({});
          getChannels();
          setShowConfirmation(false);
        });
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  };

  return (
    <Grid className={classes.root}>
      {activeChannel.channelId ? (
        <>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
          >
            <Typography variant="h4" className={classes.header}>
              {activeChannel.name}
            </Typography>
            <Grid item>
              <AccountCircleIcon />
              <ListItemText
                primary={`Created by: ${activeChannel.owner.username}`}
              />
            </Grid>

            <List className={classes.list}>
              <List>
                <ListItem button onClick={switchShow}>
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>

                  <ListItemText primary={`Members`} />

                  {showList ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              </List>
              <Collapse in={showList} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {activeChannel.members ? (
                    activeChannel.members.map((item, index) => {
                      return (
                        <ListItem key={index} role={undefined} dense button>
                          <ListItemText
                            id={item.userId}
                            primary={item.username}
                          />
                        </ListItem>
                      );
                    })
                  ) : (
                    <ListItemText primary="No channels found" />
                  )}
                </List>
              </Collapse>
            </List>
            <Button
              variant="contained"
              className={classes.endRule}
              startIcon={<ExitToAppIcon />}
              onClick={handleLeaveConfirmation}
            >
              Leave channel
            </Button>
          </Grid>
          <Dialog
            open={showConfirmation}
            onClose={handleLeaveConfirmation}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {`Do you want to leave "${activeChannel.name}" channel?`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleLeaveConfirmation} color="primary">
                Cancel
              </Button>
              <Button onClick={leaveChannel} color="primary" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <div className={classes.disabledIcon}>
          <InfoRoundedIcon color="disabled" style={{ fontSize: 150 }} />
        </div>
      )}
    </Grid>
  );
}
