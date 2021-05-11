import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import ChatHome from "../Chat/ChatHome";
import ChannelInfo from "./ChannelInfo";
// importing Chat folder, putting all together for whole "Chatting Section"

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexGrow: 1,
    height: "90vh",
    margin: "15px",
  },
});
export default function ChannelHome({ getChannels }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ChatHome />

      <ChannelInfo getChannels={getChannels} />
    </div>
  );
}
