import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber'

const feature = await loadFeature('features/add-task.feature')

describeFeature(feature, ({ Background, Scenario, ScenarioOutline }) => {
  Background(({ Given }) => {
    // TODO: freeze "today" to this date (e.g. render <TodoApp /> after `vi.setSystemTime(new Date(date))`)
    Given(`the current date is "2026-07-15"`, () => {
      throw new Error('Pending: implement "the current date is..." step')
    })
  })

  Scenario(`Adding a task due this week makes it appear in the weekly list`, ({ When, Then }) => {
    // TODO: fill in the add-task form (title + due date) via userEvent and submit it
    When(`the user adds a task titled "Submit expense report" due "2026-07-16"`, () => {
      throw new Error('Pending: implement "the user adds a task titled..." step')
    })
    // TODO: assert screen.getByText("Submit expense report") is present in the weekly list
    Then(`the weekly task list shows "Submit expense report"`, () => {
      throw new Error('Pending: implement "the weekly task list shows..." step')
    })
  })

  Scenario(`Adding a task due outside this week does not add it to the weekly list`, ({ When, Then }) => {
    When(`the user adds a task titled "Renew passport" due "2026-08-02"`, () => {
      throw new Error('Pending: implement "the user adds a task titled..." step')
    })
    // TODO: assert screen.queryByText("Renew passport") is null
    Then(`the weekly task list does not show "Renew passport"`, () => {
      throw new Error('Pending: implement "the weekly task list does not show..." step')
    })
  })

  Scenario(`Adding a task without a title is rejected`, ({ When, Then, And }) => {
    // TODO: leave the title field empty, fill only the due date, and submit
    When(`the user attempts to add a task with no title due "2026-07-16"`, () => {
      throw new Error('Pending: implement "the user attempts to add a task with no title..." step')
    })
    // TODO: assert the task list does not gain a new entry
    Then(`the task is not saved`, () => {
      throw new Error('Pending: implement "the task is not saved" step')
    })
    // TODO: assert the validation message text is rendered near the form
    And(`the validation message "Title is required" is displayed`, () => {
      throw new Error('Pending: implement "the validation message..." step')
    })
  })

  Scenario(`Adding a task without a due date is rejected`, ({ When, Then, And }) => {
    // TODO: fill only the title field and submit, leaving due date empty
    When(`the user attempts to add a task titled "Submit expense report" with no due date`, () => {
      throw new Error('Pending: implement "the user attempts to add a task titled... with no due date" step')
    })
    Then(`the task is not saved`, () => {
      throw new Error('Pending: implement "the task is not saved" step')
    })
    And(`the validation message "Due date is required" is displayed`, () => {
      throw new Error('Pending: implement "the validation message..." step')
    })
  })

  ScenarioOutline(`Adding a task with missing required fields is rejected`, ({ When, Then, And }) => {
    // TODO: use the Scenario Outline's <title>/<due_date> placeholders to drive the form submission
    When(`the user attempts to add a task titled "<title>" due "<due_date>"`, () => {
      throw new Error('Pending: implement "the user attempts to add a task titled <title> due <due_date>" step')
    })
    Then(`the task is not saved`, () => {
      throw new Error('Pending: implement "the task is not saved" step')
    })
    And(`the validation message "<message>" is displayed`, () => {
      throw new Error('Pending: implement "the validation message <message> is displayed" step')
    })
  })
})
