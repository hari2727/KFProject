package runners;

import io.opentelemetry.sdk.autoconfigure.spi.ConfigProperties;
import io.cucumber.testng.CucumberOptions;

import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;

import com.kfarchitect.manager.PageObjectManager;

import resuable.*;

@CucumberOptions(
        features = {"src/test/resources/features/Functional"},
//        tags = "@DemoFeature",
        glue = {"stepdefinitions/functional"},
        plugin = {"pretty", "html:target/cucumber-reports/functional_report.html", "json:target/cucumber-reports/functional_report.json"},
        monochrome = true, dryRun = false)

public class FunctionalRunner extends BaseRunner {
	public static WebDriver driver;
    TestBase testBase;
    PageObjectManager pom = new PageObjectManager();
    @BeforeClass
    public void setUpBrowser() throws Exception {
        testBase = new TestBase();
  //      testBase.init(configProperties.getConfigProperties().getString("browser"), "DemoURL");
    testBase.init("chrome", "https://home.kornferrytalent-dev.com/login");
    
    }

    @AfterClass
    public void closeBrowser() {
        UIHelpers.quitBrowser();
    }

    @Override
    String getRunnerName() {
        return "functional";
    }
}