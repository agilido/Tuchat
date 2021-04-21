import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles.css";
import Dashboard from "./Dashboard";

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
        setPrivateData(data.data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("Not authorized");
      }
      fetchPrivateData();
    };
  }, [history]);

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
        console.log(data);
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
    console.log("refresh");
  }, []);
  return (
    <div>
      <Dashboard channelItems={channelItems} getChannels={getChannels} />
      {error && <span>{error}</span>}
    </div>
  );
};

export default Home;
