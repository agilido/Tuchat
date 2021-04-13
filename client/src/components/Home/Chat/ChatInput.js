import React from "react";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "88vh",
  },
  input: {
    width: "600%",
    height: "70px",
    border: "none",
    "&:hover": {
      border: "blue 1px solid",
    },
    borderRadius: "25px",
    paddingLeft: "25px",
    outline: "none",
  },
}));
export default function ChatInput() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <input
        className={classes.input}
        type="text"
        placeholder="Type something :)"
      ></input>
    </div>
  );
}
