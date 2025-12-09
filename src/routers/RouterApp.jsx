
import React from 'react';
import { Routes,Route } from "react-router-dom";
import Layout from "../Layout/Layout"
import Services from "../Pages/Services";
import Shifts from "../Pages/Shifts";
import Contact from "../Pages/Contact";
import Projects from "../Pages/Projects";
import { Paquetes } from '../Pages/Paquetes';
import {ScrollToTop} from "../Components/ScrollToTop"




const RouterApp = () => {
  return (
    <> 
         <ScrollToTop/> 
         
          <Routes>

            <Route path='/' element={<Layout/>}>
            <Route path='services' element={<Services/>}></Route>
            <Route path='shifts' element={<Shifts/>}></Route>
            <Route path='projects' element={<Projects/>}></Route>
            <Route path='contact' element={<Contact/>}></Route> 
             <Route path='services/paquetes'element={<Paquetes/>}></Route>
            </Route> 


           

           </Routes>
       
    </>
  );
}

export default RouterApp;
