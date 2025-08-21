import { useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export function Tasks({ 
    taskForm, setTaskForm, 
    authenticate, loading, 
    setLoading, name, 
    setName, workCycles, 
    setWorkCycles, notes, 
    setNotes, taskId, 
    setTaskId, setCompletedWorkCycles,
    getTasks, tasks,
    exitTaskWindow, addNote,
    setAddNote, editingTasks, 
    setEditingTasks, handleTabClick,
    taskSelected, setTaskSelected }) {
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
                await getTasks(true); 
            } else {
                await fetch("http://localhost:8000/api/pomodoro/tasks/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("access")}`,
                    },
                    body: JSON.stringify({name, work_cycles: workCycles, notes})
                });
                await getTasks(); 
            }
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
            handleTabClick("tab-one");
            setTaskSelected(false);
            exitTaskWindow();
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
                                <button type="button" className="decline-button" onClick={deleteTask}>Delete</button>
                                <button id="confirm-button">Update</button>
                                <button type="button" className="decline-button" onClick={exitTaskWindow}>Cancel</button>
                            </div> :
                            <div>
                                <button type="button" className="decline-button" onClick={exitTaskWindow}>Cancel</button>
                                <button id="confirm-button">Save</button>                            
                            </div>
                        }
                    </div>
                </form>
                <div id="tasks-container">
                    {loading ? <div id="loading">Loading...</div> :
                        tasks.map(task => 
                            <div 
                                key={task.id} 
                                className="task-container" 
                                tabIndex={0} 
                                inert={taskForm}
                                data-selected={task.id === taskId && taskSelected}
                                data-completed={task.completed_work_cycles >= task.work_cycles}
                                onClick={() => {
                                    setName(task.name);
                                    setWorkCycles(task.work_cycles);
                                    setNotes(task.notes);
                                    setTaskId(task.id);
                                    setCompletedWorkCycles(task.completed_work_cycles);
                                    handleTabClick("tab-two");
                                }}>
                                <div>{task.name}</div>
                                <div className="right-task-container">
                                    <div>{task.completed_work_cycles}/{task.work_cycles}</div>
                                    <button 
                                        className="task-settings-button"
                                        data-selected={task.id === taskId && taskSelected}
                                        data-completed={task.completed_work_cycles >= task.work_cycles}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setName(task.name);
                                            setWorkCycles(task.work_cycles);
                                            setNotes(task.notes);
                                            setTaskForm(true);
                                            setEditingTasks(true);
                                            setTaskId(task.id)
                                            e.currentTarget.blur();
                                        }}>
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
                            setName("");
                            setWorkCycles(1);
                            setNotes("");
                            e.target.blur();
                        }} 
                        inert={taskForm}>
                            +
                    </button>
                </div>
            </>
        )
    }   