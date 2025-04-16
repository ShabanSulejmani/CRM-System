using Microsoft.Playwright;
using TechTalk.SpecFlow;

namespace End2EndTester.Steps
{
    [Binding]
    public class StartChattAsUserStep
    {
        private readonly IPage _page;

        public StartChattAsUserStep(ScenarioContext scenarioContext)
        {
            _page = scenarioContext.Get<IPage>("Page");
        }

   
        [When(@"I click on the chat button")]
        public async Task WhenIClickOnTheChatButton()
        {
            await _page.ClickAsync("a[href='/chat/6d7ad93c-2f62-480e-a115-f8aedca32343']");
        }

        [Then(@"I should see the chat window")]
        
        public async Task ThenIShouldSeeTheChatWindow()
        {
            var element = await _page.WaitForSelectorAsync("h2.chat-modal__name",
                new PageWaitForSelectorOptions
                {
                    State = WaitForSelectorState.Visible,
                    Timeout = 1000
                });
            Assert.NotNull(element);
        }
        [Then(@"I Write a message in the chat window")]
        public async Task WhenIWriteAMessageInTheChatWindow()
        {
            await _page.FillAsync("input.chat-modal__input-field", "Test Playright");
        }

        [When(@"I press send")]
        public async Task WhenIPressSend()
        {
            await _page.ClickAsync("button.chat-modal__send-button");
        }

        [Then(@"I should see my message in the chat window")]
        public async Task WhenIShouldSeeMyMessageInTheChatWindow()
        {
            var messageElement = await _page.WaitForSelectorAsync("p.chat-modal__message-text:has-text('Test Playright')",
                new PageWaitForSelectorOptions
                {
                    State = WaitForSelectorState.Visible,
                    Timeout = 5000
                });
            Assert.NotNull(messageElement);
        }

        [Then(@"I press the end chat button")]
        public async Task WhenIPressTheEndChatButton()
        {
            await _page.ClickAsync("button.chat-modal__close");
        }

        [Then(@"I should see the dashboard again")]
        public async Task ThenIShouldSeeTheDashboardAgain()
        {
            var dashboardElement = await _page.WaitForSelectorAsync("span.user-name",
                new PageWaitForSelectorOptions
                {
                    State = WaitForSelectorState.Visible,
                    Timeout = 5000
                });
            Assert.NotNull(dashboardElement);
        }
    }

}