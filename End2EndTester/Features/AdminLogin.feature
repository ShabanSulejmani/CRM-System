Feature:Admin

    Scenario: Adimin login
        Given I am at the WTP homepage
        And I see the register button
        When I click on the register button 
        Then I should see the register form
        When I fill in the form with valid admin data
        And I click on the submit button
        Then I should see a the admin dashboard

