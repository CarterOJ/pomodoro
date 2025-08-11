import { useState, useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export function Tasks({ taskForm, setTaskForm, authenticate }) {
    const [workCycles, setWorkCycles] = useState(1);
    const [addNote, setAddNote] = useState(false);
    const [name, setName] = useState("");
    const [notes, setNotes] = useState("");
    const [taskId, setTaskId] = useState();
    const [tasks, setTasks] = useState([]);
    const [editingTasks, setEditingTasks] = useState(false);
    const [loading, setLoading] = useState(true);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        await authenticate();
        if (editingTasks === true) {
            await fetch(`http://localhost:8000/api/pomodoro/tasks/${taskId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                },
                body: JSON.stringify({name, work_cycles: workCycles, notes})
            }); 
        } else {
            await fetch("http://localhost:8000/api/pomodoro/tasks/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                },
                body: JSON.stringify({name, work_cycles: workCycles, notes})
            }); 
        }
        await getTasks();
        exitTaskWindow();
    }

    async function deleteTask() {
        setLoading(true);
        await authenticate();
        await fetch(`http://localhost:8000/api/pomodoro/tasks/${taskId}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            },
        });
        await getTasks();
        exitTaskWindow();
    }

    function exitTaskWindow() {
        setTaskForm(false);
        setTimeout(() => {
            setName("");
            setWorkCycles(1);
            setAddNote(false);
            setNotes("");
            setEditingTasks(false);
        }, 300)
    }

    async function getTasks() {
        await authenticate();
        const res = await fetch("http://localhost:8000/api/pomodoro/tasks/", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access")}`
            }
        });
        if (res.ok) {
            setTasks(await res.json());
        }
        setLoading(false);
    }

    useEffect(() => {
        getTasks();
    }, []);

    return (
        <>
            <form id="task-form" data-visible={taskForm} inert={!taskForm} onSubmit={handleSubmit}>
                <input 
                    id="task-name" 
                    type="text" 
                    placeholder="Task Name" 
                    maxLength={15}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required>
                </input>
                <div id="work-cycles-title">Work Cycles:</div>
                <div id="work-cycles-container">
                    <input 
                        id="work-cycles" 
                        type="text"
                        value={workCycles}
                        onChange={e => {
                            const val = e.target.value
                            if (/^\d*$/.test(val)) setWorkCycles(val === "" ? val : Number(val));
                        }}
                        onBlur={() => {
                            if (workCycles === "" || workCycles === 0) setWorkCycles(1);
                            else if (workCycles > 10) setWorkCycles(10);
                        }}>
                    </input>
                    <button 
                        type="button" 
                        className="work-cycle-buttons"
                        onClick={() => setWorkCycles(prev => prev < 10 ? prev + 1 : prev)}>
                            <ArrowUpwardIcon />
                    </button>
                    <button 
                        type="button" 
                        className="work-cycle-buttons"
                        onClick={() => setWorkCycles(prev => prev > 1 ? prev - 1 : prev)}>
                            <ArrowDownwardIcon />
                    </button>
                </div>
                {addNote && 
                    <textarea 
                        id="notes" 
                        placeholder="Notes..." 
                        rows={4} 
                        value={notes}
                        onChange={e => setNotes(e.target.value)}></textarea>}
                <div id="task-options-container">
                    <button 
                        type="button" 
                        id="add-note-button"
                        onClick={() => setAddNote(true)}>
                            <NoteAddIcon />
                    </button>
                    {editingTasks ?
                        <div>
                            <button type="button" id="decline-button" onClick={deleteTask}>Delete</button>
                            <button id="confirm-button">Update</button>
                        </div> :
                        <div>
                            <button type="button" id="decline-button" onClick={exitTaskWindow}>Cancel</button>
                            <button id="confirm-button">Save</button>                            
                        </div>
                    }
                </div>
            </form>
            <div id="tasks-container">
                {loading ? <div id="loading">Loading...</div> :
                    tasks.map(task => 
                        <div key={task.id} className="task-container">
                            <div>{task.name}</div>
                            <div className="right-task-container">
                                <div>0/{task.work_cycles}</div>
                                <button 
                                    className="task-settings-button"
                                    onClick={e => {
                                        setTaskForm(true);
                                        setEditingTasks(true);
                                        setName(task.name);
                                        setWorkCycles(task.work_cycles);
                                        setNotes(task.notes);
                                        setTaskId(task.id);
                                        e.currentTarget.blur();
                                    }}
                                    inert={taskForm}>
                                        <MoreVertIcon />
                                </button>
                            </div>
                        </div>
                    )
                }
                <button 
                    id="add-task" 
                    onClick={e => {
                        setTaskForm(true);
                        e.target.blur();
                    }} 
                    inert={taskForm}>
                        +
                </button>
            </div>
        </>
    )
}