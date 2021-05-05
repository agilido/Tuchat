import React, { useEffect, useContext, useState } from "react";
import { CardHeader, makeStyles, Toolbar, Typography } from "@material-ui/core";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import { socket } from "../../../context/socket";
import { ChannelContext } from "../../../context/channel";

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
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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

  return (
    <div className={classes.root}>
      {activeChannel.channelId ? (
        <CardHeader className={classes.title} title={activeChannel.name}>
          <Toolbar>
            <Typography variant="h6">{activeChannel.name}</Typography>
          </Toolbar>
        </CardHeader>
      ) : null}
      <div className={classes.root}>
        <div className={classes.messageBox}>
          {messages
            ? messages.map((msgs, index) => {
                return (
                  <ChatMessages key={index} messages={msgs} time={msgs.time} />
                );
              })
            : null}

          {!activeChannel.channelId && "No channel selected"}

          <ChatInput />
        </div>
      </div>
    </div>
  );
}
