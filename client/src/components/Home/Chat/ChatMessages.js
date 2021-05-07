import React, { useState, useEffect } from "react";
import Message from "./Message";

import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    position: "static",
  },
  dateLabel: {
    color: "black",
    width: "99%",
    lineHeight: "0.1em",
    borderBottom: "1px solid #c9ccd1",
    margin: "auto",
    marginTop: "20px",
    "& span": {
      background: "#edf0f5",
      paddingLeft: "10px",
      paddingRight: "10px",
    },
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
      let d = new Date(messages.date);
      let yy = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let mm = new Intl.DateTimeFormat("en", { month: "long" }).format(d);
      let dd = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

      let day = dd < 10 ? dd.slice(1) : dd;

      setDateLabel(`${day} ${mm} ${yy}`);
    }
  }, [messages]);

  return (
    <div className={classes.root}>
      <div className={classes.toolbar} />
      <div className={classes.dateLabel}>
        <span>{dateLabel}</span>
      </div>
      {messagesByDate.messages
        ? messagesByDate.messages.map((msgs, index) => {
            if (msgs) {
              return (
                <Message
                  key={index}
                  from={msgs.from}
                  text={msgs.message}
                  time={msgs.time}
                />
              );
            } else {
              return null;
            }
          })
        : ""}
    </div>
  );
}
