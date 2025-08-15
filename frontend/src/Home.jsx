import { Timer } from './Timer';
import { Tasks } from './Tasks';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import LogoutIcon from '@mui/icons-material/Logout';

export function Home() {
    const [taskForm, setTaskForm] = useState(false);
    const [borderColor, setBorderColor] = useState("#1a1a1a");
    const [tabsClicked, setTabsClicked] = useState({
        "tab-one": true, 
        "tab-two": false, 
        "tab-three": false, 
        "tab-four": false
    });

    const username = localStorage.getItem("username");

    const navigate = useNavigate();

    async function refreshToken() {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) return false;
        const res = await fetch("http://localhost:8000/api/users/login/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({refresh})
        });
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("access", data.access);
            return true;
        }
        return false;
    }

    async function isAccessValid() {
        const access = localStorage.getItem("access");
        if (!access) return false;
        const decoded = jwtDecode(access);
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime < decoded.exp) return true;
        const refreshSuccess = await refreshToken();
        return refreshSuccess;
    }

    async function authenticate() {
        const valid = await isAccessValid();
        if (!valid) {
            localStorage.clear();
            navigate("/login");
        }     
    }

    function handleTabClick(id) {
        setTabsClicked(prev => {
            const newTabsClicked = {};
            for (const key in prev) {
                newTabsClicked[key] = key === id;
            }
            switch (id) {
                case "tab-one":
                    setBorderColor("#1a1a1a");
                    break;
                case "tab-two":
                    setBorderColor("blue");
                    break;
                case "tab-three":
                    setBorderColor("yellow");
                    break;
                case "tab-four":
                    setBorderColor("red");
                    break;
            }
            console.log(borderColor);
            return newTabsClicked;
        });
    }

    function tab(id, text) {
        return (
            <svg 
                id={id} className="tab" width="119.5" height="37" data-clicked={tabsClicked[id]}>
                <defs>
                    <symbol id={`${id}-chrome-tab-geometry-left`} viewBox="0 -1 119.5 36">
                        <path 
                            d="M17 0h85v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z"
                            fill="#222222"
                            stroke={tabsClicked[id] && borderColor}/>
                    </symbol>
                    <symbol id={`${id}-chrome-tab-geometry-right`} viewBox="0 -1 119.5 36">
                        <use xlinkHref={`#${id}-chrome-tab-geometry-left`}/>
                    </symbol>
                </defs>
                <svg width="52%" height="100%" onClick={() => handleTabClick(id)}>
                    <use xlinkHref={`#${id}-chrome-tab-geometry-left`} width="119.5" height="35"/>
                </svg>
                <g transform="scale(-1, 1)">
                    <svg width="52%" height="100%" x="-100%" y="0" onClick={() => handleTabClick(id)}>
                        <use xlinkHref={`#${id}-chrome-tab-geometry-left`} width="119.5" height="35"/>
                    </svg>
                </g>
                <text x="50%" y="50%" fontSize="15" textAnchor="middle" dy="5px" fill="white" pointerEvents="none">
                    {text}
                </text>
            </svg>
        );
    }

    useEffect(() => {
        authenticate();
    }, []);

    return (
        <div id="timer-area">
            <button 
                tabIndex={1} 
                id="logout-button" 
                inert={taskForm}
                onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                }}>
                    <LogoutIcon fontSize='large'/>
            </button>
            <div id="welcome-container">
                <div id="welcome-text">Welcome, {username}</div>
            </div>
            <div id="tabs-container">
                {tab("tab-one", "Timer")}
                {tab("tab-two", "Work")}
                {tab("tab-three", "Short Break")}
                {tab("tab-four", "Long Break")}
            </div>
            <Timer taskForm={taskForm} borderColor={borderColor}/>
            <Tasks taskForm={taskForm} setTaskForm={setTaskForm} authenticate={authenticate}/>
        </div>
    );
}