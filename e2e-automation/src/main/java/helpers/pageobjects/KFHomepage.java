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

public class KFHomepage extends UIHelpers {
	
	WebDriver driver = TestBase.getDriver();

	
	@FindBy(xpath="//div[text()='Profile Manager']")
	WebElement profileManagerbtn;
	public KFHomepage() throws IOException {
		PageFactory.initElements(driver, this);
	}

	public void verifyHomePage() throws Exception {
		String url=getPageURL();
		System.out.println(url);
	}
	
    public void clickProfileManagerSection() throws Exception {
    	waitForPageLoad();
    	waitForElementClickability(profileManagerbtn);
       clickWebElement(profileManagerbtn);
	    waitForPageLoad();
    }
	
	}
	

