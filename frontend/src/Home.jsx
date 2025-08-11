import { Timer } from './Timer';
import { Tasks } from './Tasks';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import LogoutIcon from '@mui/icons-material/Logout';

export function Home() {
    const [taskForm, setTaskForm] = useState(false);

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

    useEffect(() => {
        authenticate();
    }, []);

    return (
        <div id="timer-area">
            <button 
                tabIndex={1} 
                id="logout-button" 
                inert={taskForm}
                onClick={e => {
                    localStorage.clear();
                    navigate("/login");
                }}>
                    <LogoutIcon fontSize='large'/>
            </button>
            <div id="welcome-container">
                <div id="welcome-text">Welcome, {username}</div>
            </div>
            <Timer taskForm={taskForm}/>
            <Tasks taskForm={taskForm} setTaskForm={setTaskForm} authenticate={authenticate}/>
        </div>
    );
}