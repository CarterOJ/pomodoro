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
        <div className="auth-area">
            <div className="left-block"></div>
            <div className="right-block"></div>
            <form className="auth-block" onSubmit={handleLogin}>
                <div className="auth-text">Login</div>
                <div className="input-block">
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
                <button className="auth-button">LOGIN</button>
                <Link className="auth-link" to="/signup">Sign Up</Link>
            </form>
        </div>
    );
}