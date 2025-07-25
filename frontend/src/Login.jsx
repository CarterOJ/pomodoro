import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:8000/api/users/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password})
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            localStorage.setItem("username", data.username);
            navigate("/");
        } else {
            alert("Login failed!")
        }
    }

    return (
        <div id="auth-area">
            <div id="left-block"></div>
            <div id="right-block"></div>
            <form id="auth-block" onSubmit={handleLogin}>
                <div id="auth-text">Login</div>
                <div id="input-block">
                    <div>
                        <div>Username</div>
                        <input 
                            className="auth-inputs" 
                            type="text" 
                            placeholder="Type your username"
                            onChange={e => setUsername(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <div>Password</div>
                        <input 
                            className="auth-inputs" 
                            type="password" 
                            placeholder="Type your password"
                            onChange={e => setPassword(e.target.value)}
                        ></input>
                    </div>
                </div>
                <button id="auth-button">LOGIN</button>
                <Link id="auth-link" to="/signup">Sign Up</Link>
            </form>
        </div>
    );
}