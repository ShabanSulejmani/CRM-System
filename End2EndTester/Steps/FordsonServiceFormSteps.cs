using Microsoft.Playwright;

using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class FordonServiceFormSteps
    {
        private readonly IPage _page;

        public FordonServiceFormSteps(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }

        [When(@"I write ""(.*)"" as the registration number")]
        public async Task WhenIWriteAsTheRegistrationNumber(string regNumber)
        {
            await _page.FillAsync("input[name='registrationNumber']", regNumber);
        }
        
        [When(@"I choose ""(.*)"" as the issue type")]
        public async Task WhenIChooseAsTheIssueType(string issueType)
        {
            await _page.SelectOptionAsync("select[name='issueType']", issueType);
        }
    }
}
