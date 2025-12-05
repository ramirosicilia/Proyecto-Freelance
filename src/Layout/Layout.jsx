import React from 'react'
import {useLocation , Outlet} from "react-router-dom"
import Sliders from '../Components/Sliders/Sliders'



const Layout = () => { 

  const location=useLocation() 
  const home=location.pathname==="/"



   return (
    <div>
      {home && <Sliders/>}
       
       <Outlet/>
      
    </div>
  )
}

export default Layout
