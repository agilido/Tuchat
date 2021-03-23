import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const Home = () => {
  const style = {
    color: "white",
  };
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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };

  return (
    <div>
      {error && <span>{error}</span>}
      <h1 style={style}>YO IM CHAT HOME SCREEN</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
