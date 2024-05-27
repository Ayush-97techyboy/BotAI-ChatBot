import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Chat from "../src/components/Chat/Chat";
import Feedback from "../src/components/Feedback/Feedback";
import Navbar from "../src/components/Navbar/Navbar";
// import styles from "./App.module.css";

const App = () => (
  <Router>
    <div className={styles.app}>
      <Navbar />
      <div className={styles.content}>
        <Switch>
          <Route exact path="/" component={Chat} />
          <Route path="/feedback" component={Feedback} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App();