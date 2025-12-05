import React from 'react'
import Header from './Components/Headers/Header'
import Sliders from "../src/Components/Sliders/Sliders"
import RouterApp from "../src/routers/RouterApp"


import Footer from "./Components/Footer/Footer";

const App = () => {
  return (
    <>
    <Header/>

 
     <RouterApp/> 


     <Footer/>

    </>
  )
}

export default App