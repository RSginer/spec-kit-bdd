import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber'

const feature = await loadFeature('features/view-weekly-tasks.feature')

describeFeature(feature, ({ Background, Scenario, ScenarioOutline }) => {
  Background(({ Given }) => {
    // TODO: freeze "today" to this date before rendering <TodoApp />
    Given(`the current date is "2026-07-15"`, () => {
      throw new Error('Pending: implement "the current date is..." step')
    })
  })

  Scenario(`Only tasks due within the current week are shown`, ({ Given, When, Then, And }) => {
    // TODO: seed a task with this title and due date
    Given(`a task "Submit expense report" due "2026-07-16"`, () => {
      throw new Error('Pending: implement "a task... due..." step')
    })
    And(`a task "Renew passport" due "2026-08-02"`, () => {
      throw new Error('Pending: implement "a task... due..." step')
    })
    And(`a task "Pay rent" due "2026-07-01"`, () => {
      throw new Error('Pending: implement "a task... due..." step')
    })
    // TODO: render <TodoApp /> (or navigate to the weekly view) if not already rendered
    When(`the user views the weekly task list`, () => {
      throw new Error('Pending: implement "the user views the weekly task list" step')
    })
    Then(`the weekly task list shows "Submit expense report"`, () => {
      throw new Error('Pending: implement "the weekly task list shows..." step')
    })
    And(`the weekly task list does not show "Renew passport"`, () => {
      throw new Error('Pending: implement "the weekly task list does not show..." step')
    })
    And(`the weekly task list does not show "Pay rent"`, () => {
      throw new Error('Pending: implement "the weekly task list does not show..." step')
    })
  })

  Scenario(`A message is shown when no tasks are due this week`, ({ Given, When, Then }) => {
    // TODO: ensure no seeded task falls within this date range
    Given(`no tasks are due between "2026-07-13" and "2026-07-19"`, () => {
      throw new Error('Pending: implement "no tasks are due between..." step')
    })
    When(`the user views the weekly task list`, () => {
      throw new Error('Pending: implement "the user views the weekly task list" step')
    })
    // TODO: assert the empty-state message is displayed
    Then(`the message "No tasks due this week" is displayed`, () => {
      throw new Error('Pending: implement "the message... is displayed" step')
    })
  })

  Scenario(`A task due today is visually flagged as due today`, ({ Given, When, Then }) => {
    Given(`a task "Submit expense report" due "2026-07-15"`, () => {
      throw new Error('Pending: implement "a task... due..." step')
    })
    When(`the user views the weekly task list`, () => {
      throw new Error('Pending: implement "the user views the weekly task list" step')
    })
    // TODO: assert the task row carries a "due today" indicator (class, badge, etc.)
    Then(`"Submit expense report" is flagged as due today`, () => {
      throw new Error('Pending: implement "...is flagged as due today" step')
    })
  })

  Scenario(`Tasks in the weekly list are ordered by due date, earliest first`, ({ Given, When, Then, And }) => {
    Given(`a task "Renew gym membership" due "2026-07-18"`, () => {
      throw new Error('Pending: implement "a task... due..." step')
    })
    And(`a task "Submit expense report" due "2026-07-16"`, () => {
      throw new Error('Pending: implement "a task... due..." step')
    })
    And(`a task "Pay rent" due "2026-07-13"`, () => {
      throw new Error('Pending: implement "a task... due..." step')
    })
    When(`the user views the weekly task list`, () => {
      throw new Error('Pending: implement "the user views the weekly task list" step')
    })
    // TODO: `table` is the Data Table rows, e.g. [{ task: "Pay rent" }, { task: "Submit expense report" }, ...]
    // assert the rendered task list order matches table.map(row => row.task)
    Then(`the weekly task list shows tasks in this order:`, (_ctx, table) => {
      throw new Error(
        `Pending: implement "the weekly task list shows tasks in this order:" step (expected order: ${JSON.stringify(table)})`,
      )
    })
  })

  Scenario(`Tasks sharing the same due date are both shown`, ({ Given, When, Then, And }) => {
    Given(`a task "Submit expense report" due "2026-07-16"`, () => {
      throw new Error('Pending: implement "a task... due..." step')
    })
    And(`a task "Call the dentist" due "2026-07-16"`, () => {
      throw new Error('Pending: implement "a task... due..." step')
    })
    When(`the user views the weekly task list`, () => {
      throw new Error('Pending: implement "the user views the weekly task list" step')
    })
    Then(`the weekly task list shows "Submit expense report"`, () => {
      throw new Error('Pending: implement "the weekly task list shows..." step')
    })
    And(`the weekly task list shows "Call the dentist"`, () => {
      throw new Error('Pending: implement "the weekly task list shows..." step')
    })
  })

  ScenarioOutline(`Tasks are included or excluded based on the week boundary`, ({ Given, When, Then }) => {
    // TODO: use the Scenario Outline's <due_date> placeholder to seed the task
    Given(`a task "Review pull request" due "<due_date>"`, () => {
      throw new Error('Pending: implement "a task... due <due_date>" step')
    })
    When(`the user views the weekly task list`, () => {
      throw new Error('Pending: implement "the user views the weekly task list" step')
    })
    // TODO: <inclusion> resolves to "shows" or "does not show" per the Examples table
    Then(`the weekly task list <inclusion> "Review pull request"`, () => {
      throw new Error('Pending: implement "the weekly task list <inclusion>..." step')
    })
  })
})
