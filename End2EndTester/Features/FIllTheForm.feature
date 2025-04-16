Feature: Fill the form as a customer

    Background:  
        Given I am at the WTP homepage
        
    @Telecom
    Scenario: Telecom customer service contact form
        
        When I choose "Tele/Bredband" as the company type
        And I fill in my name and email
        And I choose "Mobiltelefoni" as the service type
        And I take "Fakturafrågor" as the issue type
        And I write a message to customer service
        And I press Submit
        Then A success message Will be displayed

    @CarService
    Scenario: Car service contact form
      
        When I choose "Fordonsservice" as the company type
        And I fill in my name and email
        And I write "UND755" as the registration number
        And I choose "Kostnadsförfrågan" as the issue type
        And I write a message to customer service
        And I press Submit
        Then A success message Will be displayed
    @Insurance
    Scenario: Insurance contact form
       
        When I choose "Försäkringsärenden" as the company type
        And I fill in my name and email
        And I choose "Olycksfallsförsäkring" as the insurance type
        And I choose "Fakturafrågor" as the issue type
        And I write a message to customer service
        And I press Submit
        Then A success message Will be displayed

    @MissingFields
    Scenario: Fill in the form without required fields
     
        When I choose "Tele/Bredband" as the company type
        And I send the form without filling required fields
        Then Validation errors will appear