@mode:serial
Feature: Admin application management

  @requires-backend
  Scenario: Administrator cancels hiring an applicant
    Given the administrator is logged in
    And the administrator is viewing applications for a job role
    And an applicant has the status "IN_PROGRESS"
    When the administrator chooses to hire the applicant
    Then they should see the hire confirmation page
    When the administrator cancels the hire action
    Then they should return to the job role applications page
    And the applicant status should remain "IN_PROGRESS"

  @requires-backend
  Scenario: Administrator cancels rejecting an applicant
    Given the administrator is logged in
    And the administrator is viewing applications for a job role
    And an applicant has the status "IN_PROGRESS"
    When the administrator chooses to reject the applicant
    Then they should see the reject confirmation page
    When the administrator cancels the reject action
    Then they should return to the job role applications page
    And the applicant status should remain "IN_PROGRESS"

  @requires-backend
  Scenario: Administrator hires an applicant
    Given the administrator is logged in
    And the administrator is viewing applications for a job role
    And an applicant has the status "IN_PROGRESS"
    When the administrator chooses to hire the applicant
    And the administrator confirms the hire action
    Then the applicant status should be "HIRED"

  @requires-backend
  Scenario: Administrator rejects an applicant
    Given the administrator is logged in
    And the administrator is viewing applications for a job role
    And an applicant has the status "IN_PROGRESS"
    When the administrator chooses to reject the applicant
    And the administrator confirms the reject action
    Then the applicant status should be "REJECTED"
