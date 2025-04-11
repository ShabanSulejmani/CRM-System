using Microsoft.Playwright;
using TechTalk.SpecFlow;

namespace End2EndTester.Hooks
{
    [Binding]
    public class PlaywrightHooks
    {
        private static IPlaywright _playwright;
        private static IBrowser _browser;
        private readonly ScenarioContext _scenarioContext;
        
        public PlaywrightHooks(ScenarioContext scenarioContext)
        {
            _scenarioContext = scenarioContext;
        }
        
        [BeforeScenario]
        public async Task InitializeBrowserContext()
        {
            _playwright = await Playwright.CreateAsync();
            _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions 
            { 
                Headless = false, 
                SlowMo = 2000 
            });
            
            var context = await _browser.NewContextAsync();
            var page = await context.NewPageAsync();
            
            _scenarioContext["BrowserContext"] = context;
            _scenarioContext["Page"] = page;
        }
        
        [AfterScenario]
        public async Task CleanupBrowser()
        {
            var page = _scenarioContext.Get<IPage>("Page");
            var context = _scenarioContext.Get<IBrowserContext>("BrowserContext");
            
            if (page != null) await page.CloseAsync();
            if (context != null) await context.CloseAsync();
            if (_browser != null) await _browser.CloseAsync();
            if (_playwright != null) _playwright.Dispose();
        }
    }
}