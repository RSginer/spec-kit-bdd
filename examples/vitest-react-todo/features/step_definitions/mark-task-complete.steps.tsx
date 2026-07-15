import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { TodoApp } from '../../src/TodoApp'
import type { Task } from '../../src/task'

const feature = await loadFeature('features/mark-task-complete.feature')

describeFeature(feature, ({ Background, Scenario }) => {
  let tasks: Task[]
  let user: ReturnType<typeof userEvent.setup>

  async function toggleTask(title: string) {
    await user.click(screen.getByRole('checkbox', { name: title }))
  }

  Background(({ Given, And }) => {
    Given(`the current date is "2026-07-15"`, () => {
      cleanup()
      vi.useFakeTimers({ shouldAdvanceTime: true })
      vi.setSystemTime(new Date(2026, 6, 15))
      tasks = []
    })
    And(`a task "Submit expense report" due "2026-07-16"`, () => {
      tasks.push({ id: 'seed-1', title: 'Submit expense report', dueDate: '2026-07-16', completed: false })
      user = userEvent.setup()
      render(<TodoApp initialTasks={tasks} />)
    })
  })

  Scenario(`Marking a task complete keeps it visible and flags it as complete`, ({ When, Then, And }) => {
    When(`the user marks "Submit expense report" as complete`, async () => {
      await toggleTask('Submit expense report')
    })
    Then(`"Submit expense report" is flagged as complete`, () => {
      expect(screen.getByRole('checkbox', { name: 'Submit expense report' })).toBeChecked()
    })
    And(`the weekly task list shows "Submit expense report"`, () => {
      expect(screen.getByText('Submit expense report')).toBeInTheDocument()
    })
  })

  Scenario(`Unmarking a completed task returns it to incomplete`, ({ Given, When, Then, And }) => {
    Given(`"Submit expense report" is marked as complete`, async () => {
      await toggleTask('Submit expense report')
    })
    When(`the user marks "Submit expense report" as incomplete`, async () => {
      await toggleTask('Submit expense report')
    })
    Then(`"Submit expense report" is flagged as incomplete`, () => {
      expect(screen.getByRole('checkbox', { name: 'Submit expense report' })).not.toBeChecked()
    })
    And(`the weekly task list shows "Submit expense report"`, () => {
      expect(screen.getByText('Submit expense report')).toBeInTheDocument()
    })
  })
})
