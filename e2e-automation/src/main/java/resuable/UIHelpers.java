package resuable;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.logging.Logger;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.*;
import org.testng.ITestResult;



public class UIHelpers extends TestBase {

    public static JavascriptExecutor executor;
    public static WebDriverWait wait;
    public static Alert alert;
    public static Actions action = new Actions(driver);
   // private final static Logger log = LoggerHelper.getLogger(UIHelpers.class);

    // To get text of the webelement
    public static String getElementText(WebElement element) throws Exception {
        if (element != null) {
            executor.executeScript("arguments[0].scrollIntoView(true);", element);
            executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
            waitForElementVisibility(element);
            return element.getText();
        }
        return null;
    }

    // To get attribute value of the webelement
    public static String getElementAttribute(WebElement element, String attribute) throws Exception {
        if (element != null) {
            executor.executeScript("arguments[0].scrollIntoView(true);", element);
            executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
            waitForElementVisibility(element);
            return element.getAttribute(attribute);
        }
        return null;
    }

    // To add value through sendKeys
    public static void sendValueToElement(WebElement element, String value) throws Exception {
        if (element != null) {
            executor.executeScript("arguments[0].scrollIntoView(true);", element);
            executor.executeScript("arguments[0].style.border='3px dotted red'", element);
            waitForElementVisibility(element);
            element.clear();
            element.sendKeys(value);
           // log.info("Value sent successfully to the element");
        }
    }

    // Page refresh
    public static void pageRefresh() {
        driver.navigate().refresh();
       // log.info("Page refreshed");
    }

    // Get page url
    public static String getPageURL() {
        return driver.getCurrentUrl();
    }

    // Get page title
    public static String getPageTitle() {
        return driver.getTitle();
    }

    // Get page source
    public static String getPageSource() {
        return driver.getPageSource();
    }

    // Browser wait for application load
    public static void waitForPageLoad() {
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(TestBase.page_Load_Timeout));
      //  log.info("Application page is loaded");
    }

    // Browser close
    public static void closeBrowser() {
        if (driver != null) {
            driver.close();
            //log.info("Browser is closed");
        } else {
            //log.info("driver instance is null");
        }
    }

    // Browser quit
    public static void quitBrowser() {
        if (driver != null) {
            driver.quit();
            //log.info("Browser is quit");
        } else {
           // log.info("driver instance is null");
        }
    }

    // To scroll to the webelement and highlight and click on the webelement
    public void scrollHighlightAndClick(WebElement element) throws Exception {
        executor.executeScript("arguments[0].scrollIntoView(true);", element);
        executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
        waitForElementClickability(element);
        executor.executeScript("arguments[0].click();", element);
        //log.info("Element is highlighted and clicked");
    }

    // To Highlight the webelement
    public static void elementHighlight(WebElement element) throws Exception {
        waitForElementVisibility(element);
        executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
       // log.info("Element is highlighted");
    }

    // To scroll the webelement
    public static void scrollToWebElement(WebElement element) {
        executor.executeScript("arguments[0].scrollIntoView(true);", element);
        //log.info("Scrolled to the element");
    }

    // To click on the webelement
    public static void clickWebElement(WebElement element) throws Exception {
        executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
        //waitForElementClickability(element);
        executor.executeScript("arguments[0].click();", element);
       // log.info("Element is clicked");
    }

    // ***************Handling Windows***********************

    // Handling New window(tab) from Parent window(tab)
    public static void handleNewTab(WebDriver driver) {
        Set<String> allWindowHandles = driver.getWindowHandles();
        int size = allWindowHandles.size();

        Iterator<String> iterator = allWindowHandles.iterator();
        String winHandle = "";

        if (size > 1) {
            while (iterator.hasNext()) {
                winHandle = iterator.next();
            }
            driver.switchTo().window(winHandle);
        }
        //log.info("Switched to new window");

       // log.info("New window url is" + driver.getCurrentUrl());
    }

    // Handling Parent window(tab) from child window(tab)
    // handling popup windows
    public static void handleParentTab(WebDriver driver) {
        Set<String> allWindowHandles = driver.getWindowHandles();
        String parent = (String) allWindowHandles.toArray()[0];
        driver.switchTo().window(parent);
        //log.info("Switched to parent window");
    }

    // Handling child Parent window(tab)
    public static void handleChildParentTab(WebDriver driver) {
        Set<String> allWindowHandles = driver.getWindowHandles();
        String window1 = (String) allWindowHandles.toArray()[1];
        driver.switchTo().window(window1);
        //log.info("Switched to child window");
    }

    // ***************Handling Frames***********************

    // switch to another frame by name
    public void switchToFrameByName(String name) {
        try {
            driver.switchTo().frame(name);
           // log.info("Switched to frame");
        } catch (Exception Ex) {
           // log.info("Frame not found");
        }
    }

    // switch to another frame by WebElement
    public static void switchToFrameByElement(WebElement element) {
        try {
            driver.switchTo().frame(element);
          //  log.info("Switched to frame");
        } catch (Exception Ex) {
          //  log.info("Frame not found");
        }
    }

    // switch to another frame by Id
    public static void switchToFrameById(String id) {
        try {
            driver.switchTo().frame(id);
           // log.info("Switched to frame");
        } catch (Exception Ex) {
           // log.info("Frame not found");
        }
    }

    // switch to another frame by Index
    public void switchToFrameByIndex(int index) {
        try {
            driver.switchTo().frame(index);
           // log.info("Switched to frame");
        } catch (Exception Ex) {
           // log.info("Frame not found");
        }
    }

    // switch to default frame
    public void switchToDefaultFrame(WebDriver driver) {
        try {
            driver.switchTo().defaultContent();
            //log.info("Switched to default frame");
        } catch (Exception Ex) {
            //log.info("Exception occured");
        }
    }

    // *************************************Tables***************************

    // to print all the values in the table
    public void handleTable(WebElement htmltable) {
        List<WebElement> rows = htmltable.findElements(By.tagName("tr"));

        for (int rnum = 0; rnum < rows.size(); rnum++) {

            List<WebElement> columns = rows.get(rnum).findElements(By.tagName("td"));
            //log.info("Number of columns:" + columns.size());

            for (int cnum = 0; cnum < columns.size(); cnum++) {
               // log.info(columns.get(cnum).getText());
            }
        }
    }

    // To validate the specific value in a table
    public void handleTableforSpecificData(WebElement htmltable, String value) {
        List<WebElement> rows = htmltable.findElements(By.tagName("tr"));
        for (int rnum = 0; rnum < rows.size(); rnum++) {
            List<WebElement> columns = rows.get(rnum).findElements(By.tagName("td"));
            for (int cnum = 0; cnum < columns.size(); cnum++) {
                if (columns.get(cnum).getText().equals(value)) {
                   // log.info(columns.get(cnum).getText());
                }
            }
        }
    }

    // To validate the values of specific row in a table
    public void handleTableforSpecificRow(WebElement htmltablerow, String value) {
        List<WebElement> allrows = htmltablerow.findElements(By.tagName("tr"));
        for (int rnum = 0; rnum < allrows.size(); rnum++) {
            if (allrows.get(rnum).getText().contains(value)) {

                List<WebElement> cells = allrows.get(rnum).findElements(By.tagName("td"));

                for (int cnum = 0; cnum < cells.size(); cnum++) {
                   // log.info(cells.get(cnum).getText());
                }
            }
        }
    }

    // **********************Click***********************************

    // Element Click
    public static void click(WebElement element, String ElementReadableName) throws Exception {
        try {
            waitForElementClickability(element);
            executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
            element.click();
           // log.info(ElementReadableName + " is clicked");
        } catch (Exception e) {

            throw new Exception(ElementReadableName + " is not clicked");
        }
    }

    // JavaScript ClickMethod
    public static void jsClick(WebElement element, String ElementReadableName) throws Exception {
        try {
            waitForElementClickability(element);
            executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
            executor.executeScript("arguments[0].click();", element);
            //log.info(ElementReadableName + " is clicked");
        } catch (Exception e) {
            throw new Exception(ElementReadableName + " is not clicked");
        }
    }

    // Double Click
    public static void doubleClick(WebElement element) {
        try {
            waitForElementClickability(element);
            executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
            action.doubleClick(element).build().perform();
            //log.info("Double click performed on element");
        } catch (Exception e) {

            //log.info("No such Element present");
        }
    }

    // Mouse Over Click
    public static void moveToElementAndEnter(WebElement element) throws Exception {
        try {
            waitForElementVisibility(element);
            executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
            waitForElementClickability(element);
            action.moveToElement(element).click().build().perform();
           // log.info("Moved to element and entered");
        } catch (Exception e) {
            throw new Exception("No such Element present");
        }
    }

    // Drag and Drop
    public static void dragAndDropElement(WebElement sourceElement, WebElement targetElement) throws Exception {
        try {
            executor.executeScript("arguments[0].style.border='3px dotted blue'", targetElement);
            waitForElementVisibility(sourceElement);
            waitForElementVisibility(targetElement);
            action.dragAndDrop(sourceElement, targetElement).build().perform();
            //log.info("Drag and Drop is performed");
        } catch (Exception e) {
            throw new Exception("No such Element present");
        }
    }

    // Mouse hovering on the element
    public static void mouseHoverOnElement(WebElement element) throws Exception {
        try {
            executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
            waitForElementVisibility(element);
            action.moveToElement(element).build().perform();
            //log.info("Mouse hover on element");
        } catch (Exception e) {
            throw new Exception("No such Element present");
        }
    }

    // Right clicks on the element
    public static void rightClickOnElement(WebElement element) throws Exception {
        try {
            executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
            waitForElementVisibility(element);
            action.contextClick(element).build().perform();
            //log.info("Right click is performed");
        } catch (Exception e) {
            throw new Exception("No such Element present");
        }
    }

    // ElementIsDisplayed
    public static boolean checkElementDisplayed(WebElement element) {
        executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
        boolean b = element.isDisplayed();
        if (b == true) {
           // log.info("Element is displayed");
        } else {
           // log.info("Element is not displayed");
        }
        return b;
    }

    // ElementIsEnabled
    public static boolean checkElementEnabled(WebElement element) {
        executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
        boolean b = element.isEnabled();
        if (b == true) {
           // log.info("Element is enabled");
        } else {
            //log.info("Element is not enabled");
        }
        return b;
    }

    // ************************DropDown***************************

    // Handle DropDown
    public static void selectByValue_Dropdown(WebElement element, String functionname, String valuetobeselected) {
        executor.executeScript("arguments[0].style.border='3px dotted blue'", element);
        Select Selectvalue = new Select(element);

        if (functionname.equalsIgnoreCase("byindex")) {
            Selectvalue.selectByIndex(Integer.parseInt(valuetobeselected));
           // log.info("Selected by index");
        } else if (functionname.equalsIgnoreCase("byvalue")) {
            Selectvalue.selectByValue(valuetobeselected);
           // log.info("Selected by value");
        } else if (functionname.equalsIgnoreCase("byvisibletext")) {
            Selectvalue.selectByVisibleText(valuetobeselected);
          //  log.info("Selected by text");
        }
    }

    // Select Random values from the dropdown
    public static void selectRandomValue_Dropdown(WebElement scrollDropDownRandomvalues) {
        Select s = new Select(scrollDropDownRandomvalues);
        List<WebElement> itemCount = s.getOptions(); // get the count of elements in list of WebElement
        int count = itemCount.size();
        Random num = new Random();
        int iSelect = num.nextInt(count);
        s.selectByIndex(iSelect);
        //log.info("Random value in dropdown is selected");
    }

    // To print selected options value
    public static void selectVaraiableValue_Dropdown(WebElement scrollDropDownRandomvalues) {
        Select s = new Select(scrollDropDownRandomvalues);
        List<WebElement> web = s.getAllSelectedOptions();
        for (WebElement x : web) {

            String value = x.getText();
            //log.info("Value is" + value);
        }
    }

    // **********************Screenshot*****************************

    // To take screenshot for passed scenario
    public static void takeScreenShot(String screenshotName) {
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(TestBase.implicit_Wait));
        String dateName = new SimpleDateFormat("yyyyMMddhhmmss").format(new Date());
        TakesScreenshot sc = (TakesScreenshot) TestBase.driver;
        File sourceFileScreenshot = sc.getScreenshotAs(OutputType.FILE);

        String destinationFile = System.getProperty("user.dir") + "/Screenshots/" + screenshotName + dateName + ".png";

        try {
            File finalDestination = new File(destinationFile);
            FileUtils.copyFile(sourceFileScreenshot, finalDestination);
        } catch (IOException e) {

            e.printStackTrace();
        }
    }

     //To take screenshot for failed scenario
    public static void takeScreenShotForFailedCase(ITestResult result) {
        if (ITestResult.FAILURE == result.getStatus()) {
            try {
                TakesScreenshot ts = (TakesScreenshot) TestBase.driver;
                File source = ts.getScreenshotAs(OutputType.FILE);
                FileUtils.copyFile(source, new File("./ScreenshotsFailed/" + result.getName() + ".png"));
               // log.info("Failed Testcase Screenshot taken");
            } catch (Exception e) {
                //log.info("Exception while taking screenshot " + e.getMessage());
            }
        }
    }

    // ****************************Calendar***************************

    // Method used to select current date to the field
    public static void currentCalendardateInput(WebElement element) throws Exception {
        try {
            DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm");
            Calendar cal = Calendar.getInstance();
            String newDate = dateFormat.format(cal.getTime());
            element.clear();
            element.sendKeys(newDate);
           // log.info(newDate + " date is entered into field");
        } catch (Exception e) {
            throw new Exception("Error while Entering the current date into field");
        }
    }

    // Method enter present/future date to the field
    public static void enterCalendarInput(WebElement element, String datevalue) throws Exception {
        try {
            // enter date
            DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
            Date newDate = dateFormat.parse(datevalue);
            String strDate = dateFormat.format(newDate);
            element.clear();
            element.sendKeys(strDate);
            //log.info(strDate + " date is entered into field");
        } catch (Exception e) {
            throw new Exception("Error while Entering the date into field");
        }
    }

    // ****************************Alerts************************

    // Method used to accept the alert
    public static void acceptAlert() throws Exception {
        try {
            alert = driver.switchTo().alert();
            alert.accept();
            //log.info("Alert accepted");
        } catch (Exception e) {

            throw new Exception("No such Alert present");
        }
    }

    // Method used to accept the alert using JavaScript
    public static void javaScriptAcceptAlert() throws Exception {
        try {

        	 wait = new WebDriverWait(driver, Duration.ofSeconds(TestBase.explicit_Wait));
            alert = wait.until(ExpectedConditions.alertIsPresent());
            alert.accept();
            //log.info("Alert popup accepted");
        } catch (Throwable e) {
           // log.info("Error came while waiting for the alert popup. " + e.getMessage());
        }
    }

    // Method to dismiss the alert
    public static void dismissAlert() throws Exception {
        try {
            alert = driver.switchTo().alert();
            alert.dismiss();
            //log.info("Alert dismissed");
        } catch (Exception e) {
            throw new Exception("No such Alert present");
        }
    }

    // Method used to dismiss the alert using JavaScript
    public static void javaScriptDismissAlert() throws Exception {
        try {

        	 wait = new WebDriverWait(driver, Duration.ofSeconds(TestBase.explicit_Wait));
            alert = wait.until(ExpectedConditions.alertIsPresent());
            alert.dismiss();
           // log.info("Alert popup dismissed");
        } catch (Throwable e) {
            //log.info("Error came while waiting for the alert popup. " + e.getMessage());
        }
    }

    // Method to capture the alert message.

    public static String getAlertMessage() throws Exception {
        try {
            String alertMsg = driver.switchTo().alert().getText();
            //log.info("Alert message is " + alertMsg);
            return alertMsg;
        } catch (Exception e) {
            throw new Exception("Unable to get Alert Message");
        }
    }

    // Method to send some data to alert box.

    public static void sendMsgToAlertBox(String message) throws Exception {
        try {
            driver.switchTo().alert().sendKeys(message);
            //log.info("Message sent to alert box");
        } catch (Exception e) {
            throw new Exception("No such Alert present");
        }
    }

    // ****************************Radio button *****************

  //   Method to select the radio button
    public static void checkRadioBtn(WebElement element, String ReadableName) throws Exception {
        try {

            wait = new WebDriverWait(driver, Duration.ofSeconds(TestBase.explicit_Wait));
            wait.until(ExpectedConditions.elementToBeClickable(element));
            element.click();
            //log.info("Element " + ReadableName + " is clicked");
        } catch (NoSuchElementException e) {

            throw new Exception("Element " + ReadableName + " is not clicked");
        } catch (Exception e) {

            throw new Exception("Element " + ReadableName + " is not clicked");
        }
    }

    // *******************checkbox**********************

    // Method to select the checkBox
    public static void enableCheckBox(WebElement element, String ReadableName) throws Exception {
        try {
            wait = new WebDriverWait(driver,Duration.ofSeconds(TestBase.explicit_Wait));
            wait.until(ExpectedConditions.elementToBeClickable(element));
            if (element.isSelected()) {
               // log.info(ReadableName + " is already checked");
            } else {
                element.click();
              //  log.info(ReadableName + " is checked");
            }
        } catch (NoSuchElementException e) {

            throw new Exception("Element " + ReadableName + " is not clicked");
        }
    }

    // Method to disselect the checkBox
    public static void disableCheckBox(WebElement element, String ReadableName) throws Exception {
        try {
            wait = new WebDriverWait(driver, Duration.ofSeconds(TestBase.explicit_Wait));
            wait.until(ExpectedConditions.elementToBeClickable(element));
            if (element.isSelected()) {
                element.click();
                //log.info(ReadableName + " is unchecked");
            } else {
                //log.info(ReadableName + " is already Unchecked");
            }
        } catch (NoSuchElementException e) {

            throw new Exception("Element " + ReadableName + " is not clicked");
        }
    }

    // **************************Browser Navigation**********************

    public void browserNavigateBack() {
        driver.navigate().back();
       // log.info("Browser navigated backward");
    }

    public void browserNavigateForward() {
        driver.navigate().forward();
        //log.info("Browser navigated forward");
    }

//    // ****************************Waits********************************
//
    public static void waitForElementVisibility(WebElement element) throws Exception {
        try {
        	 wait = new WebDriverWait(driver, Duration.ofSeconds(TestBase.explicit_Wait));
            wait.until(ExpectedConditions.visibilityOf(element));
            //log.info("Element is visible");
        } catch (Exception e) {
            throw new Exception("Element is not visible");
        }
    }

    public static void waitForElementClickability(WebElement element) throws Exception {
        try {
            wait = new WebDriverWait(driver, Duration.ofSeconds(TestBase.explicit_Wait));
            wait.until(ExpectedConditions.elementToBeClickable(element));
           // log.info("Element is clickable");
        } catch (Exception e) {
            throw new Exception("Element is not clickable");
        }
    }

//    public static boolean waitForElementVisible(WebDriver driver, long time, WebElement element) throws Exception {
//        boolean flag = false;
//        try {
//            wait = new WebDriverWait(driver, time);
//            wait.until(ExpectedConditions.visibilityOf(element));
//            flag = true;
//            //log.info("Element visibility is true");
//        } catch (Exception e) {
//            throw new Exception("Element visibility is false");
//        }
//        return flag;
//    }

//    public static boolean waitForElementToBeVisibile_List(WebDriver driver, Duration time, List<WebElement> elements)
//            throws Exception {
//        boolean flag = false;
//        try {
//            wait = new WebDriverWait(driver,Duration.ofSeconds(time));
//            wait.until(ExpectedConditions.visibilityOfAllElements(elements));
//            flag = true;
//            //log.info("All elements visibility is true");
//        } catch (Exception e) {
//            throw new Exception("All elements visibility is false");
//        }
//        return flag;
//    }

//    public static boolean waitForElementToBeClickable(WebDriver driver, long time, WebElement element) throws Exception {
//        boolean flag = false;
//        try {
//            wait = new WebDriverWait(driver, time);
//            wait.until(ExpectedConditions.elementToBeClickable(element));
//            flag = true;
//           // log.info("Element is clickable");
//        } catch (Exception e) {
//            throw new Exception("Element is not clickable");
//        }
//        return flag;
//    }

    public static boolean implicitWaitForElement(WebDriver driver, long time, WebElement element) throws Exception {
        boolean res = false;
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
        try {
            res = element.isDisplayed();
            //log.info("Element is found" + res);
        } catch (Exception e) {
            throw new Exception("Element is not found");
        }
        return res;
    }

  //  @SuppressWarnings("deprecation")
//    public static void fluentwaitForElement(final By element) throws Exception {
//        try {
//            Wait<WebDriver> wait = new FluentWait<WebDriver>(driver).withTimeout(Duration.ofSeconds(20)
//                    .pollingEvery(5, TimeUnit.SECONDS).ignoring(NoSuchElementException.class);
//
//            wait.until(new Function<WebDriver, WebElement>() {
//                public WebElement apply(WebDriver driver) {
//                    return driver.findElement(element);
//                }
//            });
//        } catch (Exception e) {
//
//            throw new Exception("No such element found");
//        }
//    }
}
