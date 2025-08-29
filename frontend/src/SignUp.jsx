import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function SignUp({loading, setLoading}) {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const navigate = useNavigate();

    async function handleSignUp(e) {
        setLoading(true);
        e.preventDefault();
        if (newPassword === confirmedPassword) {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register/`, {
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
        setLoading(false);
    }

    return (
        <div id="auth-area">
            <div id="left-block"></div>
            <div id="right-block"></div>
            {loading ? <div>Creating Account...</div> : 
                <form id="auth-block" onSubmit={handleSignUp}>
                    <div id="auth-text">Sign Up</div>
                    <div id="input-block">
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
                        <button id="auth-button">SIGN UP</button>
                    <Link id="auth-link" to="/login">Login</Link>
                </form>
            }
        </div>
    );
}