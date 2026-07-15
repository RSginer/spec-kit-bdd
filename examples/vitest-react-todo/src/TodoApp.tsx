import { useState, type FormEvent } from 'react'
import { getWeekRange, isDueThisWeek, isDueToday, sortByDueDate, type Task } from './task'

export interface TodoAppProps {
  /** Seed the task list deterministically — used by tests, not exposed in the UI. */
  initialTasks?: Task[]
}

export function TodoApp({ initialTasks = [] }: TodoAppProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const today = new Date()
  const weekRange = getWeekRange(today)
  const weeklyTasks = sortByDueDate(tasks.filter((task) => isDueThisWeek(task, weekRange)))

  function handleToggleComplete(id: string) {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  function handleAddTask(event: FormEvent) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (trimmedTitle === '') {
      setValidationError('Title is required')
      return
    }
    if (dueDate === '') {
      setValidationError('Due date is required')
      return
    }
    setTasks([...tasks, { id: crypto.randomUUID(), title: trimmedTitle, dueDate, completed: false }])
    setTitle('')
    setDueDate('')
    setValidationError(null)
  }

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleAddTask}>
        <label>
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          Due date
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </label>
        <button type="submit">Add task</button>
        {validationError && <p>{validationError}</p>}
      </form>
      {weeklyTasks.length === 0 ? (
        <p>No tasks due this week</p>
      ) : (
        <ul aria-label="Weekly task list">
          {weeklyTasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                aria-label={task.title}
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
              />
              <span>{task.title}</span>
              <time dateTime={task.dueDate}> {task.dueDate}</time>
              {isDueToday(task, today) && <span> Due today</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
