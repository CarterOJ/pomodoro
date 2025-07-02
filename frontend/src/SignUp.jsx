import { Link } from 'react-router-dom';

export function SignUp() {
    return (
        <div className="auth-area">
            <div className="left-block"></div>
            <div className="right-block"></div>
            <div className="auth-block">
                <div className="auth-text">Sign Up</div>
                <div className="input-block">
                    <div>
                        <div>Username</div>
                        <input className="auth-inputs" type="text" placeholder="Type your username"></input>
                    </div>
                    <div>
                        <div>Password</div>
                        <input className="auth-inputs" type="password" placeholder="Type your password"></input>
                    </div>
                    <div>
                        <div>Confirm Password</div>
                        <input className="auth-inputs" type="password" placeholder="Type your password"></input>
                    </div>
                </div>
                <button className="auth-button">SIGN UP</button>
                <Link className="auth-link" to="/login">Login</Link>
            </div>
        </div>
    )
}