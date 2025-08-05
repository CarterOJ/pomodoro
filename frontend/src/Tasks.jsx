import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

export function Tasks({ taskForm, setTaskForm }) {
    function handleAddTask(e) {
        setTaskForm(true);
        e.target.blur();
    }

    return (
        <>
            <button id="add-task" onClick={handleAddTask} inert={taskForm}>+</button>
            <form id="task-form" data-visible={taskForm} inert={!taskForm}>
                <input id="task-name" type="text" placeholder="Task Name"></input>
                <div id="work-cycles-title">Work Cycles:</div>
                <div id="work-cycles-container">
                    <input id="work-cycles" type="text"></input>
                    <button type="button" className="work-cycle-buttons"><ArrowUpwardIcon /></button>
                    <button type="button" className="work-cycle-buttons"><ArrowDownwardIcon /></button>
                </div>
                <div id="task-options-container">
                    <button type="button" id="add-note-button"><NoteAddIcon /></button>
                    <div>
                        <button type="button" id="cancel-button" onClick={() => {setTaskForm(false)}}>Cancel</button>
                        <button id="save-button">Save</button>
                    </div>
                </div>
            </form>
        </>
    )
}