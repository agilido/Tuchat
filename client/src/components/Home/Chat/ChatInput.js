import React from "react";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    position: "sticky",
    top: "90%",
    margin: "1%",
  },
  input: {
    width: "100%",
    height: "70px",
    border: " white 1px solid",
    fontSize: "20px",
    "&:hover": {
      border: "blue 1px solid",
      boxShadow: "0 0 1px 0 blue inset, 0 0 1px 0 gray",
    },
    "&::placeholder": {
      color: "red",
      fontSize: "20px",
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
