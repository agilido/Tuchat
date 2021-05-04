import React, { useContext } from "react";
import { makeStyles, Typography } from "@material-ui/core";

import { UserContext } from "../../../context/user";
const useStyles = makeStyles((theme) => ({
  root: {
    color: "black",
    marginLeft: "1%",
    marginRight: "1%",
    fontSize: "18px",
  },
  currUserBox: {
    width: "max-content",
    textAlign: "left",
    margin: "2px",
    padding: "10px",
    marginLeft: "auto",
  },
  currMsgBody: {
    position: "relative",
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
    padding: "20px",
  },
  otherMsgBody: {
    position: "relative",
    background: "white",
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
    fontSize: "15px",
    marginBottom: "4px",
    paddingLeft: "4px",
  },
}));

export default function Message({ text, from, time }) {
  const classes = useStyles();
  const { currentUser } = useContext(UserContext);

  return (
    <div>
      <div className={classes.root}>
        {currentUser.userId === from.userId ? (
          <div className={classes.currUserBox}>
            <Typography className={classes.currMsgBody}>{text}</Typography>
          </div>
        ) : (
          <div className={classes.otherUserBox}>
            <p className={classes.userLabel}>
              {from.username}, {time}
            </p>
            <Typography className={classes.otherMsgBody}>{text}</Typography>
          </div>
        )}
      </div>
    </div>
  );
}
