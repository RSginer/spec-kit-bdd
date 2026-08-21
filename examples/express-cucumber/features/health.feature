Feature: Health check
  As an operator
  I want to confirm the service is running
  So that I can verify the deployment is healthy

  Scenario: Service reports healthy status
    When I request the health endpoint
    Then the response status should be 200
    And the response body should report status "ok"
