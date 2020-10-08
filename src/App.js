import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./icons.css";
import "./App.css";
import Home from "./pages/Home";
import Header from "./components/Header";

const App = () => {
  return (
    <>
      <Router>
        <header>
          <Header />
        </header>
        <main>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </main>
      </Router>
    </>
  );
};

export default App;
