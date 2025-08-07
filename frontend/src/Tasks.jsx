import { useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

export function Tasks({ taskForm, setTaskForm }) {
    const [workCycles, setWorkCycles] = useState(1);
    const [addNote, setAddNote] = useState(false);
    const [name, setName] = useState("");
    const [notes, setNotes] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:8000/api/pomodoro/tasks/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            },
            body: JSON.stringify({name, workCycles, notes})
        });
        exitTaskWindow()
    }

    function exitTaskWindow() {
        setTaskForm(false);
        setTimeout(() => {
            setName("");
            setWorkCycles(1);
            setAddNote(false);
        }, 300)
    }

    return (
        <>
            <button 
                id="add-task" 
                onClick={e => {
                    setTaskForm(true);
                    e.target.blur();
                }} 
                inert={taskForm}>
                    +
            </button>
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
                    <div>
                        <button type="button" id="cancel-button" onClick={exitTaskWindow}>Cancel</button>
                        <button id="save-button">Save</button>
                    </div>
                </div>
            </form>
        </>
    )
}