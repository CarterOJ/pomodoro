import { Link } from 'react-router-dom';

export function Login() {
    return (
        <div className="auth-area">
            <div className="left-block"></div>
            <div className="right-block"></div>
            <div className="auth-block">
                <div className="auth-text">Login</div>
                <div className="input-block">
                    <div>
                        <div>Username</div>
                        <input className="auth-inputs" type="text" placeholder="Type your username"></input>
                    </div>
                    <div>
                        <div>Password</div>
                        <input className="auth-inputs" type="password" placeholder="Type your password"></input>
                    </div>
                </div>
                <button className="auth-button">LOGIN</button>
                <Link className="auth-link" to="/signup">Sign Up</Link>
            </div>
        </div>
    );
}