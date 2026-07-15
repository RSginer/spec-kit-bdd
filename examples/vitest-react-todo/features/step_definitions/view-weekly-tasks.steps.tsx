import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber'
import { cleanup, render, screen, within } from '@testing-library/react'
import { expect, vi } from 'vitest'
import { TodoApp } from '../../src/TodoApp'
import type { Task } from '../../src/task'

const feature = await loadFeature('features/view-weekly-tasks.feature')

describeFeature(feature, ({ Background, Scenario, ScenarioOutline }) => {
  let tasks: Task[]
  let nextId: number

  function addTask(title: string, dueDate: string) {
    tasks.push({ id: String(nextId++), title, dueDate, completed: false })
  }

  Background(({ Given }) => {
    Given(`the current date is "2026-07-15"`, () => {
      cleanup()
      tasks = []
      nextId = 0
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 6, 15))
    })
  })

  Scenario(`Only tasks due within the current week are shown`, ({ Given, When, Then, And }) => {
    Given(`a task "Submit expense report" due "2026-07-16"`, () => {
      addTask('Submit expense report', '2026-07-16')
    })
    And(`a task "Renew passport" due "2026-08-02"`, () => {
      addTask('Renew passport', '2026-08-02')
    })
    And(`a task "Pay rent" due "2026-07-01"`, () => {
      addTask('Pay rent', '2026-07-01')
    })
    When(`the user views the weekly task list`, () => {
      render(<TodoApp initialTasks={tasks} />)
    })
    Then(`the weekly task list shows "Submit expense report"`, () => {
      expect(screen.getByText('Submit expense report')).toBeInTheDocument()
    })
    And(`the weekly task list does not show "Renew passport"`, () => {
      expect(screen.queryByText('Renew passport')).not.toBeInTheDocument()
    })
    And(`the weekly task list does not show "Pay rent"`, () => {
      expect(screen.queryByText('Pay rent')).not.toBeInTheDocument()
    })
  })

  Scenario(`A message is shown when no tasks are due this week`, ({ Given, When, Then }) => {
    Given(`no tasks are due between "2026-07-13" and "2026-07-19"`, () => {
      // tasks already empty from the Background reset
    })
    When(`the user views the weekly task list`, () => {
      render(<TodoApp initialTasks={tasks} />)
    })
    Then(`the message "No tasks due this week" is displayed`, () => {
      expect(screen.getByText('No tasks due this week')).toBeInTheDocument()
    })
  })

  Scenario(`A task due today is visually flagged as due today`, ({ Given, When, Then }) => {
    Given(`a task "Submit expense report" due "2026-07-15"`, () => {
      addTask('Submit expense report', '2026-07-15')
    })
    When(`the user views the weekly task list`, () => {
      render(<TodoApp initialTasks={tasks} />)
    })
    Then(`"Submit expense report" is flagged as due today`, () => {
      const row = screen.getByText('Submit expense report').closest('li')!
      expect(within(row).getByText('Due today')).toBeInTheDocument()
    })
  })

  Scenario(`Tasks in the weekly list are ordered by due date, earliest first`, ({ Given, When, Then, And }) => {
    Given(`a task "Renew gym membership" due "2026-07-18"`, () => {
      addTask('Renew gym membership', '2026-07-18')
    })
    And(`a task "Submit expense report" due "2026-07-16"`, () => {
      addTask('Submit expense report', '2026-07-16')
    })
    And(`a task "Pay rent" due "2026-07-13"`, () => {
      addTask('Pay rent', '2026-07-13')
    })
    When(`the user views the weekly task list`, () => {
      render(<TodoApp initialTasks={tasks} />)
    })
    Then(`the weekly task list shows tasks in this order:`, (_ctx, table: { task: string }[]) => {
      const rows = screen.getAllByRole('listitem')
      expect(rows).toHaveLength(table.length)
      table.forEach((expectedRow, index) => {
        expect(within(rows[index]).getByText(expectedRow.task)).toBeInTheDocument()
      })
    })
  })

  Scenario(`Tasks sharing the same due date are both shown`, ({ Given, When, Then, And }) => {
    Given(`a task "Submit expense report" due "2026-07-16"`, () => {
      addTask('Submit expense report', '2026-07-16')
    })
    And(`a task "Call the dentist" due "2026-07-16"`, () => {
      addTask('Call the dentist', '2026-07-16')
    })
    When(`the user views the weekly task list`, () => {
      render(<TodoApp initialTasks={tasks} />)
    })
    Then(`the weekly task list shows "Submit expense report"`, () => {
      expect(screen.getByText('Submit expense report')).toBeInTheDocument()
    })
    And(`the weekly task list shows "Call the dentist"`, () => {
      expect(screen.getByText('Call the dentist')).toBeInTheDocument()
    })
  })

  ScenarioOutline(`Tasks are included or excluded based on the week boundary`, ({ Given, When, Then }, variables) => {
    Given(`a task "Review pull request" due "<due_date>"`, () => {
      addTask('Review pull request', variables.due_date)
    })
    When(`the user views the weekly task list`, () => {
      render(<TodoApp initialTasks={tasks} />)
    })
    Then(`the weekly task list <inclusion> "Review pull request"`, () => {
      if (variables.inclusion === 'shows') {
        expect(screen.getByText('Review pull request')).toBeInTheDocument()
      } else {
        expect(screen.queryByText('Review pull request')).not.toBeInTheDocument()
      }
    })
  })
})
