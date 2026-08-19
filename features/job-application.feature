Feature: Apply for a job role

  Scenario: Visitor must log in before applying for a job role
    Given the visitor is not logged in
    When they try to open a job application form
    Then they should be redirected to the login page
    And they should see the "Log in" heading