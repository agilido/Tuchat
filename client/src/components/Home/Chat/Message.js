import React, { useContext, useEffect, useState } from "react";
import { makeStyles, Typography } from "@material-ui/core";

import { UserContext } from "../../../context/user";
const useStyles = makeStyles((theme) => ({
  root: {
    color: "black",
    marginLeft: "1%",
    marginRight: "1%",
  },
  currUserBox: {
    width: "max-content",
    textAlign: "right",
    margin: "2px",
    marginLeft: "auto",
    paddingLeft: "20px",
    paddingTop: "5px",
  },
  currMsgBody: {
    position: "relative",
    display: "inline-block",
    textAlign: "left",
    background: "#2592eb",
    color: "white",
    borderRadius: "12px",
    borderBottomRightRadius: 0,
    padding: "15px",
    wordBreak: "break-all",
    maxWidth: "40vw",
    "&::after": {
      content: "''",
      color: "white",
      display: "block",
      position: "absolute",
      width: "30px",
      height: "30px",
      top: "100%",
      left: "100%",
      transform: "translate(-30%, -95%) rotate(100deg)",
      background:
        "radial-gradient(circle at 0 0, transparent, transparent 72%, #2592eb 72%)",
    },
  },
  otherUserBox: {
    width: "max-content",
    textAlign: "left",
    margin: "10px",
    paddingLeft: "20px",
    paddingTop: "5px",
  },
  otherMsgBody: {
    position: "relative",
    display: "inline-block",
    background: "white",
    textAlign: "left",
    color: "black",
    borderRadius: "12px",
    borderBottomLeftRadius: 0,
    padding: "15px",
    "&::after": {
      content: "''",
      color: "white",
      display: "block",
      position: "absolute",
      width: "30px",
      height: "30px",
      transform: "translate(-125%, -45%) rotate(-10deg)",
      background:
        "radial-gradient(circle at 0 0, transparent, transparent 72%, white 72%)",
    },
    wordBreak: "break-all",
    height: "auto",
    maxWidth: "40vw",
  },
  userLabel: {
    fontSize: "14px",
    marginBottom: "4px",
    paddingLeft: "4px",
  },
}));

export default function Message({ text, from, time }) {
  const classes = useStyles();
  const { currentUser } = useContext(UserContext);

  const [timeStamp, setTimeStamp] = useState(null);
  const [timeLabel, setTimeLabel] = useState(null);

  useEffect(() => {
    if (time) {
      setTimeStamp(time);
    }
  }, [time]);

  useEffect(() => {
    const msgTime = new Date(timeStamp);
    const hour = (msgTime.getHours() < 10 ? "0" : "") + msgTime.getHours();
    const minute =
      (msgTime.getMinutes() < 10 ? "0" : "") + msgTime.getMinutes();

    const result = hour + ":" + minute;
    setTimeLabel(result);
  }, [timeStamp]);

  return (
    <div>
      <div className={classes.root}>
        {currentUser.userId === from.userId ? (
          <div className={classes.currUserBox}>
            <p className={classes.userLabel}>You, {timeLabel}</p>
            <Typography className={classes.currMsgBody}>{text}</Typography>
          </div>
        ) : (
          <div className={classes.otherUserBox}>
            <p className={classes.userLabel}>
              {from.username}, {timeLabel}
            </p>
            <Typography className={classes.otherMsgBody}>{text}</Typography>
          </div>
        )}
      </div>
    </div>
  );
}
