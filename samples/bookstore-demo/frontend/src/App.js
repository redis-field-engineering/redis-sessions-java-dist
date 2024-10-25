import logo from './logo.svg';
import './App.css';
import Login from './Components/login'
import React, {useEffect, useState} from "react";
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import Signup from "./Components/signup";
import Home from "./Components/home";

import 'bootstrap/dist/css/bootstrap.min.css';
import Cart from "./Components/cart";
import Logout from "./Components/logout";
import Admin from "./Components/admin";

function App() {

  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/admin" element={<Admin/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="login" element={<Login/>}/>
            <Route path="signup" element={<Signup/>}/>
            <Route path="cart" element={<Cart/>}/>
        </Routes>
      </BrowserRouter>


  );
}

export default App;
