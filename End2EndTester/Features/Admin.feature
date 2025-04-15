Feature: Logged In Admin

    Background: 

        Given I am at the WTP homepage
        And I see the login button
        When I click on the login button 
        Then I should see the login form
        When I fill in the form with valid data for a admin
        When I click on the submit button

    @Admin
  
    Scenario:  Login in as a admin and see authenticated page
     
        Then I should see the dashboard for admin
        