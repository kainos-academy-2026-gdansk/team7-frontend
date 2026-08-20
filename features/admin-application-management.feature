@mode:serial
Feature: Admin application management

  @requires-backend
  Scenario: Administrator cancels hiring an applicant
    Given the administrator is viewing an in-progress application
    When the administrator cancels hiring the applicant
    Then the applicant remains in progress

  @requires-backend
  Scenario: Administrator cancels rejecting an applicant
    Given the administrator is viewing an in-progress application
    When the administrator cancels rejecting the applicant
    Then the applicant remains in progress

  @requires-backend
  Scenario: Administrator hires an applicant
    Given the administrator is viewing an in-progress application
    When the administrator hires the applicant
    Then the applicant is marked as hired

  @requires-backend
  Scenario: Administrator rejects an applicant
    Given the administrator is viewing an in-progress application
    When the administrator rejects the applicant
    Then the applicant is marked as rejected
