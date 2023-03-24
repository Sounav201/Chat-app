import React, {useState, createContext } from "react";

export const userContext = createContext();
export const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  
  return (
    <userContext.Provider value={{user, setUser}}>
      {props.children}
    </userContext.Provider>
  );
}
