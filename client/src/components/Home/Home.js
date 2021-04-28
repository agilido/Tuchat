import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles.css";
import Dashboard from "./Dashboard";
import { ChannelContext } from "../../context/channel";
import { UserContext } from "../../context/user";

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
        const { data } = await axios.get("/api/private", config);
        console.log(data);
        setPrivateData(data.data);
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

  const getChannels = async () => {
    try {
      const { data } = await axios.get("/api/channel/get", config);
      if (data) {
        setChannelItems(data);
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

  const [activeChannel, setActiveChannel] = useState(null);

  return (
    <div>
      <ChannelContext.Provider value={{ activeChannel, setActiveChannel }}>
        <UserContext.Provider value={{ currentUser }}>
          <Dashboard channelItems={channelItems} getChannels={getChannels} />
        </UserContext.Provider>
      </ChannelContext.Provider>
      {error && <span>{error}</span>}
    </div>
  );
};

export default Home;
