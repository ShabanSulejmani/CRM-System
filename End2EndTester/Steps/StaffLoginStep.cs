
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
            await _page.GotoAsync("http://localhost:3001/", new PageGotoOptions 
            { 
                WaitUntil = WaitUntilState.NetworkIdle,
                Timeout = 30000 
            });
        }

        [Given(@"I see the login button")]
        public async Task GivenISeeTheRegisterButton()
        {
            // Wait for the login button with more robust waiting
            var element = await _page.WaitForSelectorAsync("[class='navbar-right']", 
                new PageWaitForSelectorOptions 
                { 
                    State = WaitForSelectorState.Visible,
                    Timeout = 10000 
                });
            Assert.NotNull(element);
        }

        [When(@"I click on the login button")]
        public async Task WhenIClickOnTheRegisterButton()
        {
            // Add a small delay and ensure visibility before clicking
            await _page.WaitForSelectorAsync("[class='navbar-right']", 
                new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible });
            await _page.ClickAsync("[class='navbar-right']");
        }
        
        [Then(@"I should see the login form")]
        public async Task ThenIShouldSeeTheRegisterForm()
        {
            var element = await _page.WaitForSelectorAsync("[class='staff-login-title']", 
                new PageWaitForSelectorOptions 
                { 
                    State = WaitForSelectorState.Visible,
                    Timeout = 10000 
                });
            Assert.NotNull(element);
        }
        
        [When(@"I fill in the form with valid data")]
        public async Task WhenIFillInTheFormWithValidData()
        {
            // Wait for input fields to be ready
            await _page.WaitForSelectorAsync("input.staff-field-input[type='text']", 
                new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible });
            await _page.WaitForSelectorAsync("input.staff-field-input[type='password']", 
                new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible });
                
            await _page.FillAsync("input.staff-field-input[type='text']", "Saban");
            await _page.FillAsync("input.staff-field-input[type='password']", "12345");
        }
        
        [When(@"I click on the submit button")]
        public async Task WhenIClickOnTheSubmitButton()
        {
            await _page.ClickAsync("button.staff-login-button");
            await _page.WaitForTimeoutAsync(500);
        }
        
        
        [Then(@"I should see my user name at the dashboard page")]
        public async Task ThenIShouldSeeMyUserNameAtTheDashboardPage()
        {
            // Wait longer for the dashboard to load
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);
            
            var element = await _page.WaitForSelectorAsync("[class='user-name']", 
                new PageWaitForSelectorOptions 
                
                    { 
                        State = WaitForSelectorState.Visible,
                        Timeout = 500 
                    });
               
            Assert.NotNull(element);
        }
    }
}