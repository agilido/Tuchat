import React, { useEffect, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import { socket } from "../../../context/socket";
import { ChannelContext } from "../../../context/channel";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "black",
    backgroundColor: "#edf0f5",
    borderRadius: "12px",
    padding: "1%",
    width: "100%",
    height: "100%",
  },
  messageBox: {
    display: "block",
    width: "100%",
    height: "70px",
    overflow: "scroll",
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
        // setMessages(...messages, [latestMessage]);
        setMessages((prevState) => {
          return [...prevState, latestMessage];
        });
      } else if (!latestMessage || latestMessage.date !== newMessage.date) {
        // setMessages(...messages, [
        //   { date: newMessage.date, messages: [newMessage.message] },
        // ]);

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
      {activeChannel.channelId ? <p>#{activeChannel.name}</p> : null}
      {messages
        ? messages.map((msgs, index) => {
            return <ChatMessages messages={msgs} key={index} />;
          })
        : "No channel selected"}

      <ChatInput />
    </div>
  );
}
