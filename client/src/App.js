import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";
import Landing from "./components/Access/Landing";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';
import Login from "./components/Access/Login";
import Register from "./components/Access/Register";
import Home from "./components/Home/Home";
function App() {
  return (
    <Router>
      <div className="App">
        <CssBaseline />
        <PrivateRoute exact path="/" component={Home}/>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </div>
    </Router>
  );
}

export default App;
