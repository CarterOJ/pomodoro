export function Login() {
    return (
        <div id="login-area">
            <div id="login-block">
                <div id="login-text">Login</div>
                <div id="input-block">
                    <div id="username-block">
                        <div>Username</div>
                        <input className="login-inputs" type="text" placeholder="Type your username"></input>
                    </div>
                    <div id="password-block">
                        <div>Password</div>
                        <input className="login-inputs" type="password" placeholder="Type your password"></input>
                    </div>
                </div>
                <button id="login-button">LOGIN</button>
            </div>
        </div>
    )
}