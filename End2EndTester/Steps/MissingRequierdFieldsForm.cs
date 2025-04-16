using Microsoft.Playwright;

using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class MissingRequierdFieldsForm
    {
        private readonly IPage _page;

        public MissingRequierdFieldsForm(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }

        
        [When(@"I send the form without filling required fields")]
        public async Task WhenISendTheFormWithoutFillingRequiredFields()
        {
            // Clear any filled fields first
            await _page.EvaluateAsync("document.querySelector('input[name=\"firstName\"]').value = ''");
            await _page.EvaluateAsync("document.querySelector('input[name=\"email\"]').value = ''");
        
            await _page.ClickAsync("button.dynamisk-form-button");
        }
        
        [Then(@"Validation errors will appear")]
        public async Task ValidationErrorsWillAppear()
        {
            // Check for HTML5 validation errors
            var isValid = await _page.EvaluateAsync<bool>("() => document.querySelector('form').checkValidity()");
            Assert.False(isValid);
        
            // Alternative: Check for visible error message if your form shows custom errors
            var errorElement = await _page.QuerySelectorAsync(".dynamisk-message.error");
            if (errorElement != null)
            {
                var errorText = await errorElement.TextContentAsync();
                Assert.NotEmpty(errorText);
            }
        }
        
        
        
    }
}