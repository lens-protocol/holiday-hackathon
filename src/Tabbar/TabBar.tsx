import React from 'react';
import { Link } from 'react-router-dom';
import {WalletComponents} from './WalletComponents'
import './TabBar.css'
const TabBar: React.FC = () => {
    return (
      <header className="header">
        <nav className="nav">
          {/* <div className="brand">
            <img src="../logo.png" className="logo" />
            <div className="brandName">AI NFT Generator</div>
          </div> */}

          <ul className="nav_link">
            <Link
              to="/"
              style={{
                marginRight: "20px",
                textDecoration: "none",
                color: "black",
              }}
            >
              <div className="nav-text">Home</div> 
            </Link>
            <Link to="/chatBot" style={{ textDecoration: "none", color: "black" }}>
            <div className="nav-text">ChatBot App</div>
            </Link>
            <Link to="/mint" style={{ textDecoration: "none", color: "black" }}>
            <div className="nav-text">Mint App</div>
            </Link>
            <Link to="/marketPlace" style={{ textDecoration: "none", color: "black" }}>
            <div className="nav-text">Market Place</div>
            </Link>
          </ul>
          <WalletComponents />
        </nav>
      </header>
    );
};

export default TabBar;