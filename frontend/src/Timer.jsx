import { useRef, useState, useEffect } from 'react';

export function Timer() {
    const [startSecond, setStartSecond] = useState("00");
    const [startMinute, setStartMinute] = useState("00");
    const [startHour, setStartHour] = useState("00");
    const [second, setSecond] = useState("00");
    const [minute, setMinute] = useState("00");
    const [hour, setHour] = useState("00");
    const startTimeRef = useRef(null);
    const timerRef = useRef(null);

    function advanceTimer() {
            const now = performance.now();
            const elapsedSecs = Math.floor((now - startTimeRef.current) / 1000);
            const remainingSecs = parseInt(startHour) * 3600 + parseInt(startMinute) * 60 + parseInt(startSecond) - elapsedSecs;
            if (remainingSecs < 0) {
                alert("Time's up!");
                return;
            }
            const hours = Math.floor(remainingSecs / 3600);
            const mins = Math.floor(remainingSecs % 3600 / 60);
            const secs = remainingSecs % 60;
            setHour(String(hours).padStart(2, '0'));
            setMinute(String(mins).padStart(2, '0'));
            setSecond(String(secs).padStart(2, '0'));
            const expectedNext = startTimeRef.current + (elapsedSecs + 1) * 1000;
            const delay = Math.max(0, expectedNext - performance.now());    
            timerRef.current = setTimeout(advanceTimer, delay);
    }

    function startTimer() {
        if (timerRef.current) clearTimeout(timerRef.current);
        startTimeRef.current = performance.now();
        advanceTimer();
    }

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <div id="timer-block">
            <div id="timer">{hour}:{minute}:{second}</div>
            <button id="start-button" onClick={startTimer}>Start</button>
            <input onBlur={e => setStartHour(e.target.value)}></input>
            <input onBlur={e => setStartMinute(e.target.value)}></input>
            <input onBlur={e => setStartSecond(e.target.value)}></input>
        </div>
    );
}