import { Routes, Route } from 'react-router-dom';
import { Login } from './Login';
import { Home } from './Home';
import { SignUp } from './SignUp';
import { useState } from 'react';

function App() {
    const [loading, setLoading] = useState(false);
    const [startTransition, setStartTranstion] = useState(false);
    
    return (
        <Routes>
            <Route path="/login" element={<Login 
                loading={loading} 
                setLoading={setLoading} 
                startTransition={startTransition} 
                setStartTransition={setStartTranstion}/>
            }/>
            <Route path="/signup" element={<SignUp loading={loading} setLoading={setLoading}/>}/>
            <Route path="/" element={<Home startTransition={startTransition} setStartTransition={setStartTranstion}/>}/>
        </Routes>
    );
}

export default App;