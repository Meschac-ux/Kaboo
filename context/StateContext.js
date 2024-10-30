import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export default ContextProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [travelData, setTravelData] = useState("");
  const [location, setLocation] = useState(null);

  return (
    <StateContext.Provider
      value={{
        location,
        setLocation,
        user,
        travelData,
        setUser,
        setTravelData,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
