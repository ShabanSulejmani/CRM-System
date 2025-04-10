Feature: Admin Login
    
    Scenario: Login in as a admin
                                                      
        Given I am at the WTP homepage
        And I see the login button
        When I click on the login button 
        Then I should see the login form
        When I fill in the form with valid data for a admin
        And I click on the submit button
        Then I should see my user the dashboard for admin