Feature: Job Role List view

    @requires-backend
    Scenario: non-registered user can view job role list
        Given the user is on the main page
        When the user clicks the job roles link
        Then the user can view the job role list

    @requires-backend
    Scenario: non-registered user can view details about a job role
    Given the user is on the job role list page
        When the user clicks the first offer
        Then the user can view the job role details

    @requires-backend
    Scenario: Administrator creates a job role that is visible to applicants
        Given the administrator has an authenticated session
        And the administrator is on the job roles page
        When the administrator creates a new job role
        Then the new job role is shown on the job roles page
