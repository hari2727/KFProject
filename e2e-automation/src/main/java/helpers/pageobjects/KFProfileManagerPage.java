package helpers.pageobjects;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.FindBys;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;


import resuable.*;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static org.testng.Assert.assertTrue;

public class KFProfileManagerPage extends UIHelpers {
	
	WebDriver driver = TestBase.getDriver();

	
	@FindBy(xpath="//*[text()='Profile Manager']")
	WebElement profileManagerHeader;
	@FindBy(xpath = "//*[contains(@class,'kfheader-subnav')]")
	List<WebElement> profileManagerTabs;
	public KFProfileManagerPage() throws IOException {
		PageFactory.initElements(driver, this);
	}

	public void verifyProfileManager() throws Exception {
		waitForPageLoad();
		waitForElementVisibility(profileManagerHeader);
		String actualHeaders = profileManagerHeader.getText();
		  Assert.assertEquals(actualHeaders, "PROFILE MANAGER");
		  List<String> expectedTabs = Arrays.asList("Dashboard", "Success Profiles", "Job Descriptions", "HCM Sync Profiles", "Audit Log");
	        List<String> actualTabs = profileManagerTabs.stream()
	                .map(WebElement::getText)
	                .map(String::trim)
	                .filter(text -> text !=null && !text.isEmpty())
	                .collect(Collectors.toList());
	        Assert.assertEquals(actualTabs, expectedTabs, "Tabs mismatch!");
	}
	
	
	}
	

