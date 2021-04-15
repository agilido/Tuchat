import React from "react";
import { Grid, IconButton, makeStyles, Paper } from "@material-ui/core";

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
    // "&:focus": {
    //   border: "blue 0.2px solid",
    //   boxShadow: "0 0 1px 0 blue inset, 0 0 1px 0 gray",
    //   transition: "all 0.1s ease-in-out",
    // },
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
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <input
          className={classes.input}
          type="text"
          placeholder="Type something..."
        />
        <Grid className={classes.icons}>
          <IconButton color="primary">😄</IconButton>
          <IconButton color="primary">
            <SendIcon fontSize="large"></SendIcon>
          </IconButton>
        </Grid>
      </Paper>
      {/* <input
        className={classes.input}
        type="text"
        placeholder="Type something :)"
      ></input> */}
    </div>
  );
}
