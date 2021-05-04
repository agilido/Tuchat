import React, { useState, useEffect } from "react";
import Message from "./Message";

import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    position: "static",
  },
  label: {
    color: "black",
    background: "white",
    width: "30%",
    marginLeft: "35%",
  },
}));

export default function ChatMessages({ messages }) {
  const classes = useStyles();

  const [messagesByDate, setMessagesByDate] = useState([]);
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    setMessagesByDate(messages);
  }, []);

  useEffect(() => {
    setMessagesByDate(messages);
    const date = new Date();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let yy = date.getFullYear();
    const today = yy + "-" + mm + "-" + dd;
    if (messages.date === today) {
      setDateLabel("Today");
    } else {
      setDateLabel(messages.date);
    }
  }, [messages]);

  return (
    <div className={classes.root}>
      <div className={classes.label}>{dateLabel}</div>
      {messagesByDate.messages
        ? messagesByDate.messages.map((msgs, index) => {
            if (msgs) {
              return (
                <Message key={index} from={msgs.from} text={msgs.message} />
              );
            } else {
              return null;
            }
          })
        : ""}
    </div>
  );
}
