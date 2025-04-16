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
        
        [BeforeTestRun]
        public static async Task BeforeTestRun()
        {
            // Initialize Playwright and browser once for the entire test run
            _playwright = await Playwright.CreateAsync();
            _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions 
            { 
                Headless = false, 
                SlowMo = 1000, 
            });
        }
        
        [AfterTestRun]
        public static async Task AfterTestRun()
        {
            // Clean up after all tests are done
            if (_browser != null) await _browser.CloseAsync();
            if (_playwright != null) _playwright.Dispose();
        }
        
        [BeforeScenario]
        public async Task InitializeBrowserContext()
        {
            // Create a fresh context for each scenario
            var context = await _browser.NewContextAsync(new BrowserNewContextOptions
            {
                IgnoreHTTPSErrors = true,
               
            });
            
            // Enable tracing for debugging
            await context.Tracing.StartAsync(new TracingStartOptions
            {
                Screenshots = true,
                Snapshots = true,
                Sources = true
            });
            
            var page = await context.NewPageAsync();
            
       
            _scenarioContext["BrowserContext"] = context;
            _scenarioContext["Page"] = page;
        }
        
        [AfterScenario]
        public async Task CleanupBrowser()
        {
            var page = _scenarioContext.Get<IPage>("Page");
            var context = _scenarioContext.Get<IBrowserContext>("BrowserContext");
            
            try 
            {
                // Save tracing for failed scenarios
                if (_scenarioContext.TestError != null)
                {
                    string scenarioName = _scenarioContext.ScenarioInfo.Title.Replace(" ", "_");
                    await context.Tracing.StopAsync(new TracingStopOptions
                    {
                        Path = $"trace_{scenarioName}_{DateTime.Now:yyyyMMdd_HHmmss}.zip"
                    });
                }
                else
                {
                    await context.Tracing.StopAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error stopping tracing: {ex.Message}");
            }
            
            if (page != null) await page.CloseAsync();
            if (context != null) await context.CloseAsync();
        }
    }
}