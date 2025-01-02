// src/components/Home.js
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Home.css'; // Optional: Add custom styling

const Home = () => {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div className="home-container">
            <div className="tabs">
                <button
                    className={showLogin ? 'active' : ''}
                    onClick={() => setShowLogin(true)}
                >
                    Login
                </button>
                <button
                    className={!showLogin ? 'active' : ''}
                    onClick={() => setShowLogin(false)}
                >
                    Register
                </button>
            </div>

            <div className="form-container">
                {showLogin ? <Login /> : <Register />}
            </div>
        </div>
    );
};

export default Home;
