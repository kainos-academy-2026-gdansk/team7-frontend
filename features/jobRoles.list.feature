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
