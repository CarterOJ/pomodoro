import { Timer } from './Timer';
import { Tasks } from './Tasks';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

export function Home() {
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

    useEffect(() => {
        (async () => {
            const valid = await isAccessValid();
            if (!valid) {
                localStorage.clear();
                navigate("/login");
            }
        })();
    }, []);

    return (
        <div id="timer-area">
            <div className="spacer-div" id="welcome-container">
                <div id="welcome-text">Welcome, {username}</div>
            </div>
            <Timer />
            <Tasks />
            <div className="spacer-div"></div>
        </div>
    );
}