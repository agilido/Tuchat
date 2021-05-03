import React from "react";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    color: "black",
    margin: "2px",
    // overflow: "scroll",
  },
}));

export default function Message({ text, from }) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.root}>
        <div>{from}</div>
        {text}
      </div>
    </div>
  );
}
