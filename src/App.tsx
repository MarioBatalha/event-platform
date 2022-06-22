import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { client } from "./lib/apollo";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Video from "./components/Video";
import Lesson from "./components/Lesson";

const App = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <Video />
      <Lesson />
    </div>
  );
};

export default App;
