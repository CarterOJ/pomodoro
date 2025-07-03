import { Routes, Route } from 'react-router-dom';
import { Login } from './Login';
import { Home } from './Home';
import { SignUp } from './SignUp';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/" element={<Home />}/>
        </Routes>
    );
}

export default App;