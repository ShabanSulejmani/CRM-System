using Microsoft.Playwright;

using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class LogOutStep
    {
        private readonly IPage _page;

        public LogOutStep(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }

        [When(@"I click on the logout button")]
        private async Task IClickOnTheLogOutButton()
        {
            await _page.ClickAsync("button[class='logout-button']");    
            
        }
        [Then(@"I should see the login form again")]
        private async Task IShouldSeeTheLoginFormAgain()
        {
            var element = await _page.WaitForSelectorAsync("h1.staff-login-title",
                new PageWaitForSelectorOptions
                {
                    State = WaitForSelectorState.Visible,
                    Timeout = 10000
                });
            Assert.NotNull(element);
        }
    }
}

