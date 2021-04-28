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
    position: "sticky",
    top: "90%",
    margin: "1%",
  },
  paper: {
    borderRadius: "25px",
    display: "flex",
    paddingRight: "5px",
  },
  input: {
    width: "100%",
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
    position: "absolute",
    right: "1%",
    top: "9%",
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
      console.log("Channel name: " + activeChannel.channelName);
    } else {
      return console.log("Channel not selected");
    }

    const newMessage = {
      _id: uuidv4(),
      date: new Date().toLocaleDateString(),
      messageId: uuidv4(),
      message: message,
      time: new Date().getTime(),
    };
    const messageSocket = {
      id: activeChannel.channelId,
      date: new Date().toLocaleDateString(),
      from: {
        userId: currentUser.userId,
        username: currentUser.username,
      },
      message: newMessage,
    };

    if (message) {
      console.log(message);

      try {
        // await axios.post(
        //   "/api/channel/newmessage",
        //   {
        //     channId: activeChannel.channelId,
        //     newMessage,
        //   },
        //   config
        // );
        socket.emit("sendMessage", messageSocket);
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
