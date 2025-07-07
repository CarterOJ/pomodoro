import { useRef, useState, useEffect } from 'react';

export function Timer() {
    const [second, setSecond] = useState("00");
    const [minute, setMinute] = useState("00");
    const [hour, setHour] = useState("00");
    const startTimeRef = useRef(null);
    const timerRef = useRef(null);
    const secondRef = useRef(null);
    const minuteRef = useRef(null);
    const hourRef = useRef(null);

    function advanceTimer() {
            const now = performance.now();
            const elapsedSecs = Math.floor((now - startTimeRef.current) / 1000);
            const remainingSecs = parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second) - elapsedSecs;
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

    function timeInput(unit, setUnit, label, ref) {
        return (
            <input
                className="unit"
                type="text"
                value={unit}
                onChange={e => {
                    setUnit(e.target.value);
                }}
                onBlur={e => {
                    if (e.target.value === "") setUnit("00");
                }}
                onKeyDown={e => {
                    if ((e.key === "ArrowLeft") && e.target.selectionStart <= 1) {
                        e.preventDefault();
                        if (label === "second") {
                            minuteRef.current.focus();
                        } else if (label === "minute") {
                            hourRef.current.focus();
                        }
                    } else if (e.key === "ArrowRight" && e.target.selectionStart >= e.target.value.length) {
                        e.preventDefault();
                        if (label === "hour") {
                            minuteRef.current.focus();
                        } else if (label === "minute") {
                            secondRef.current.focus();
                        }
                    }
                }}
                ref={ref}
            ></input>
        )
    }

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <div id="timer-block">
            <div>
                {timeInput(hour, setHour, "hour", hourRef)}:
                {timeInput(minute, setMinute, "minute", minuteRef)}:
                {timeInput(second, setSecond, "second", secondRef)}
            </div>
            <button id="start-button" onClick={startTimer}>Start</button>
        </div>
    );
}