
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Layout from "../Layout/Layout";
import Services from "../Pages/Services";
import Shifts from "../Pages/Shifts";
import Contact from "../Pages/Contact";
import Projects from "../Pages/Projects";
import { Paquetes } from '../Pages/Paquetes';
import { ScrollToTop } from "../Components/ScrollToTop";

const RouterApp = () => {
  return (
    <> 
      <ScrollToTop/> 
       
      <Routes>

        <Route path='/' element={<Layout />}>

          {/* Services */}
          <Route path='services' element={<Services />} />

          {/* Paquetes dentro de services */}
          <Route path='services/paquetes' element={<Paquetes />} />

          {/* Otras páginas */}
          <Route path='shifts' element={<Shifts />} />
          <Route path='projects' element={<Projects />} />
          <Route path='contact' element={<Contact />} />

        </Route>

      </Routes>
    
    </>
  );
}

export default RouterApp;
