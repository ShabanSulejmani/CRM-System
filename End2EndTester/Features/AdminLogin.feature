Feature: Logged In Admin

    Background: 

        Given I am at the WTP homepage
        And I see the login button
        When I click on the login button 
        Then I should see the login form
        When I fill in the form with valid data for a admin
        When I click on the submit button

    @Admin
  
    Scenario: Login in as a admin and see authenticated page
     
        Then I should see the dashboard for admin

    Scenario: Create a new staff member as admin    
        
        When I click on the create staff button
        Then I should see the create staff form
        And I fill in the create staff form with valid data
        And I click on the submit button to create the staff member
        Then I should see a success message

    Scenario: Create a new staff member but the staff already  exists 
    
        When I click on the create staff button
        Then I should see the create staff form
        And I fill in the create staff form with existing data
        And I click on the submit button to create the staff member
        Then I should see an error message for existing staff