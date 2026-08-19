Feature: Applicant authentication

  @requires-backend
  Scenario: registered applicant can log in
    Given the user is on the login page
    When the user enters the email "applicant@kainos.com"
    And the user enters the password "Password1!"
    And submits the login form
    Then the user is logged in

  @requires-backend
  Scenario: non-registered applicant cannot log in
    Given the user is on the login page
    When the user enters the email "not-registered@kainos.com"
    And the user enters the password "notRegistered1!"
    And submits the login form
    Then the user is not logged in

