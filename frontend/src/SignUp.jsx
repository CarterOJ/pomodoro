import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function SignUp() {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const navigate = useNavigate();

    async function handleSignUp(e) {
        e.preventDefault();
        if (newPassword === confirmedPassword) {
            const res = await fetch("http://localhost:8000/api/users/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username: newUsername, password: newPassword})
            });
            if (res.ok) {
                navigate("/login");
            } else {
                alert("Sign up failed!")
            }
        } else {
            alert("Passwords do not match!");
        }
    }

    return (
        <div className="auth-area">
            <div className="left-block"></div>
            <div className="right-block"></div>
            <form className="auth-block" onSubmit={handleSignUp}>
                <div className="auth-text">Sign Up</div>
                <div className="input-block">
                    <div>
                        <div>Username</div>
                        <input 
                            className="auth-inputs"
                            type="text" 
                            placeholder="Type your username"
                            onChange={e => setNewUsername(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <div>Password</div>
                        <input 
                            className="auth-inputs" 
                            type="password" 
                            placeholder="Type your password"
                            onChange={e => setNewPassword(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <div>Confirm Password</div>
                        <input 
                            className="auth-inputs" 
                            type="password" 
                            placeholder="Retype your password"
                            onChange={e => setConfirmedPassword(e.target.value)}
                        ></input>
                    </div>
                </div>
                <button className="auth-button">SIGN UP</button>
                <Link className="auth-link" to="/login">Login</Link>
            </form>
        </div>
    );
}