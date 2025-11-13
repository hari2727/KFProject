package runners;

import dataProviders.ConfigProperties;
import io.cucumber.testng.CucumberOptions;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import reusable.TestBase;

import java.io.IOException;

@CucumberOptions(features = { "src/test/resources/features/API" }, tags = "@API_Get_Post", glue = {
		"stepdefinitions/api" }, plugin = { "pretty", "html:target/cucumber-reports/api_report.html",
				"json:target/cucumber-reports/api_report.json" }, monochrome = true, dryRun = false)

public class APIRunner extends BaseRunner {
	TestBase testBase;

	@BeforeMethod
	public void setUpBrowser() throws IOException {
		testBase = new TestBase();
		testBase.initAPI(ConfigProperties.getConfigProperties().getString("browser"));
	}

	@AfterMethod
	public void tearDown(ITestResult result) {
		TestBase.driver.quit();
		System.out.println("Driver is closed");
	}

	@Override
	String getRunnerName() {
		return "api";
	}
}
