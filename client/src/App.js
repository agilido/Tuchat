import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Access/Login";
import Register from "./components/Access/Register";
import fpassword from "./components/Access/fpassword";
import resetpassword from "./components/Access/resetpassword";
import Home from "./components/Home/Home";
function App() {
  return (
    <Router>
      <div className="App">
        <CssBaseline />
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/fpassword" component={fpassword} />
          <Route
            exact
            path="/resetpassword/:resetToken"
            component={resetpassword}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
