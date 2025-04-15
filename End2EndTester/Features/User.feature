Feature: Logged In User

  Background: 

    Given I am at the WTP homepage
    And I see the login button
    When I click on the login button 
    Then I should see the login form
    When I fill in the form with valid data
    And I click on the submit button

  @User

  Scenario: Login in as a user and see authenticated page

    Then I should see my user name at the dashboard page

  Scenario: Start a chat as a user

    When I click on the chat button
    Then I should see the chat window
    And I Write a message in the chat window
    When I press send
    Then I should see my message in the chat window
    And I press the end chat button
    Then I should see the dashboard again 


 
  

    