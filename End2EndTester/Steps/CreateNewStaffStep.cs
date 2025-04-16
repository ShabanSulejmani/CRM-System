using Microsoft.Playwright;

using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class CreateNewStaffStep
    {
        private readonly IPage _page;

        public CreateNewStaffStep(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }


        [When(@"I click on the create staff button")]
        private async Task IClickOnTheCreateStaffButton()
        {
            await _page.ClickAsync("a[data-discover='true']:has-text('Create User')");


        }

        [Then(@"I should see the create staff form")]
        private async Task IShouldSeeTheCreateStaffForm()
        {

            var formHeader = await _page.WaitForSelectorAsync("h1.admin-login");
            var headerText = await formHeader.TextContentAsync();

        }

        [Then(@"I fill in the create staff form with valid data")]
        private async Task IFillInTheCreateStaffFormWithValidData()
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

        [Then(@"I click on the submit button to create the staff member")]
        private async Task IClickOnTheCreateStaffFormButton()
        {
            await _page.ClickAsync("button[class='bla']");

        }

        [Then(@"I should see an error message for existing staff")]
        private async Task IShouldSeeMessageForAlreadyExistingUser()
        {

            var errorMessage = await _page.WaitForSelectorAsync("div.success-message");


            var messageText = await errorMessage.InnerTextAsync();


            if (messageText.Contains("Användare kunde inte skapas"))
            {

                return;
            }
            else
            {
                throw new Exception("Felmeddelandet är inte det förväntade.");
            }
        }
    }
}