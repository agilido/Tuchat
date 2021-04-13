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
    width: "100%",
    padding: "1%",
    height: "90vh",
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
