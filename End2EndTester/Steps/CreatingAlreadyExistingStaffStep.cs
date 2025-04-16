using Microsoft.Playwright;

using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class CreatingAlreadyExistingStaffStep
    {
        private readonly IPage _page;

        public CreatingAlreadyExistingStaffStep(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }


        [Then(@"I fill in the create staff form with existing data")]
        private async Task IFillInTheCreateStaffFormWithExistingData()
        {
            // Fill in email
            await _page.FillAsync("input[name='email']", "saban@playrighttest.se");

            // Fill in username
            await _page.FillAsync("input[name='firstName']", "PlayrightTest");

            // Fill in password
            await _page.FillAsync("input[name='password']", "123");

            // Select company - first click to open dropdown
            await _page.ClickAsync("select[name='company']");
            // Wait a moment for dropdown animation
            await Task.Delay(500);
            // Select Tele/Bredband option
            await _page.SelectOptionAsync("select[name='company']", "tele");

            // Select role - first click to open dropdown
            await _page.ClickAsync("select[name='role']");
            // Wait a moment for dropdown animation
            await Task.Delay(500);
            // Select Kundtjänst option
            await _page.SelectOptionAsync("select[name='role']", "staff");
        }
        
        [Then(@"I should see a success message")]
        private async Task IShouldSeeASuccessMessage()
        {
            // Wait for success message to appear
            var successMessage = await _page.WaitForSelectorAsync("div.success-message");
            

        }
        

    }
}