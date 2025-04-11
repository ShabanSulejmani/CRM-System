using Microsoft.Playwright;
using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class TelefoniFormSteps
    {
        private readonly IPage _page;

        public TelefoniFormSteps(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }
        
        [Given(@"I am on the form page")]
        public async Task GivenIAmOnTheWTPFormPage()
        {
            await _page.GotoAsync("http://localhost:3001/dynamisk");
        }

        [When(@"I choose Tele/Bredband")]
        public async Task WhenIChooseTeleBredband()
        {
            await _page.SelectOptionAsync("select[name='companyType']", "Tele/Bredband");
            
        }

        [When(@"I fill in my name,lastname and email")]
        public async Task WhenIFillInMyPersonalInformation()
        {
            await _page.FillAsync("input[name='firstName']", "Saban");
            await _page.FillAsync("input[name='email']", "shaabaan_@hotmail.com");
        }

        [When(@"I choose Mobiltelefoni as the service type")]
        public async Task WhenISelectAsTheServiceType()
        {
            await _page.SelectOptionAsync("select[name='serviceType']", "Mobiltelefoni");
        }

        [When(@"I Faktura frågor as the issue type")]
        public async Task WhenISelectAsTheIssueType()
        {
            await _page.SelectOptionAsync("select[name='issueType']", "Fakturafrågor");
        }

        [When(@"I write a message to the customer service")]
        public async Task WhenIEnterADetailedMessage()
        {
            await _page.FillAsync("#message", "Hej, jag har en fråga angående min faktura.");
        }

        [When(@"I submit the form")]
        public async Task WhenISubmitTheForm()
        {
            await _page.ClickAsync("button.dynamisk-form-button");
            
            // Wait for form submission to complete
            await _page.WaitForSelectorAsync(".dynamisk-message", new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible });
        }

        [Then(@"I should see a success message")]
        public async Task ThenIShouldSeeASuccessMessage()
        {
            var messageElement = await _page.WaitForSelectorAsync(".dynamisk-message:not(.error)");
            Assert.NotNull(messageElement);
            
            // Verify the message is not an error
            var classAttribute = await messageElement.GetAttributeAsync("class");
            Assert.DoesNotContain("error", classAttribute);
            
            // Optional: Verify specific success message text
            var messageText = await messageElement.TextContentAsync();
            Assert.NotEmpty(messageText);
        }
    }
}