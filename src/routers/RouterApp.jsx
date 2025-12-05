
import React from 'react';
import { Routes,Route } from "react-router-dom";
import Layout from "../Layout/Layout"
import Services from "../Pages/Services";
import Shifts from "../Pages/Shifts";
import Contact from "../Pages/Contact";
import Projects from "../Pages/Projects";




const RouterApp = () => {
  return (
    <> 

        <Routes>
            <Route path='/' element={<Layout/>}>
            
            <Route path='services' element={<Services/>}></Route>
            <Route path='shifts' element={<Shifts/>}></Route>
            <Route path='projects' element={<Projects/>}></Route>
            <Route path='contact' element={<Contact/>}></Route>
            </Route>

           

        </Routes>
      
    </>
  );
}

export default RouterApp;
