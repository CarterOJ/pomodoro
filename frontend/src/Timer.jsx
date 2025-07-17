import { useRef, useState, useEffect } from 'react';

export function Timer() {
    const [secondsOnes, setSecondsOnes] = useState("0");
    const [secondsTens, setSecondsTens] = useState("0");
    const [minutesOnes, setMinutesOnes] = useState("0");
    const [minutesTens, setMinutesTens] = useState("0");
    const [hoursOnes, setHoursOnes] = useState("0");
    const [hoursTens, setHoursTens] = useState("0");
    const [timerStarted, setTimerStarted] = useState(false);
    const startTimeRef = useRef(null);
    const timerRef = useRef(null);
    const cursorRef = useRef(null);

    const time = [hoursTens, hoursOnes, minutesTens, minutesOnes, secondsTens, secondsOnes];
    const unitSetters = [setHoursTens, setHoursOnes, setMinutesTens, setMinutesOnes, setSecondsTens, setSecondsOnes];

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
            setSecondsOnes(String(secs % 10));
            setSecondsTens(String(Math.floor(secs / 10)));
            setMinutesOnes(String(mins % 10));
            setMinutesTens(String(Math.floor(mins / 10)));
            setHoursOnes(String(hours % 10));
            setHoursTens(String(Math.floor(hours / 10)));           
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
            const newTime = [...time.slice(1), e.key];
            newTime.forEach((val, i) => unitSetters[i](val));
        } else if (e.key === "Backspace") {
            const newTime = ["0", ...time.slice(0, -1)];
            newTime.forEach((val, i) => unitSetters[i](val));
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