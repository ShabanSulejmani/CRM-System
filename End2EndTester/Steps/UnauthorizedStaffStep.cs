using Microsoft.Playwright;

using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class UnauthorizedStaffStep
    {
        private readonly IPage _page;

        public UnauthorizedStaffStep(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }

        [When(@"I fill in the form with invalid data")]

        public async Task WhenIFillInTheFormWithInvalidData()
        {
            
            await _page.WaitForSelectorAsync("input.staff-field-input[type='text']",
                new PageWaitForSelectorOptions
                {
                    State = WaitForSelectorState.Visible,
                });

            await _page.FillAsync("input.staff-field-input[type='text']", "Hej");
            await _page.FillAsync("input.staff-field-input[type='password']", "123");
        }

        [Then(@"I should see an error message")]
        public async Task ThenIShouldSeeAnErrorMessage()
        {
            var errorElement = await _page.WaitForSelectorAsync("div[class='error-message']",
                new PageWaitForSelectorOptions
                {
                    State = WaitForSelectorState.Visible,
                    Timeout = 5000
                });
            Assert.NotNull(errorElement);

        }
    }
}