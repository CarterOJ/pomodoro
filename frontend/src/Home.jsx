import { Timer } from './Timer';
import { Tasks } from './Tasks';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from 'jwt-decode';
import LogoutIcon from '@mui/icons-material/Logout';

export function Home({startTransition, setStartTransition}) {
    const [time, setTime] = useState("00:10:00");
    const [taskForm, setTaskForm] = useState(false);
    const [borderColor, setBorderColor] = useState("#1a1a1a");
    const [timerStarted, setTimerStarted] = useState(false);
    const [timerReset, setTimerReset] = useState(true);
    const [timerPaused, setTimerPaused] = useState(false);
    const [taskId, setTaskId] = useState();
    const [name, setName] = useState("");
    const [workCycles, setWorkCycles] = useState(1);
    const [completedWorkCycles, setCompletedWorkCycles] = useState();
    const [notes, setNotes] = useState("");
    const [tasks, setTasks] = useState([]);
    const [addNote, setAddNote] = useState(false);
    const [editingTasks, setEditingTasks] = useState(false);
    const [taskSelected, setTaskSelected] = useState(false);
    const [loading, setLoading] = useState(true)
    const [startTimes, setStartTimes] = useState({
        "tab-one": "00:10:00",
        "tab-two": "00:25:00",
        "tab-three": "00:05:00",
        "tab-four": "00:15:00",
    });
    const [tabsClicked, setTabsClicked] = useState({
        "tab-one": true, 
        "tab-two": false, 
        "tab-three": false, 
        "tab-four": false
    });

    const timerRef = useRef(null);

    const username = localStorage.getItem("username");

    const navigate = useNavigate();

    async function refreshToken() {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) return false;
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({refresh})
        });
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("access", data.access);
            return true;
        }
        return false;
    }

    async function isAccessValid() {
        const access = localStorage.getItem("access");
        if (!access) return false;
        const decoded = jwtDecode(access);
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime < decoded.exp) return true;
        const refreshSuccess = await refreshToken();
        return refreshSuccess;
    }

    async function authenticate() {
        const valid = await isAccessValid();
        if (!valid) {
            localStorage.clear();
            navigate("/login");
        }     
    }

    async function getTasks(isUpdating) {
        await authenticate();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pomodoro/tasks/`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access")}`
            }
        });
        if (res.ok) {
            const taskList = await res.json();
            setTasks(taskList);
            if (isUpdating) {
                const updatedTask = taskList.find(task => task.id === taskId);
                setName(updatedTask.name);
                setWorkCycles(updatedTask.work_cycles);
                setNotes(updatedTask.notes);
            }
        }
        setLoading(false);
    }

    async function updateWorkCycles(completedWorkCycles) {
        setLoading(true);
        await authenticate();
        await fetch(`${import.meta.env.VITE_API_URL}/api/pomodoro/tasks/${taskId}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            },
            body: JSON.stringify({name, work_cycles: workCycles, completed_work_cycles: completedWorkCycles, notes})
        });
        await getTasks();
    }

    function exitTaskWindow() {
        setTaskForm(false);
        setTimeout(() => {
            setEditingTasks(false);
            setAddNote(false);
        }, 300);
    }

    function handleTabClick(id) {
        restartTimer();
        setTaskSelected(true);
        switch (id) {
            case "tab-one":
                setBorderColor("#1a1a1a");
                setTime(startTimes["tab-one"]);
                break;
            case "tab-two":
                setBorderColor("#33b5e5");
                setTime(startTimes["tab-two"]);
                break;
            case "tab-three":
                setBorderColor("#FF6F00");
                setTime(startTimes["tab-three"]);
                break;
            case "tab-four":
                setBorderColor("#8B0000");
                setTime(startTimes["tab-four"]);
                break;
        }
        setTabsClicked(prev => {
            const newTabsClicked = {};
            for (const key in prev) {
                newTabsClicked[key] = key === id;
            }
            return newTabsClicked;
        });
    }

    function tab(id, text) {
        return (
            <svg 
                id={id} 
                className="tab" 
                width="120" 
                height="36" 
                data-clicked={tabsClicked[id]} 
                tabIndex={1}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && (taskSelected && handleTabClick(id))}>
                <defs>
                    <symbol id={`${id}-chrome-tab-geometry-left`} viewBox="0 -2 120 36">
                        <path 
                            d="M17 0h85v36H0v-6c4 0 9-3 9-8V8c0-4 3-8 8-8z"
                            fill="#222222"
                            stroke={tabsClicked[id] ? borderColor : null}
                            strokeDasharray={114}
                            strokeWidth="2"/>
                    </symbol>
                    <symbol id={`${id}-chrome-tab-geometry-right`} viewBox="0 -2 120 36">
                        <use xlinkHref={`#${id}-chrome-tab-geometry-left`}/>
                    </symbol>
                </defs>
                <svg width="52%" height="100%" onClick={() => taskSelected && handleTabClick(id)}>
                    <use xlinkHref={`#${id}-chrome-tab-geometry-left`} width="120" height="36" style={{ cursor: "pointer" }}/>
                </svg>
                <g transform="scale(-1, 1)">
                    <svg width="52%" height="100%" x="-100%" y="0" onClick={() => taskSelected && handleTabClick(id)}>
                        <use xlinkHref={`#${id}-chrome-tab-geometry-left`} width="120" height="36" style={{ cursor: "pointer" }}/>
                    </svg>
                </g>
                <text 
                    className="tab-text" x="50%" y="50%" fontSize="15" textAnchor="middle" dy="5px" fill="white" pointerEvents="none">
                    {text}
                </text>
            </svg>
        );
    }

    function restartTimer() {
        clearTimeout(timerRef.current);
        const tab = Object.keys(tabsClicked).find(k => tabsClicked[k] === true);
        setTime(startTimes[tab]);
        setTimerStarted(false);
        setTimerReset(true);
        setTimerPaused(false);
    }

    useEffect(() => {
        authenticate();
    }, []);

    return (
        <div id="timer-area">
            <div data-transition={startTransition} id="top-block"></div>
            <div data-transition={startTransition} id="bottom-block"></div>
            <button 
                tabIndex={1} 
                id="logout-button" 
                inert={taskForm}
                data-disappear={startTransition}
                onClick={() => {
                    setStartTransition(true);
                    setTimeout(() => {
                        navigate("/login");
                        localStorage.clear();
                        setStartTransition(false);
                    }, 2000);
                }}>
                    <LogoutIcon fontSize='large'/>
            </button>
            <div id="welcome-container">
                <div id="welcome-text">Welcome, {username}</div>
            </div>
            <div id="timer-tab-block">
                <div id="tabs-container" inert={taskForm}>
                    {tab("tab-one", "Timer")}
                    {tab("tab-two", "Work")}
                    {tab("tab-three", "Short Break")}
                    {tab("tab-four", "Long Break")}
                </div>
                <Timer 
                    taskForm={taskForm} 
                    borderColor={borderColor} 
                    time={time} 
                    setTime={setTime}
                    setStartTimes={setStartTimes}
                    handleTabClick={handleTabClick}
                    tabsClicked={tabsClicked}
                    timerStarted={timerStarted}
                    setTimerStarted={setTimerStarted}
                    timerPaused={timerPaused}
                    setTimerPaused={setTimerPaused}
                    timerReset={timerReset}
                    setTimerReset={setTimerReset}
                    timerRef={timerRef}
                    restartTimer={restartTimer}
                    updateWorkCycles={updateWorkCycles}
                    completedWorkCycles={completedWorkCycles}
                    setCompletedWorkCycles={setCompletedWorkCycles}
                    workCycles={workCycles}
                    setTaskSelected={setTaskSelected}/>
            </div>
            <Tasks 
                taskForm={taskForm} 
                setTaskForm={setTaskForm} 
                authenticate={authenticate}
                loading={loading}
                setLoading={setLoading}
                taskId={taskId}
                setTaskId={setTaskId}
                name={name}
                setName={setName}
                workCycles={workCycles}
                setWorkCycles={setWorkCycles}
                notes={notes}
                setNotes={setNotes}
                setCompletedWorkCycles={setCompletedWorkCycles}
                getTasks={getTasks}
                tasks={tasks}
                exitTaskWindow={exitTaskWindow}
                addNote={addNote}
                setAddNote={setAddNote}
                editingTasks={editingTasks}
                setEditingTasks={setEditingTasks}
                handleTabClick={handleTabClick}
                taskSelected={taskSelected}
                setTaskSelected={setTaskSelected}/>
        </div>
    );
}