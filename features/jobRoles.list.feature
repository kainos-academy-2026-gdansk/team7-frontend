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
    Scenario: Administrator can open the add job role form
        Given the administrator has an authenticated session
        When the administrator opens the job roles page
        And the administrator selects Add a role
        Then the administrator is taken to the add job role form
