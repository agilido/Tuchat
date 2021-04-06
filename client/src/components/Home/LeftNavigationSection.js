import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";

// icons
import StarBorder from "@material-ui/icons/StarBorder";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import FolderIcon from "@material-ui/icons/Folder";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
// structure items

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  item: {
    fontSize: "1.1rem",
    marginLeft: "12px",
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
}));

export default function LeftNavigationSection({
  show,
  setShow,
  type,
  items,
  title,
  icon,
  open,
}) {
  const classes = useStyles();
  const switchShow = () => {
    setShow(!show);
  };
  const addIcon = () => {
    return <FolderIcon />;
  };
  return (
    <>
      <List>
        <ListItem button onClick={open ? switchShow : null}>
          <ListItemIcon>
            {icon === "star" ? (
              <StarBorder fontSize="large" />
            ) : (
              <FolderIcon fontSize="large" />
            )}
          </ListItemIcon>

          <ListItemText primary={title} />

          {show ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <ListItemSecondaryAction
          style={{
            position: "absolute",
            float: "right",
            left: "65%",
            top: "50%",
            width: "20%",
          }}
        >
          {type === "channel" ? (
            <IconButton aria-label="addChannel">
              <AddCircleIcon />
            </IconButton>
          ) : null}
        </ListItemSecondaryAction>
      </List>
      <Collapse in={show} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items ? (
            items.map((text) => {
              return (
                <ListItem dense button className={classes.nested}>
                  #
                  <ListItemText
                    disableTypography
                    className={classes.item}
                    primary={text}
                  />
                </ListItem>
              );
            })
          ) : (
            <ListItemText primary="No channels found" />
          )}
        </List>
      </Collapse>
    </>
  );
}
