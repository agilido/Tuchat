import React, { useState, useEffect } from "react";
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
import ChannelHome from "./Channel/ChannelHome";
import AddChannelForm from "./AddChannelForm";

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
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
  },

  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function LeftNavigation({ channelItems, getChannels }) {
  const classes = useStyles();

  const data = localStorage.getItem("barPosition");
  const starredPosition = localStorage.getItem("starredPosition");
  const channelsPosition = localStorage.getItem("channelsPosition");
  const contactsPosition = localStorage.getItem("contactsPosition");

  const [open, setOpen] = useState(data ? JSON.parse(data) : true);

  const [showAddChannelForm, setShowAddChannelForm] = useState(false);

  const setShowAddChannelBox = () => {
    setShowAddChannelForm(true);
  };

  // <ToRefactor >
  const [openStarredList, setOpenStarredList] = useState(
    starredPosition ? JSON.parse(starredPosition) : true
  );
  const [openChannelList, setOpenChannelList] = useState(
    channelsPosition ? JSON.parse(channelsPosition) : true
  );
  const [openContactList, setOpenContactList] = useState(
    contactsPosition ? JSON.parse(contactsPosition) : true
  );

  useEffect(() => {
    if (data) {
      setOpen(JSON.parse(data));
      setOpenStarredList(JSON.parse(starredPosition));
      setOpenChannelList(JSON.parse(channelsPosition));
      setOpenContactList(JSON.parse(contactsPosition));
    }
  }, []);

  useEffect(() => {
    setLocalStorage("starredPosition", openStarredList);
  }, [openStarredList]);

  useEffect(() => {
    setLocalStorage("channelsPosition", openChannelList);
  }, [openChannelList]);
  useEffect(() => {
    setLocalStorage("contactsPosition", openContactList);
  }, [openContactList]);

  const setLocalStorage = (text, value) => {
    localStorage.setItem(text, JSON.stringify(value));
  };

  const handleDrawerPosition = (e) => {
    if (open) {
      setOpen(false);

      setOpenStarredList(false);
      setLocalStorage("starredPosition", openStarredList);

      setOpenChannelList(false);
      setLocalStorage("channelsPosition", openChannelList);
      setOpenContactList(false);
      setLocalStorage("contactsPosition", openContactList);

      setLocalStorage("barPosition", !open);
    } else {
      setOpen(true);

      if (starredPosition && channelsPosition) {
        setOpenStarredList(JSON.parse(starredPosition));
        setOpenChannelList(JSON.parse(channelsPosition));
        setOpenContactList(JSON.parse(contactsPosition));
      }

      setLocalStorage("barPosition", !open);
    }
  };
  // <ToRefactor />
  let history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };

  const starredChannels = channelItems.filter(
    (channel) => channel.favorite === true
  );
  const allChannels = channelItems.filter(
    (channel) => channel.favorite !== true
  );
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
          <Typography
            variant="h6"
            noWrap
            style={{
              width: "100%",
              textAlign: "left",
            }}
          >
            {"#Piwnicasdfgsfdgsdfg"}
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
        {/* FAVORITE CHANNELS */}
        <LeftNavigationSection
          show={openStarredList}
          setShow={setOpenStarredList}
          title="Favorites"
          type="stars"
          items={starredChannels}
          open={open}
        />
        {/* ALL CHANNELS */}
        <LeftNavigationSection
          show={openChannelList}
          setShow={setOpenChannelList}
          title="Channels"
          type="channel"
          items={allChannels}
          open={open}
          setShowChannelForm={setShowAddChannelForm}
          showAddChannelForm={showAddChannelForm}
        ></LeftNavigationSection>

        <Divider />
        {/* CONTACTS */}
        <LeftNavigationSection
          show={openContactList}
          setShow={setOpenContactList}
          title="Contacts"
          type="contacts"
          items={["sAS", "sAS"]}
          open={open}
        ></LeftNavigationSection>
      </Drawer>
      <Grid container>
        <div className={classes.toolbar} />
        <Grid container alignItems="flex-start">
          <ChannelHome />
        </Grid>
      </Grid>
      <AddChannelForm
        setShowChannelForm={setShowAddChannelForm}
        showAddChannelForm={showAddChannelForm}
        getChannels={getChannels}
      />
    </div>
  );
}
