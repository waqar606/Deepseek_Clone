import React, { useState } from "react";
import { Navigate, Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
// import { useAuth } from "./context/AuthProvider";
import { useAuth } from "./context/AuthProvider";

//agar user authencated to element
{/* <Navigate to="{/login}"/> */}

function App() {
  const [authUser] = useAuth();
  console.log(authUser);
  return (
    // <ChatProvider>
      <div>
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to={"/"} /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to={"/"} /> : <Signup />}
          />
        </Routes>
      </div>
    // </ChatProvider>
  );
}

export default App;
