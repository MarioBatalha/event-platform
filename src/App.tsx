import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { client } from "./lib/apollo";
import Event from "./pages/Event";

const App = () => {
  return (
      <Event />
  );
};

export default App;
