import React, { useState, useContext, useEffect } from "react";
import { Grid, IconButton, makeStyles, Paper } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import { ChannelContext } from "../../../context/channel";
import axios from "axios";
import { UserContext } from "../../../context/user";
import "../styles.css";

import SendIcon from "@material-ui/icons/Send";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Picker from "emoji-picker-react";
import { socket } from "../../../context/socket";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    margin: "1%",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      bottom: "-2%",
    },
    right: "-1.5%",
    bottom: "-3%",
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
    position: "absolute",
    top: "23%",
    right: "3%",
    [theme.breakpoints.down("md")]: {
      marginRight: "3%",
    },
  },
  thatOneTrickyElement: {
    marginBottom: "3px",
  },
  shape: {
    background: "rgba(0, 61, 123, 0.05)",
    "&:hover": {
      background: "rgba(0, 61, 123, 0.1)",
    },
    width: 35,
    height: 35,
    position: "absolute",
    left: "50%",
    top: "-25%",
    textAlign: "center",
    animation: "dotPulse 1.5s ease-in-out 2 both",
  },
}));

export default function ChatInput({ newMessagesDots, scrollDown }) {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  // On ESC hide emoji picker
  useEffect(() => {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.keyCode === 27) {
          setShowEmojiPicker(false);
        }
      },
      false
    );

    return () => {
      document.removeEventListener("keydown", setShowEmojiPicker, false);
    };
  }, []);

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
        {newMessagesDots && (
          <IconButton
            onClick={scrollDown}
            color="primary"
            className={classes.shape}
          >
            <MoreHorizIcon></MoreHorizIcon>
          </IconButton>
        )}
        {showEmojiPicker ? (
          <Picker
            pickerStyle={{ position: "absolute", left: "70%", top: "-275%" }}
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
                className={classes.thatOneTrickyElement}
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
