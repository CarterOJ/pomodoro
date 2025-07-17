import { useRef, useState, useEffect } from 'react';

export function Timer() {
    const [time, setTime] = useState("00:00:00");
    const [timerStarted, setTimerStarted] = useState(false);
    const startTimeRef = useRef(null);
    const timerRef = useRef(null);
    const cursorRef = useRef(null);

    const digits = time.replace(/:/g, "");
    const hoursTens = digits.charAt(0);
    const hoursOnes = digits.charAt(1);
    const minutesTens = digits.charAt(2);
    const minutesOnes = digits.charAt(3);
    const secondsTens = digits.charAt(4);
    const secondsOnes = digits.charAt(5);

    function advanceTimer() {
            const now = performance.now();
            const elapsedSecs = Math.floor((now - startTimeRef.current) / 1000);
            const remainingHourSecs = parseInt(hoursTens) * 36000 + parseInt(hoursOnes) * 3600;
            const remainingMinuteSecs = parseInt(minutesTens) * 600 + parseInt(minutesOnes) * 60;
            const remainingSecs = parseInt(secondsTens) * 10 + parseInt(secondsOnes);
            const remaingTotalSeconds = remainingHourSecs + remainingMinuteSecs + remainingSecs - elapsedSecs;
            if (remaingTotalSeconds < 0) {
                clearTimeout(timerRef.current);
                alert("Time's up!");
                return;
            }
            const hours = Math.floor(remaingTotalSeconds / 3600);
            const mins = Math.floor(remaingTotalSeconds % 3600 / 60);
            const secs = remaingTotalSeconds % 60;
            setTime(String(Math.floor(hours / 10)) +
                String(hours % 10) +
                ":" +
                String(Math.floor(mins / 10)) +
                String(mins % 10) + 
                ":" +
                String(Math.floor(secs / 10)) +
                String(secs % 10));         
            const expectedNext = startTimeRef.current + (elapsedSecs + 1) * 1000;
            const delay = Math.max(0, expectedNext - performance.now());    
            timerRef.current = setTimeout(advanceTimer, delay);
    }

    function startTimer() {
        if (timerRef.current) clearTimeout(timerRef.current);
        startTimeRef.current = performance.now();
        advanceTimer();
        setTimerStarted(true);
    }

    function handleKeyDown(e) {
        const isDigit = /^\d$/.test(e.key);
        if (isDigit) {
            const shifted = digits.slice(1) + e.key;
            const newTime = shifted.replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3");
            setTime(newTime);
        } else if (e.key === "Backspace") {
            const shifted = "0" + digits.slice(0, -1);
            const newTime = shifted.replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3");
            setTime(newTime);
        }
    }

    function timeInput(unit, ref) {
        return (
            <input
                className="timer-unit"
                type="text"
                value={unit}
                onKeyDown={handleKeyDown}
                onChange={() => {}}
                tabIndex={-1}
                ref={ref}
            ></input>
        )
    }

    function pauseTimer() {
        clearTimeout(timerRef.current);
        setTimerStarted(false);
    }

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <div id="timer-block">
            <div
                id="timer-units"
                onClick={() => {
                    setTimeout(() => {
                        cursorRef.current.setSelectionRange(1, 1);
                    }, 100)
                }} 
                onFocus={() => {
                    setTimeout(() => {
                        cursorRef.current.focus();
                    }, 100)
                }}
                onKeyDown={e => {
                    if (e.key === "Home" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
                        setTimeout(() => {
                            cursorRef.current.setSelectionRange(1, 1);
                        }, 100)
                    }
                }}
                tabIndex={1}
                >
                {timeInput(hoursTens)}
                {timeInput(hoursOnes)}:
                {timeInput(minutesTens)}
                {timeInput(minutesOnes)}:
                {timeInput(secondsTens)}
                {timeInput(secondsOnes, cursorRef)}
            </div>
            {timerStarted === false ? 
                <button id="start-button" onClick={startTimer}>Start</button> :
                <div>
                    <button onClick={pauseTimer}>Pause</button>
                </div>}
        </div>
    );
}