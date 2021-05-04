import React, { useEffect, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import { socket } from "../../../context/socket";
import { ChannelContext } from "../../../context/channel";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    color: "black",
    backgroundColor: "#edf0f5",
    // background: "lightyellow",
    borderRadius: "12px",
    padding: "1%",
    width: "100%",
    height: "100%",
    maxWidth: "100%",
  },
  messagesBox: {
    position: "relative",
    height: "100px",
  },
  scroll: {
    height: "89.5%",
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
    <>
      <div className={classes.root}>
        <div className={classes.scroll}>
          {activeChannel.channelId ? <p>#{activeChannel.name}</p> : null}
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
    </>
  );
}
