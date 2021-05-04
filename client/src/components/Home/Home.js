import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles.css";
import Dashboard from "./Dashboard";
import { ChannelContext } from "../../context/channel";
import { UserContext } from "../../context/user";
import { SocketContext, socket } from "../../context/socket";
export const Home = () => {
  const [error, setError] = useState("");
  const [PrivateData, setPrivateData] = useState("");

  let history = useHistory();
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/");
    }
    const fetchPrivateData = async () => {
      const config = {
        header: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      try {
        await axios.get("/api/private", config);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("Not authorized");
      }
      fetchPrivateData();
    };
  }, [history]);

  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("us")));
  }, []);

  // Get channels
  const [channelItems, setChannelItems] = useState([]);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  const [activeChannel, setActiveChannel] = useState({});

  const getChannels = async () => {
    try {
      const { data } = await axios.get("/api/channel/get", config);
      if (data) {
        setChannelItems(data);
        socket.emit("joinChannels", data);
      }
    } catch (error) {
      if (error.response.status === 500) {
        console.log("Can't connect to server");
      }
    }
  };
  useEffect(() => {
    getChannels();
  }, []);

  const leaveChannels = () => {
    socket.emit("leaveChannels", channelItems);
  };

  return (
    <div>
      <ChannelContext.Provider value={{ activeChannel, setActiveChannel }}>
        <UserContext.Provider value={{ currentUser }}>
          <SocketContext.Provider value={socket}>
            <Dashboard
              channelItems={channelItems}
              getChannels={getChannels}
              leaveChannels={leaveChannels}
            />
          </SocketContext.Provider>
        </UserContext.Provider>
      </ChannelContext.Provider>
      {error && <span>{error}</span>}
    </div>
  );
};

export default Home;
