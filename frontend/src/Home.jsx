import { Timer } from './Timer';
import { Tasks } from './Tasks';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from 'jwt-decode';
import LogoutIcon from '@mui/icons-material/Logout';

export function Home() {
    const [time, setTime] = useState("00:10:00");
    const [startingTimerTime, setStartingTimerTime] = useState("00:10:00");
    const [startingWorkTime, setStartingWorkTime] = useState("00:25:00");
    const [startingShortBreakTime, setStartingShortBreakTime] = useState("00:05:00");
    const [startingLongBreakTime, setStartingLongBreakTime] = useState("00:15:00");
    const [passedSetFunctions, setPassedSetFunctions] = useState([]);
    const [taskForm, setTaskForm] = useState(false);
    const [borderColor, setBorderColor] = useState("#1a1a1a");
    const [timerStarted, setTimerStarted] = useState(false);
    const [timerReset, setTimerReset] = useState(true);
    const [timerPaused, setTimerPaused] = useState(false);
    const [tabsClicked, setTabsClicked] = useState({
        "tab-one": true, 
        "tab-two": false, 
        "tab-three": false, 
        "tab-four": false
    });

    const timerRef = useRef(null);

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
        restartTimer();
        switch (id) {
            case "tab-one":
                setBorderColor("#1a1a1a");
                setTime(startingTimerTime);
                setPassedSetFunctions([startingTimerTime, setStartingTimerTime]);
                break;
            case "tab-two":
                setBorderColor("#33b5e5");
                setTime(startingWorkTime);
                setPassedSetFunctions([startingWorkTime, setStartingWorkTime]);
                break;
            case "tab-three":
                setBorderColor("#FF6F00");
                setTime(startingShortBreakTime);
                setPassedSetFunctions([startingShortBreakTime, setStartingShortBreakTime]);
                break;
            case "tab-four":
                setBorderColor("#8B0000");
                setTime(startingLongBreakTime);
                setPassedSetFunctions([startingLongBreakTime, setStartingLongBreakTime]);
                break;
        }
        setTabsClicked(prev => {
            const newTabsClicked = {};
            for (const key in prev) {
                newTabsClicked[key] = key === id;
            }
            return newTabsClicked;
        });
    }

    function tab(id, text) {
        return (
            <svg 
                id={id} className="tab" width="120" height="36" data-clicked={tabsClicked[id]} tabIndex={1}>
                <defs>
                    <symbol id={`${id}-chrome-tab-geometry-left`} viewBox="0 -2 120 36">
                        <path 
                            d="M17 0h85v36H0v-2c4 0 9-3 9-8V8c0-4 3-8 8-8z"
                            fill="#222222"
                            stroke={tabsClicked[id] ? borderColor : null}
                            strokeWidth="2"/>
                    </symbol>
                    <symbol id={`${id}-chrome-tab-geometry-right`} viewBox="0 -2 120 36">
                        <use xlinkHref={`#${id}-chrome-tab-geometry-left`}/>
                    </symbol>
                </defs>
                <svg width="52%" height="100%" onMouseDown={() => handleTabClick(id)}>
                    <use xlinkHref={`#${id}-chrome-tab-geometry-left`} width="120" height="36" style={{ cursor: "pointer" }}/>
                </svg>
                <g transform="scale(-1, 1)">
                    <svg width="52%" height="100%" x="-100%" y="0" onMouseDown={() => handleTabClick(id)}>
                        <use xlinkHref={`#${id}-chrome-tab-geometry-left`} width="120" height="36" style={{ cursor: "pointer" }}/>
                    </svg>
                </g>
                <text 
                    className="tab-text" x="50%" y="50%" fontSize="15" textAnchor="middle" dy="6px" fill="white" pointerEvents="none">
                    {text}
                </text>
            </svg>
        );
    }

    function restartTimer() {
        clearTimeout(timerRef.current);
        setTime(passedSetFunctions[0]);
        setTimerStarted(false);
        setTimerReset(true);
        setTimerPaused(false);
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
            <Timer 
                taskForm={taskForm} 
                borderColor={borderColor} 
                time={time} 
                setTime={setTime}
                setStartTime={passedSetFunctions[1]}
                handleTabClick={handleTabClick}
                tabsClicked={tabsClicked}
                timerStarted={timerStarted}
                setTimerStarted={setTimerStarted}
                timerPaused={timerPaused}
                setTimerPaused={setTimerPaused}
                timerReset={timerReset}
                setTimerReset={setTimerReset}
                timerRef={timerRef}
                restartTimer={restartTimer}
                />
            <Tasks taskForm={taskForm} setTaskForm={setTaskForm} authenticate={authenticate}/>
        </div>
    );
}