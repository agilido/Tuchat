import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import ChatHome from "../Chat/ChatHome";
import ChannelInfo from "./ChannelInfo";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    height: "90vh",
    margin: "15px",
    marginBottom: "0",
    [theme.breakpoints.down("lg")]: {
      height: "87.7vh",
    },
    [theme.breakpoints.down("md")]: {
      height: "90vh",
    },
  },
}));
export default function ChannelHome({ getChannels }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ChatHome />

      <ChannelInfo getChannels={getChannels} />
    </div>
  );
}
