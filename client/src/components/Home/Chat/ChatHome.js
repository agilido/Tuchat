import React, { useEffect, useContext, useState } from "react";
import {
  CardHeader,
  Grid,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import QuestionAnswerRoundedIcon from "@material-ui/icons/QuestionAnswerRounded";

// Context
import { socket } from "../../../context/socket";
import { ChannelContext } from "../../../context/channel";
import { UserContext } from "../../../context/user";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    color: "black",
    backgroundColor: "#edf0f5",
    borderRadius: "12px",
    padding: "1%",
    width: "100%",
    height: "100%",
    maxWidth: "100%",
  },

  messageBox: {
    height: "83%",
    [theme.breakpoints.down("lg")]: {
      height: "78%",
    },
    [theme.breakpoints.down("md")]: {
      height: "78%",
    },
    marginTop: "60px",
    overflow: "scroll",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      height: " 12px",
      background: "0",
      width: "5px",
    },
    "&::-webkit-scrollbar-thumb": {
      width: "5px",
      background: "#cdcdcd",
      borderRadius: "25px",
    },
    scrollbarWidth: "thin",
  },
  title: {
    background: "#edf0f5",
    textAlign: "left",
    position: "absolute",
    zIndex: "2",
    display: "block",
  },
  disabledIcon: {
    display: "flex",
    direction: "column",
    margin: "auto",
  },
}));

export default function ChatHome() {
  const classes = useStyles();
  const { activeChannel } = useContext(ChannelContext);
  const { currentUser } = useContext(UserContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newMessagesDots, setNewMessagesDots] = useState(false);
  const [firstTimeLoad, setFirstTimeLoad] = useState(false);

  // Set messages as user opens a channel
  useEffect(() => {
    setMessages(activeChannel.messagesByDate);
    setFirstTimeLoad(true);
  }, [activeChannel.channelId]);

  // Set new message on socket event arrival
  useEffect(() => {
    if (socket) {
      socket.on("message", (msgData) => {
        if (activeChannel.channelId) {
          if (msgData.channelId === activeChannel.channelId) {
            setNewMessage(msgData);
          }
        }
      });
      return () => socket.off("message");
    }
  }, [socket, messages]);

  // If newMessage is present add it to the current state of messages
  useEffect(() => {
    if (newMessage) {
      setFirstTimeLoad(false);
      const latestMessage = messages[messages.length - 1];

      // if previous message exists and date is the same add new message to the latestMessage
      if (latestMessage && latestMessage.date === newMessage.date) {
        latestMessage.messages.push(newMessage.message);
        messages.pop();

        setMessages((prevState) => {
          return [...prevState, latestMessage];
        });
        // if previous message doesn't exist or date is not the same, create new object with new date
      } else if (!latestMessage || latestMessage.date !== newMessage.date) {
        setMessages((prevState) => {
          return [
            ...prevState,
            { date: newMessage.date, messages: [newMessage.message] },
          ];
        });
      }
    }
  }, [newMessage]);

  const scrollDownAuto = () => {
    const msgBox = document.querySelector("#messageBox");

    if (newMessage.message && msgBox) {
      msgBox.maxTop = msgBox.scrollHeight - msgBox.offsetHeight;
      // If not far away from the bottom scroll chat down on new message
      if (msgBox.maxTop - msgBox.scrollTop <= msgBox.offsetHeight) {
        msgBox.scrollTop = msgBox.scrollHeight;
        setNewMessagesDots(false);

        // If currentUser is sending message scroll to bottom
      } else if (newMessage.message.from.userId === currentUser.userId) {
        msgBox.scrollTop = msgBox.scrollHeight;
        setNewMessagesDots(false);
      } else if (newMessage.message.from.userId !== currentUser.userId) {
        setNewMessagesDots(true);

        function checkScrollHeight() {
          // if scrolled to bottom remove newMessageDots
          if (msgBox.scrollTop >= msgBox.scrollHeight - 1000) {
            setNewMessagesDots(false);
            msgBox.removeEventListener("scroll", checkScrollHeight);
          }
        }

        msgBox.addEventListener("scroll", checkScrollHeight);
      }
    }
  };
  const scrollDown = () => {
    const msgBox = document.querySelector("#messageBox");
    msgBox && (msgBox.scrollTop = msgBox.scrollHeight);
    setNewMessagesDots(false);
  };

  // Scroll down when channel is first time opened
  useEffect(() => {
    scrollDownAuto();
    if (firstTimeLoad) {
      setTimeout(() => {
        scrollDown();
      }, 20);
    }
  }, [messages]);

  return (
    <div className={classes.root}>
      {activeChannel.channelId ? (
        <CardHeader className={classes.title} title={activeChannel.name}>
          <Toolbar>
            <Typography variant="h6">{activeChannel.name}</Typography>
          </Toolbar>
        </CardHeader>
      ) : null}
      {!activeChannel.channelId && (
        <Grid
          style={{
            color: "black",
            borderRadius: "12px",
            display: "flex",
            direction: "column",
            height: "100%",
          }}
        >
          <QuestionAnswerRoundedIcon
            color="disabled"
            style={{ fontSize: 150 }}
            className={classes.disabledIcon}
          />
        </Grid>
      )}
      {messages ? (
        <div id="messageBox" className={classes.messageBox}>
          {messages.map((msgs, index) => {
            return (
              <ChatMessages key={index} messages={msgs} time={msgs.time} />
            );
          })}

          {messages && messages.length === 0 && (
            <Typography variant="h6">Say hello! 😄</Typography>
          )}

          <div id="scrollRef"></div>

          <ChatInput
            scrollDown={scrollDown}
            newMessagesDots={newMessagesDots}
          />
        </div>
      ) : null}
    </div>
  );
}
