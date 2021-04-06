import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

import LeftNavigationSection from "./LeftNavigationSection";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    color: "white",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  logoutButton: {
    margin: "10px",
    maxWidth: "100px",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(8) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function LeftNavigation() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [openStarredList, setOpenStarredList] = useState(true);
  const [openChannelList, setOpenChannelList] = useState(true);

  const handleDrawerPosition = (e) => {
    if (open) {
      setOpen(false);
      setOpenStarredList(false);
      setOpenChannelList(false);
    } else {
      setOpen(true);
    }
  };
  let history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };
  return (
    <div className={classes.root}>
      <CssBaseline />

      {/* Hiding */}
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerPosition}
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {"<CHANNEL #> || other panel"}
          </Typography>
          <Grid container justify="flex-end">
            <Button
              variant="contained"
              color="secondary"
              className={classes.logoutButton}
              onClick={handleLogout}
            >
              Log out
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar} />
        <Divider />

        <LeftNavigationSection
          show={openStarredList}
          setShow={setOpenStarredList}
          title="Favorites"
          icon="star"
          items={["Piwnica", "Garaż", "Dach"]}
          open={open}
        />
        <LeftNavigationSection
          show={openChannelList}
          setShow={setOpenChannelList}
          title="Channels"
          type="channel"
          items={null}
          open={open}
        ></LeftNavigationSection>

        {/* <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
      </main>
    </div>
  );
}
