import React, { useEffect, useContext, useState } from "react";
import { CardHeader, makeStyles, Toolbar, Typography } from "@material-ui/core";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

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
    [theme.breakpoints.down("md")]: {
      height: "80%",
    },
    marginTop: "60px",
    overflow: "scroll",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      height: " 12px",
      width: "12px",
      background: "#000",
    },
    "&::-webkit-scrollbar": {
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
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    background: "lightyellow",
    position: "absolute",
    zIndex: "1",
    width: "90%",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

export default function ChatHome() {
  const classes = useStyles();
  const { activeChannel } = useContext(ChannelContext);
  const { currentUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newMessagesDots, setNewMessagesDots] = useState(false);

  useEffect(() => {
    setMessages(activeChannel.messagesByDate);
  }, [activeChannel.channelId]);

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

  useEffect(() => {
    if (newMessage) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage && latestMessage.date === newMessage.date) {
        latestMessage.messages.push(newMessage.message);
        messages.pop();

        setMessages((prevState) => {
          return [...prevState, latestMessage];
        });
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
    msgBox.maxTop = msgBox.scrollHeight - msgBox.offsetHeight;

    if (newMessage.message) {
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
    msgBox.scrollTop = msgBox.scrollHeight;
    setNewMessagesDots(false);
  };
  useEffect(() => {
    console.log("lol");
    scrollDownAuto();
  }, [messages, newMessage]);

  return (
    <div className={classes.root}>
      {activeChannel.channelId ? (
        <>
          <CardHeader className={classes.title} title={activeChannel.name}>
            <Toolbar>
              <Typography variant="h6">{activeChannel.name}</Typography>
            </Toolbar>
          </CardHeader>
        </>
      ) : null}
      <div className={classes.root}>
        <div id="messageBox" className={classes.messageBox}>
          {messages
            ? messages.map((msgs, index) => {
                return (
                  <ChatMessages key={index} messages={msgs} time={msgs.time} />
                );
              })
            : null}
          <div id="scrollRef"></div>

          {!activeChannel.channelId && (
            <Typography variant="h5">No channel selected</Typography>
          )}

          <ChatInput
            scrollDown={scrollDown}
            newMessagesDots={newMessagesDots}
          />
        </div>
      </div>
    </div>
  );
}
