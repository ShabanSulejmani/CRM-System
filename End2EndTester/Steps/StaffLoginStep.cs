using Microsoft.Playwright;
using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class StaffLoginStep
    {
        private readonly IPage _page;
        
        public StaffLoginStep(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }

        [Given(@"I am at the WTP homepage")]
        public async Task GivenIAmOnTheWTPHomepage()
        {
            await _page.GotoAsync("http://localhost:3001/");
        }

        [Given(@"I see the login button")]
        public async Task GivenISeeTheRegisterButton()
        {
            var element = await _page.QuerySelectorAsync("[class='navbar-right']");
            Assert.NotNull(element);
        }

        [When(@"I click on the login button")]
        public async Task WhenIClickOnTheRegisterButton()
        {
            await _page.ClickAsync("[class='navbar-right']");
        }
        
        [Then(@"I should see the login form")]
        public async Task ThenIShouldSeeTheRegisterForm()
        {
            var element = await _page.QuerySelectorAsync("[class='staff-login-title']");
            Assert.NotNull(element);
        }
        
        [When(@"I fill in the form with valid data")]
        public async Task WhenIFillInTheFormWithValidData()
        {
            await _page.FillAsync("input.staff-field-input[type='text']", "Saban");
            await _page.FillAsync("input.staff-field-input[type='password']", "12345");
        }
        
        [When(@"I click on the submit button")]
        public async Task WhenIClickOnTheSubmitButton()
        {
            await _page.ClickAsync("button.staff-login-button");
        }
        
        [Then(@"I should see my user name at the dashboard page")]
        public async Task ThenIShouldSeeMyUserNameAtTheDashboardPage()
        {
            var element = await _page.QuerySelectorAsync("[class='user-name']");
            Assert.NotNull(element);
        }
    }
}