Feature: Unauthorized Staff

    Background: 
        Given I am at the WTP homepage
        And I see the login button
        When I click on the login button 
        Then I should see the login form

    @UnauthorizedStaff

    Scenario: Try to log in with invalid credentials

        When I fill in the form with invalid data
        And I click on the submit button
        Then I should see an error message