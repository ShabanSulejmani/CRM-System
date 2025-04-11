using Microsoft.Playwright;
using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class FillTheFormSteps
    {
        private readonly IPage _page;

        public FillTheFormSteps(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }
        
        [Given("I am on the form page")]
        public async Task GivenIAmOnTheFormPage()
        {
            await _page.GotoAsync("http://localhost:3001/dynamisk");
        }
        
        [When(@"I choose ""(.*)"" as the company type")]
        public async Task WhenIChooseAsTheCompanyType(string companyType)
        {
            await _page.SelectOptionAsync("select[name='companyType']", companyType);
            // Allow time for dynamic fields to load
            await _page.WaitForTimeoutAsync(500);
        }

        
        [When("I fill in my name and email")]
        public async Task WhenIFillInMyNameAndEmail()
        {
            await _page.FillAsync("input[name='firstName']", "Saban");
            await _page.FillAsync("input[name='email']", "shaabaan_@hotmail.com");
        }
        
        [When(@"I choose ""(.*)"" as the service type")]
        public async Task WhenIChooseAsTheServiceType(string serviceType)
        {
            await _page.SelectOptionAsync("select[name='serviceType']", serviceType);
        }
        
        [When(@"I take ""(.*)"" as the issue type")]
        public async Task WhenITakeAsTheIssueType(string issueType)
        {
            await _page.SelectOptionAsync("select[name='issueType']", issueType);
        }

        
        [When(@"I write a message to customer service")]
        public async Task WhenIWriteAdMessageToCustomerservice()
        {
            await _page.FillAsync("textarea[name='message']", "Min faktura stämmer inte.");
        }
        
        [When("I press Submit")]
        public async Task WhenIPressSubmit()
        {
            await _page.ClickAsync("button.dynamisk-form-button");
            await _page.WaitForTimeoutAsync(500);
        }
        
        [Then("A success message Will be displayed")]
        public async Task ASuccessMessageWillBeDisplayed()
        {
            var messageElement = await _page.WaitForSelectorAsync(".dynamisk-message:not(.error)",
                new PageWaitForSelectorOptions {
                    Timeout = 10000,
                    State = WaitForSelectorState.Visible
                });
                
            Assert.NotNull(messageElement);
        }
    }
}