import { Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "black",
    backgroundColor: "white",
    borderRadius: "12px",
    width: "30%",
    marginLeft: "15px",
  },
}));
export default function ChannelInfo() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h4">Info</Typography>
      <Typography paragraph>Participants.. Images..?</Typography>
      {/* maybe import future component ChatInfo and others if necessary */}
    </div>
  );
}
