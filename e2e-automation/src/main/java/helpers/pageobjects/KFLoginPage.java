package helpers.pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;


import resuable.*;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import static org.testng.Assert.assertTrue;

public class KFLoginPage extends UIHelpers {
	  WebDriver driver = TestBase.getDriver();


	@FindBy(xpath = "//input[@id='email-input']")
	WebElement textBoxEmailId;
	
	@FindBy(xpath = "//button[@id='submit-button']")
	WebElement signInBtn;
	@FindBy(xpath = "//button[@id='ensRejectAll']")
	WebElement RejectallCookiesBtn;
	
	@FindBy(xpath ="//input[@id='password-input']")
	WebElement textboxPassword;
	
	public KFLoginPage() throws IOException {
		PageFactory.initElements(driver, this);
	}

	

	public void clickOnSignInBtn() throws Exception {
		checkElementEnabled(signInBtn);
		clickWebElement(signInBtn);
	}



	public void enterEmailId() throws Exception {
	    Thread.sleep(5000);
	    rejectCookiesBanner();
		checkElementDisplayed(textBoxEmailId);
		sendValueToElement(textBoxEmailId, "clm.user.one@testkfy.com");
	}
	
	public void rejectCookiesBanner() throws Exception {
		boolean displayed= UIHelpers.checkElementDisplayed(RejectallCookiesBtn);
				if(displayed) {
					UIHelpers.clickWebElement(RejectallCookiesBtn);
				}
				else {
					System.out.println("cookie banner not displayed");
				}
	}
	
	public void enterPassword() throws Exception {
		  try {
	            waitForElementVisibility(textboxPassword);
	            checkElementDisplayed(textboxPassword);
	            sendValueToElement(textboxPassword, "202510DigitalLog!");
	        } catch (Exception e) {
	        	 throw e;
	        }
	}
	
	
	

}
