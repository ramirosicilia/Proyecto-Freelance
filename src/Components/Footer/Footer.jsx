import React from 'react';
import {Link} from "react-router-dom"
import ChatBox from "../Chat/ChatBox"
import "../../styles/footer.css"


const Footer = () => { 

  
  return (
    <> 

    <div className="footer-container">
 
    {/* CHAT EN EL FOOTER */}
    <div className="footer-chat">
      <ChatBox />
    </div>
    </div>

  
    </>
  );
}

export default Footer;
