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

public class KFLandingPage extends UIHelpers {
	
	WebDriver driver = TestBase.getDriver();


	@FindBy(xpath = "//*[text()='Clients']")
	WebElement clientsHeader;
	
	@FindBy(xpath = "//*[@id='search-client-input-search']")
	WebElement searchClientField;
	@FindBy(xpath = "//*[name()='svg' and contains(@data-testid,'search-icon')]")
	WebElement searchIcon;
	
	@FindBy(xpath ="//table/thead/tr/th/div/p")
	List<WebElement> tableHeaders;
    @FindBy(xpath = "//table/tbody/tr/td[1]") 
    List<WebElement> clientNames;
	
	public KFLandingPage() throws IOException {
		PageFactory.initElements(driver, this);
	}

	public void verifyLandingPage() throws Exception {
		waitForPageLoad();
		 waitForElementVisibility(clientsHeader);
		 Assert.assertTrue(clientsHeader.isDisplayed());	
		 List<String> expectedHeaders = Arrays.asList("Client", "Products", "PAMS ID", "Last Updated", "Edit");
	        List<String> actualHeaders = tableHeaders.stream()
	                .map(WebElement::getText)
	                .map(String::trim)
	                .filter(text -> text !=null && !text.isEmpty())
	                .collect(Collectors.toList());
	        System.out.println("Actual Headers: " + actualHeaders);

	       Assert.assertEquals(actualHeaders, expectedHeaders, "Table headers mismatch!");
	}
	
	public void verifySearchField() {
		waitForPageLoad();
		Assert.assertTrue(searchClientField.isDisplayed());
		Assert.assertTrue(searchIcon.isDisplayed());
	}
	
	public void searchAClient() throws Exception {
		String searchText= "CLM";
		searchClientField.sendKeys(searchText,Keys.ENTER);
	Thread.sleep(5000);
		// Wait until table is refreshed and rows appear
        waitForElementVisibility(clientNames.getFirst());

        // Get visible client names
        List<String> displayedClients = clientNames.stream()
                .map(WebElement::getText)
                .map(String::trim)
                .collect(Collectors.toList());

        System.out.println("Search Results for '" + searchText + "': " + displayedClients);

        // Verify that each result contains the search term (case-insensitive)
        for (String name : displayedClients) {
            Assert.assertTrue(name.toLowerCase().contains(searchText.toLowerCase()),
                    "Client name does not contain search text: " + name);
        }

        // Click the first matching client
        if (!clientNames.isEmpty()) {
            WebElement firstClient = clientNames.get(0);
            System.out.println("Clicking on client: " + firstClient.getText());
            
           //clickWebElement(firstClient);
            firstClient.click();
        } else {
            Assert.fail("No clients found for search text: " + searchText);
        }
        Thread.sleep(5000);
    }
	}
	

