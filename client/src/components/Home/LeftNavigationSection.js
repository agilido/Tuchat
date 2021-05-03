import React, { useState, useEffect, useContext } from "react";
import { ChannelContext } from "../../context/channel";
import { makeStyles } from "@material-ui/core/styles";
// icons
import StarBorder from "@material-ui/icons/StarBorder";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import FolderIcon from "@material-ui/icons/Folder";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import StarOutlineIcon from "@material-ui/icons/StarOutline";
import StarIcon from "@material-ui/icons/Star";
import ChatIcon from "@material-ui/icons/Chat";
import PeopleIcon from "@material-ui/icons/People";
// structure items
import ListItem from "@material-ui/core/ListItem";
import axios from "axios";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  item: {
    fontSize: "1rem",
    marginLeft: "12px",
  },
  starSize: {
    height: "40px",
    width: "40px",
    color: "#FACA2B",
  },
}));

export default function LeftNavigationSection({
  show,
  setShow,
  type,
  items,
  title,
  open,
  getChannels,
  setShowChannelForm,
  showAddChannelForm,
}) {
  const classes = useStyles();

  const switchShow = () => {
    setShow(!show);
  };
  const switchChannelFormShow = () => {
    setShowChannelForm(!showAddChannelForm);
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  const starOrUnstarChannel = async (channId, favoriteStan) => {
    try {
      await axios.post(
        "/api/channel/star",
        {
          channId,
          favoriteStan,
        },
        config
      );
      getChannels();
    } catch (error) {
      console.log("Error: " + error);
    }
  };
  const { activeChannel, setActiveChannel } = useContext(ChannelContext);

  const getActiveChannel = async (channelId) => {
    // console.log(channelId);
    try {
      const { data } = await axios.get(`/api/channel/${channelId}`, config);
      // console.log(data.channel);
      if (data) {
        setActiveChannel(data.channel);
      }
    } catch (error) {
      return console.log(error.message);
    }
  };

  // setActiveChannel(channelData);
  return (
    <>
      <List>
        <ListItem button onClick={open ? switchShow : null}>
          <ListItemIcon>
            {type === "stars" ? (
              <StarBorder fontSize="large" />
            ) : type === "contacts" ? (
              <PeopleIcon fontSize="large" />
            ) : (
              <FolderIcon fontSize="large" />
            )}
          </ListItemIcon>

          <ListItemText primary={title} />

          {show ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        {type === "channel" && open ? (
          <ListItemSecondaryAction
            style={{
              position: "absolute",
              left: "65%",
              top: "50%",
              width: "20%",
            }}
          >
            <IconButton onClick={switchChannelFormShow} aria-label="addChannel">
              <AddCircleIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ) : null}
      </List>
      <Collapse in={show && open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items ? (
            items.map((item) => {
              return (
                <ListItem
                  onClick={() => {
                    getActiveChannel(item.channelId);
                  }}
                  key={item.channelId}
                  dense
                  button
                  className={classes.nested}
                >
                  {type === "channel" || type === "stars" ? "#" : null}

                  <ListItemText
                    disableTypography
                    className={classes.item}
                    primary={
                      type === "channel" || type === "stars"
                        ? item.channelName
                        : item
                    }
                  />
                  <ListItemSecondaryAction
                    style={{
                      position: "absolute",
                      left: "78%",
                      top: "50%",
                      width: "20%",
                    }}
                  >
                    {type === "channel" ? (
                      <IconButton
                        className={classes.starSize}
                        aria-label="starChannel"
                        onClick={() => {
                          starOrUnstarChannel(item.channelId, item.favorite);
                        }}
                      >
                        <StarOutlineIcon />
                      </IconButton>
                    ) : type === "stars" ? (
                      <IconButton
                        className={classes.starSize}
                        aria-label="unStarChannel"
                        onClick={() => {
                          starOrUnstarChannel(item.channelId, item.favorite);
                        }}
                      >
                        <StarIcon />
                      </IconButton>
                    ) : type === "contacts" ? (
                      <IconButton aria-label="unStarChannel">
                        <ChatIcon />
                      </IconButton>
                    ) : null}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })
          ) : (
            <ListItemText primary="No channels found" />
          )}
        </List>
      </Collapse>
    </>
  );
}
