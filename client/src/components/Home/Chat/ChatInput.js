import React, { useState } from "react";
import { Grid, IconButton, makeStyles, Paper } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";

import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "sticky",
    top: "90%",
    margin: "1%",
  },
  paper: {
    borderRadius: "25px",
    display: "flex",
    paddingRight: "5px",
  },
  input: {
    width: "100%",
    height: "70px",
    border: " white 1px solid",
    fontSize: "20px",
    "&:hover": {},

    "&::placeholder": {
      fontSize: "20px",
    },
    borderRadius: "25px",
    paddingLeft: "25px",
    outline: "none",
  },
  icons: {
    position: "absolute",
    right: "1%",
    top: "9%",
  },
}));

export default function ChatInput() {
  const classes = useStyles();
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("Message sending triggered");

    const newMessage = {
      _id: uuidv4(),
      message: message,
      time: new Date().getTime(),
    };

    if (message) {
      console.log(message);

      try {
        // await axios.post(
        //   "/api/channel/add",
        //   {
        //     channelData,
        //   },
        //   config
        // );
      } catch (error) {}
    }
  };

  return (
    <div className={classes.root}>
      <form onSubmit={sendMessage} autoComplete="off">
        <Paper className={classes.paper}>
          <input
            className={classes.input}
            type="text"
            onChange={handleChange}
            placeholder="Type something..."
          />
          <Grid className={classes.icons}>
            <IconButton color="primary">😄</IconButton>
            <IconButton type="submit" color="primary">
              <SendIcon fontSize="large"></SendIcon>
            </IconButton>
          </Grid>
        </Paper>
      </form>
    </div>
  );
}
