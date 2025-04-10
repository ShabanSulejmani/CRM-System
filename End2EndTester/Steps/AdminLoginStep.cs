using Microsoft.Playwright;

using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class AdminLoginStep
    {
        private readonly IPage _page;
        
        public AdminLoginStep(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }
        
        [When(@"I fill in the form with valid data for a admin")]
        public async Task WhenIFillInTheFormWithValidDataForAdmin()
        {
        
            
            // Vänta längre på elementet för att undvika timeout
            await _page.WaitForSelectorAsync("input.staff-field-input[type='text']", 
                new PageWaitForSelectorOptions 
                { 
                    State = WaitForSelectorState.Visible,
                    Timeout = 60000 // 60 sekunder
                });
            
            await _page.FillAsync("input.staff-field-input[type='text']", "KevinAdmin");
            await _page.FillAsync("input.staff-field-input[type='password']", "abc123");
        }
        
        [Then(@"I should see my user the dashboard for admin")]
        public async Task ThenIShouldSeeMyUserTheDashboardForAdmin()
        {
            var element = await _page.QuerySelectorAsync("a.active[href='/admin/dashboard'][data-discover='true'][aria-current='page']");
            Assert.NotNull(element);
        }
    }
}