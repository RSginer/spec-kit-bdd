export interface Task {
  id: string
  title: string
  /** ISO date, "YYYY-MM-DD" */
  dueDate: string
  completed: boolean
}

export interface WeekRange {
  start: Date
  end: Date
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Monday 00:00:00 through Sunday 23:59:59.999 containing `today`, in local time. */
export function getWeekRange(today: Date): WeekRange {
  const day = startOfDay(today)
  const daysSinceMonday = (day.getDay() + 6) % 7
  const start = new Date(day.getTime() - daysSinceMonday * MS_PER_DAY)
  const end = new Date(start.getTime() + 7 * MS_PER_DAY - 1)
  return { start, end }
}

function parseDueDate(dueDate: string): Date {
  const [year, month, date] = dueDate.split('-').map(Number)
  return new Date(year, month - 1, date)
}

export function isDueThisWeek(task: Task, range: WeekRange): boolean {
  const due = parseDueDate(task.dueDate)
  return due >= range.start && due <= range.end
}

export function sortByDueDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => (a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0))
}

export function isDueToday(task: Task, today: Date): boolean {
  return task.dueDate === toISODate(today)
}

function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
