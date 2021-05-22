import React, { useState, useEffect, useContext } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
// Context
import { ChannelContext } from "../../context/channel";
import { UserContext } from "../../context/user";

import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import axios from "axios";
import { Button, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),

    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    width: "40ch",
    [theme.breakpoints.down("sm")]: {
      width: "25ch",
    },
  },
  searchResults: {
    background: "#265a8f",

    position: "absolute",
    width: "100%",
    borderRadius: "4px",
  },
  searchHint: {
    display: "flex",
    "&:hover": {
      backgroundColor: "#406e9c",
    },
    padding: "10px",
    borderRadius: "4px",
  },
  result: {
    width: "100%",
  },
  action: {
    display: "flex",
    alignItems: "center",
    justifyContent: "right",
  },
}));

export default function SearchBar({ getChannels, channelItems }) {
  const classes = useStyles();

  const [channels, setChannels] = useState([]);
  const [query, setQuery] = useState("");
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [hintList, setHintList] = useState(null);
  const [channelsIds, setChannelsIds] = useState([]);

  const { setActiveChannel } = useContext(ChannelContext);
  const { currentUser } = useContext(UserContext);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  useEffect(() => {
    if (channelItems) {
      setChannelsIds(channelItems.map((item) => item.channelId));
    }
  }, [channelItems]);

  // On ESC hide emoji picker

  const getAllChannels = async () => {
    if (hintList) {
      setShowHintPanel(true);
    }
    try {
      const { data } = await axios.get("/api/channel/getall", config);
      if (data) {
        setChannels(data);
      }
    } catch (error) {
      if (error) {
        console.log(error.message);
      }
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    setShowHintPanel(true);
    setHintList(
      channels.filter((channel) => {
        const upperCaseName = channel.name.toUpperCase();
        return upperCaseName.match(query.toUpperCase());
      })
    );
    if (query === "") {
      setHintList("");
    }
  }, [query]);

  const joinChannel = async (chId, chName) => {
    const channelData = {
      channelId: chId,
      channelName: chName,
      favorite: false,
    };

    console.log(channelData);
    try {
      await axios
        .post("/api/channel/joinchannel", { channelData }, config)
        .then(() => {
          getChannels();
          setShowHintPanel(false);
          setQuery("");
        });
    } catch (error) {}
  };

  const getActiveChannel = async (channelId) => {
    try {
      const { data } = await axios.get(`/api/channel/${channelId}`, config);
      if (data) {
        setActiveChannel(data.channel);
        setShowHintPanel(false);
        setQuery("");
      }
    } catch (error) {
      return console.log(error.message);
    }
  };

  useEffect(() => {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.keyCode === 27) {
          setShowHintPanel(false);
        }
      },
      false
    );
  }, []);

  useEffect(() => {
    document.addEventListener("click", (event) => {
      const searchArea = document.querySelector("#searchArea");
      if (searchArea) {
        if (!searchArea.contains(event.target)) {
          setShowHintPanel(false);
        }
      }
    });
  }, []);

  return (
    <div id="searchArea">
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          required
          inputProps={{ "aria-label": "search" }}
          value={query}
          onClick={getAllChannels}
          onChange={handleChange}
        />
        {showHintPanel && hintList ? (
          <div className={classes.searchResults}>
            {hintList &&
              hintList.map((channelHint, index) => {
                return (
                  <div key={index} className={classes.searchHint}>
                    <div
                      className={classes.result}
                      onClick={
                        currentUser.userId === channelHint.owner.userId ||
                        channelsIds.includes(channelHint.channelId)
                          ? () => {
                              getActiveChannel(channelHint.channelId);
                            }
                          : null
                      }
                      style={
                        currentUser.userId === channelHint.owner.userId ||
                        channelsIds.includes(channelHint.channelId)
                          ? { cursor: "pointer" }
                          : null
                      }
                    >
                      <Typography
                        variant="h6"
                        noWrap
                        style={{
                          textAlign: "left",
                          fontSize: "25px",
                          userSelect: "none",
                        }}
                      >
                        # {channelHint.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{
                          color: "#E0E0E0",
                          textAlign: "left",
                          userSelect: "none",
                        }}
                      >
                        Owner: {channelHint.owner.username} <br></br>
                        {channelHint.description}
                      </Typography>
                    </div>
                    <div className={classes.action}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          joinChannel(channelHint.channelId, channelHint.name);
                        }}
                        disabled={
                          currentUser.userId === channelHint.owner.userId ||
                          channelsIds.includes(channelHint.channelId)
                            ? true
                            : false
                        }
                        style={
                          currentUser.userId === channelHint.owner.userId ||
                          channelsIds.includes(channelHint.channelId)
                            ? { cursor: "default", color: "grey" }
                            : null
                        }
                      >
                        {currentUser.userId === channelHint.owner.userId ||
                        channelsIds.includes(channelHint.channelId)
                          ? "Joined"
                          : "Join"}
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
