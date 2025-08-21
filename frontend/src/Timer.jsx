import { useRef, useState, useEffect } from 'react';

export function Timer({ 
    taskForm, borderColor, 
    time, setTime, 
    setStartTimes, handleTabClick,
    tabsClicked, timerStarted,
    setTimerStarted, timerPaused,
    setTimerPaused, timerReset, 
    setTimerReset, timerRef,
    restartTimer, updateWorkCycles, 
    completedWorkCycles, setCompletedWorkCycles,
    workCycles, setTaskSelected }) {
        const [editingTimer, setEditingTimer] = useState(false);

        const startTimeRef = useRef(null);
        const cursorRef = useRef(null);

        const digits = time.replace(/:/g, "");
        const hoursTens = digits.charAt(0);
        const hoursOnes = digits.charAt(1);
        const minutesTens = digits.charAt(2);
        const minutesOnes = digits.charAt(3);
        const secondsTens = digits.charAt(4);
        const secondsOnes = digits.charAt(5);

        function nextTab() {
            restartTimer();
            if (tabsClicked["tab-one"]) {
                alert("Time's Up!");
                return
            }
            else if (tabsClicked["tab-two"] && completedWorkCycles >= workCycles - 1) { 
                handleTabClick("tab-one");
                setCompletedWorkCycles(prev => {
                    updateWorkCycles(prev + 1);
                    return prev + 1;
                });
                setTaskSelected(false);

            } else if (tabsClicked["tab-two"] && completedWorkCycles % 4 === 3) {
                handleTabClick("tab-four");
                setCompletedWorkCycles(prev => {
                    updateWorkCycles(prev + 1);
                    return prev + 1;
                });
            } else if (tabsClicked["tab-two"]) {
                handleTabClick("tab-three");
                setCompletedWorkCycles(prev => {
                    updateWorkCycles(prev + 1);
                    return prev + 1;
                });
            } else {
                handleTabClick("tab-two");
            }
        }

        function advanceTimer() {
                const now = performance.now();
                const elapsedSecs = Math.floor((now - startTimeRef.current) / 1000);
                const remainingHourSecs = parseInt(hoursTens) * 36000 + parseInt(hoursOnes) * 3600;
                const remainingMinuteSecs = parseInt(minutesTens) * 600 + parseInt(minutesOnes) * 60;
                const remainingSecs = parseInt(secondsTens) * 10 + parseInt(secondsOnes);
                const remaingTotalSeconds = remainingHourSecs + remainingMinuteSecs + remainingSecs - elapsedSecs;
                if (remaingTotalSeconds < 0) {
                    nextTab();
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

        function handleKeyDown(e) {
            const isDigit = /^\d$/.test(e.key);
            const tab = Object.keys(tabsClicked).find(k => tabsClicked[k] === true)
            if (isDigit && !timerStarted && !timerPaused) {
                const shifted = digits.slice(1) + e.key;
                const newTime = shifted.replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3");
                setTime(newTime);
                setStartTimes(prev => ({...prev, [tab]: newTime}));
            } else if (e.key === "Backspace" && !timerStarted && !timerPaused) {
                const shifted = "0" + digits.slice(0, -1);
                const newTime = shifted.replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3");
                setTime(newTime);
                setStartTimes(prev => ({...prev, [tab]: newTime}));
            }
        }

        function timeInput(unit, ref=null) {
            return (
                <input
                    className="timer-unit"
                    type="text"
                    value={unit}
                    onKeyDown={handleKeyDown}
                    onChange={() => {}}
                    tabIndex={-1}
                    ref={ref}
                    readOnly={timerStarted || timerPaused}
                    data-paused={timerPaused}
                    data-editing={editingTimer}>
                </input>
            )
        }

        function startTimer(e) {
            if (timerRef.current) clearTimeout(timerRef.current);
            startTimeRef.current = performance.now();
            advanceTimer();
            setTimerStarted(true);
            setTimerReset(false);
            setTimerPaused(false);
            cursorRef.current.blur();
            e.currentTarget.blur();
        }

        function pauseTimer(e) {
            clearTimeout(timerRef.current);
            setTimerStarted(false);
            setTimerReset(false);
            setTimerPaused(true);
            e.currentTarget.blur();
        }

        function startGradient() {
            return (
                <svg height="24" width="24">
                    <defs>
                        <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            {timerPaused ? 
                                <>
                                    <stop offset="0%" stopColor="#FFA500" />
                                    <stop offset="100%" stopColor="#FF6F00" /> 
                                </> :
                                <>
                                    <stop offset="0%" stopColor="#00C851" />
                                    <stop offset="100%" stopColor="#33b5e5" /> 
                                </>
                            }
                        </linearGradient>
                    </defs>
                    <path 
                        d="M8 5v14l11-7z" 
                        fill="#222222">
                    </path>
                    <path 
                        className="gradient-path"
                        d="M8 5v14l11-7z" 
                        fill="url(#playGradient)">
                    </path>
                </svg>
            );
        }

        function pauseGradient() {
            return (
                <svg height="24" width="24">
                    <defs>
                        <linearGradient id="pauseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFA500" />
                            <stop offset="100%" stopColor="#FF6F00" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M6 19h4V5H6zm8-14v14h4V5z"
                        fill="#222222">
                    </path>
                    <path 
                        className="gradient-path"
                        d="M6 19h4V5H6zm8-14v14h4V5z"
                        fill="url(#pauseGradient)">
                    </path>
                </svg>
            );
        }

        function restartGradient() {
            return (
                <svg height="24" width="24">
                    <defs>
                        <linearGradient id="restartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF0033" />
                            <stop offset="100%" stopColor="#8B0000" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8" 
                        fill="#222222">
                    </path>
                    <path 
                        className="gradient-path"
                        d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8" 
                        fill="url(#restartGradient)">
                    </path>
                </svg>
            );
        }

        function advanceGradient() {
            return (
                <svg height="24" width="24">
                    <defs>
                        <linearGradient id="advanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8e2de2" />
                            <stop offset="100%" stopColor="#4a00e0" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="m6 18 8.5-6L6 6zM16 6v12h2V6z" 
                        fill="#222222">
                    </path>
                    <path 
                        className="gradient-path"
                        d="m6 18 8.5-6L6 6zM16 6v12h2V6z" 
                        fill="url(#advanceGradient)">
                    </path>
                </svg>
            );
        }

        function handleButtons() {
            if (timerReset === true) {
                return (
                    <>
                        <button 
                            className="timer-buttons" 
                            id="start-button" 
                            onClick={startTimer}>
                                {startGradient()}
                            </button>
                        {!tabsClicked["tab-one"] && <button 
                            type="button" 
                            className="timer-buttons" 
                            id="advance-button" 
                            onClick={e => {
                                e.currentTarget.blur();
                                nextTab();
                            }}>
                                {advanceGradient()}
                        </button>}
                    </>                     
                )
            } 
            return (
                <>
                    <div id="button-row">
                        <button 
                            type="button" 
                            className="timer-buttons" 
                            id="pause-button" 
                            onClick={timerStarted ? pauseTimer : startTimer}>
                                {timerStarted ? pauseGradient() : startGradient()}
                        </button>
                        <button 
                            type="button" 
                            className="timer-buttons" 
                            id="restart-button" 
                            onClick={restartTimer}>
                                {restartGradient()}
                        </button>
                    </div>
                    {!tabsClicked["tab-one"] && <button 
                        type="button" 
                        className="timer-buttons" 
                        id="advance-button" 
                        onClick={e => {
                            e.currentTarget.blur();
                            nextTab();
                        }}>
                            {advanceGradient()}
                    </button>}
                </>  
            )
        }

        useEffect(() => {
            return () => clearTimeout(timerRef.current);
        }, []);

        return (
            <form id="timer-block" inert={taskForm} data-border-color={borderColor}>
                <div
                    id="timer-units"
                    onClick={() => setTimeout(() => cursorRef.current.setSelectionRange(1, 1), 100)} 
                    onFocus={() => {
                        if (timerReset) setEditingTimer(true);
                        setTimeout(() => cursorRef.current.focus(), 100);
                    }}
                    onBlur={() => setEditingTimer(false)}
                    onKeyDown={e => {
                        if (e.key === "Home" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
                            setTimeout(() => cursorRef.current.setSelectionRange(1, 1), 100);
                        }
                    }}
                    tabIndex={timerStarted || timerPaused ? -1 : 1}
                    data-paused={timerPaused}
                    data-editing={editingTimer}>
                        {timeInput(hoursTens)}
                        {timeInput(hoursOnes)}:
                        {timeInput(minutesTens)}
                        {timeInput(minutesOnes)}:
                        {timeInput(secondsTens)}
                        {timeInput(secondsOnes, cursorRef)}
                </div>
                {handleButtons()}
            </form>
        );
    }   