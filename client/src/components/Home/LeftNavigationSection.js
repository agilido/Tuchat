import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// icons
import StarBorder from "@material-ui/icons/StarBorder";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import FolderIcon from "@material-ui/icons/Folder";
// structure items

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
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

        <Collapse in={show} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* <ListItem button className={classes.nested}>
              <ListItemText primary="Room 1" />
            </ListItem> */}
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
      </List>
    </>
  );
}
