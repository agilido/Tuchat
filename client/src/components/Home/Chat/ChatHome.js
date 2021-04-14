import { Box, makeStyles } from "@material-ui/core";
import React from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
// showing communication happening (messages)

const useStyles = makeStyles((theme) => ({
  root: {
    color: "black",
    backgroundColor: "#edf0f5",
    borderRadius: "12px",
    padding: "1%",
    width: "100%",
    height: "100%",
  },
}));

export default function ChatHome() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
