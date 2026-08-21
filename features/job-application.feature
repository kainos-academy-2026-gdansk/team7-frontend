Feature: Apply for a job role

  Scenario: User must log in before applying for a job role
    Given the user is unauthenticated
    When the user tries to open a job application form for job role 1
    Then the user should be redirected to the login page
    And the user should see the "Log in" heading

  @requires-backend
  Scenario: User can apply for a role
    Given the user has an authenticated session
    When the user opens the role for an application
    And the user clicks Apply
    And the user fills the application form
    And the user submits the application
    Then the application confirmation is visible
    And the application status is visible

  @requires-backend
  Scenario: User cannot submit an empty application
    Given the user has an authenticated session
    When the user opens the role for an empty application
    And the user clicks Apply
    And the user submits the empty application form
    Then the application form is displayed
    And the experience validation error is visible
    And the salary expectation validation error is visible
    And the skills validation error is visible
