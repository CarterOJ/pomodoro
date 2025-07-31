import { useState } from 'react';

export function Tasks() {
    const [taskForm, setTaskForm] = useState(false);

    function handleAddTask(e) {
        setTaskForm(true);
        e.target.blur();
    }

    return (
        <>
            <button id="add-task" onClick={handleAddTask}>+</button>
            <form id="task-form" data-visible={taskForm}></form>
        </>
    )
}