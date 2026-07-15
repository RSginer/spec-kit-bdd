import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber'

const feature = await loadFeature('features/mark-task-complete.feature')

describeFeature(feature, ({ Background, Scenario }) => {
  Background(({ Given, And }) => {
    // TODO: freeze "today" to this date before rendering <TodoApp />
    Given(`the current date is "2026-07-15"`, () => {
      throw new Error('Pending: implement "the current date is..." step')
    })
    // TODO: seed a task with this title and due date (e.g. via the add-task form or app state)
    And(`a task "Submit expense report" due "2026-07-16"`, () => {
      throw new Error('Pending: implement "a task... due..." step')
    })
  })

  Scenario(`Marking a task complete keeps it visible and flags it as complete`, ({ When, Then, And }) => {
    // TODO: click the complete checkbox/toggle for this task
    When(`the user marks "Submit expense report" as complete`, () => {
      throw new Error('Pending: implement "the user marks... as complete" step')
    })
    // TODO: assert the task row/element reflects a "complete" state (class, checkbox checked, etc.)
    Then(`"Submit expense report" is flagged as complete`, () => {
      throw new Error('Pending: implement "...is flagged as complete" step')
    })
    And(`the weekly task list shows "Submit expense report"`, () => {
      throw new Error('Pending: implement "the weekly task list shows..." step')
    })
  })

  Scenario(`Unmarking a completed task returns it to incomplete`, ({ Given, When, Then, And }) => {
    // TODO: mark the seeded task as complete before the scenario's own steps run
    Given(`"Submit expense report" is marked as complete`, () => {
      throw new Error('Pending: implement "...is marked as complete" step')
    })
    // TODO: click the complete checkbox/toggle again to unmark it
    When(`the user marks "Submit expense report" as incomplete`, () => {
      throw new Error('Pending: implement "the user marks... as incomplete" step')
    })
    // TODO: assert the task row/element no longer reflects a "complete" state
    Then(`"Submit expense report" is flagged as incomplete`, () => {
      throw new Error('Pending: implement "...is flagged as incomplete" step')
    })
    And(`the weekly task list shows "Submit expense report"`, () => {
      throw new Error('Pending: implement "the weekly task list shows..." step')
    })
  })
})
