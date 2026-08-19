Feature: My profile access

  Scenario: Visitor cannot access their profile without logging in
    Given the visitor is not logged in
    When they try to open their profile
    Then they should be redirected to the home page
    And they should see the "Find your next role at Kainos" heading
