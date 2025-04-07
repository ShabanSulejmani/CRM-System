using Microsoft.Playwright;
using TechTalk.SpecFlow;
using Xunit;

namespace End2EndTester.Steps;

[Binding]
public class AdminLoginSteps
{
    private IPlaywright _playwright;
    private IBrowser _browser;
    private IBrowserContext _context;
    private IPage _page;

    [BeforeScenario]
    public async Task Setup()
    {
        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
            { Headless = false, SlowMo = 2000 });
        _context = await _browser.NewContextAsync();
        _page = await _context.NewPageAsync();
    }

    [AfterScenario]
    public async Task Teardown()
    {
        await _browser.CloseAsync();
        _playwright.Dispose();
    }
    [When(@"I fill in the form with valid admin data")]
    public async Task WhenIFillInTheFormWithAdminValidData()
    {
        await _page.FillAsync("input.staff-field-input[type='text']", "KevinAdmin");
        await _page.FillAsync("input.staff-field-input[type='password']", "abc123");
    }


    [Then(@"I should see a the admin dashboard")]
    public async Task ThenIShouldSeeASuccessMessageAsAdmin()
    {
        var element = await _page.QuerySelectorAsync("[href='/admin/dashboard']");
        Assert.NotNull(element);
    }
}