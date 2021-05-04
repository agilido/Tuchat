import React, { useState, useContext } from "react";
import { Grid, IconButton, makeStyles, Paper } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import { ChannelContext } from "../../../context/channel";
import axios from "axios";
import { UserContext } from "../../../context/user";

import SendIcon from "@material-ui/icons/Send";
import Picker from "emoji-picker-react";
import { socket } from "../../../context/socket";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    margin: "1%",
    width: "100%",
    maxWidth: "64%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "45%",
    },
    right: "21%",
    bottom: "0",
    padding: "20px",
  },
  paper: {
    borderRadius: "25px",
    display: "flex",
  },
  input: {
    width: "89%",
    height: "70px",
    border: " white 1px solid",
    fontSize: "20px",
    "&:hover": {},

    "&::placeholder": {
      fontSize: "20px",
    },
    borderRadius: "25px",
    paddingLeft: "25px",
    outline: "none",
  },
  icons: {
    position: "relative",
    right: "1%",
    display: "flex",
    justifyContent: "center",
  },
}));

export default function ChatInput() {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  const { activeChannel } = useContext(ChannelContext);
  const { currentUser } = useContext(UserContext);

  const sendMessage = async (e) => {
    e.preventDefault();

    console.log("Message sending triggered");

    if (activeChannel) {
      console.log("Channel name: " + activeChannel.name);
    } else {
      return console.log("Channel not selected");
    }
    if (message) {
      let d = new Date();
      let mm = d.getMonth() + 1;
      let dd = d.getDate();
      let yy = d.getFullYear();
      const socketDate = yy + "-" + mm + "-" + dd;

      const newMessage = {
        _id: uuidv4(),
        date: new Date().toLocaleDateString(),
        messageId: uuidv4(),
        message: message,
        from: {
          username: currentUser.username,
          userId: currentUser.userId,
        },
        time: new Date().getTime(),
      };

      const messageSocket = {
        channelId: activeChannel.channelId,
        date: socketDate,
        message: newMessage,
      };

      try {
        await axios
          .post(
            "/api/channel/newmessage",
            {
              channId: activeChannel.channelId,
              newMessage,
            },
            config
          )
          .then(() => {
            socket.emit("sendMessage", messageSocket);
          });
        return setMessage("");
      } catch (error) {
        return console.log("Error:" + error.error);
      }
    }
  };

  return (
    <>
      <div className={classes.root}>
        {showEmojiPicker ? (
          <Picker
            pickerStyle={{ position: "absolute", left: "70%", top: "-470%" }}
            native={true}
            onEmojiClick={onEmojiClick}
            disableSkinTonePicker={true}
          />
        ) : null}
        <form onSubmit={sendMessage} autoComplete="off">
          <Paper className={classes.paper}>
            <input
              className={classes.input}
              type="text"
              onChange={handleChange}
              value={message}
              placeholder="Type something..."
            />
            <Grid className={classes.icons}>
              <IconButton
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                }}
                color="primary"
              >
                😄
              </IconButton>
              <IconButton type="submit" color="primary">
                <SendIcon fontSize="large"></SendIcon>
              </IconButton>
            </Grid>
          </Paper>
        </form>
      </div>
    </>
  );
}
