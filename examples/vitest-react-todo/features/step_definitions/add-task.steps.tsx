import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { TodoApp } from '../../src/TodoApp'

const feature = await loadFeature('features/add-task.feature')

describeFeature(feature, ({ Background, Scenario, ScenarioOutline }) => {
  let user: ReturnType<typeof userEvent.setup>

  Background(({ Given }) => {
    Given(`the current date is "2026-07-15"`, () => {
      cleanup()
      vi.useFakeTimers({ shouldAdvanceTime: true })
      vi.setSystemTime(new Date(2026, 6, 15))
      user = userEvent.setup()
      render(<TodoApp />)
    })
  })

  async function attemptAddTask(title: string, dueDate: string) {
    if (title !== '') {
      await user.type(screen.getByLabelText('Title'), title)
    }
    if (dueDate !== '') {
      fireEvent.change(screen.getByLabelText('Due date'), { target: { value: dueDate } })
    }
    await user.click(screen.getByRole('button', { name: 'Add task' }))
  }

  Scenario(`Adding a task due this week makes it appear in the weekly list`, ({ When, Then }) => {
    When(`the user adds a task titled "Submit expense report" due "2026-07-16"`, async () => {
      await attemptAddTask('Submit expense report', '2026-07-16')
    })
    Then(`the weekly task list shows "Submit expense report"`, () => {
      expect(screen.getByText('Submit expense report')).toBeInTheDocument()
    })
  })

  Scenario(`Adding a task due outside this week does not add it to the weekly list`, ({ When, Then }) => {
    When(`the user adds a task titled "Renew passport" due "2026-08-02"`, async () => {
      await attemptAddTask('Renew passport', '2026-08-02')
    })
    Then(`the weekly task list does not show "Renew passport"`, () => {
      expect(screen.queryByText('Renew passport')).not.toBeInTheDocument()
    })
  })

  Scenario(`Adding a task without a title is rejected`, ({ When, Then, And }) => {
    When(`the user attempts to add a task with no title due "2026-07-16"`, async () => {
      await attemptAddTask('', '2026-07-16')
    })
    Then(`the task is not saved`, () => {
      expect(screen.getByText('No tasks due this week')).toBeInTheDocument()
    })
    And(`the validation message "Title is required" is displayed`, () => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
  })

  Scenario(`Adding a task without a due date is rejected`, ({ When, Then, And }) => {
    When(`the user attempts to add a task titled "Submit expense report" with no due date`, async () => {
      await attemptAddTask('Submit expense report', '')
    })
    Then(`the task is not saved`, () => {
      expect(screen.getByText('No tasks due this week')).toBeInTheDocument()
    })
    And(`the validation message "Due date is required" is displayed`, () => {
      expect(screen.getByText('Due date is required')).toBeInTheDocument()
    })
  })

  ScenarioOutline(`Adding a task with missing required fields is rejected`, ({ When, Then, And }, variables) => {
    When(`the user attempts to add a task titled "<title>" due "<due_date>"`, async () => {
      await attemptAddTask(variables.title, variables.due_date)
    })
    Then(`the task is not saved`, () => {
      expect(screen.getByText('No tasks due this week')).toBeInTheDocument()
    })
    And(`the validation message "<message>" is displayed`, () => {
      expect(screen.getByText(variables.message)).toBeInTheDocument()
    })
  })
})
