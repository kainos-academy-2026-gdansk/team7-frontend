Feature: My profile access

  Scenario: User cannot access their profile without logging in
    Given the user is unauthenticated
    When the user tries to open their profile
    Then the user should be redirected to the home page
    And the user should see the "Find your next role at Kainos" heading
