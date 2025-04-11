using Microsoft.Playwright;
using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class FörsäkringsÄrendeFormSteps
    {
        private readonly IPage _page;

        public FörsäkringsÄrendeFormSteps(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }
        
        [When(@"I choose ""(.*)"" as the insurance type")]
        public async Task WhenIChooseAsTheInsuranceType(string insuranceType)
        {
            await _page.SelectOptionAsync("select[name='insuranceType']", insuranceType);
        }

    }
}