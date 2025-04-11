Feature: Fill the form as a customer

    Scenario: Telecom customer service contact form
        Given I am on the form page
        When I choose Tele/Bredband 
        And I fill in my name,lastname and email
        And I choose Mobiltelefoni as the service type
        And I Faktura frågor as the issue type
        And I write a message to the customer service
        And I submit the form
        Then I should see a success message