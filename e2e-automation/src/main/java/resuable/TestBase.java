package resuable;

import java.io.IOException;
import java.util.logging.Logger;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.UnexpectedAlertBehaviour;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.safari.SafariDriver;


import io.github.bonigarcia.wdm.WebDriverManager;
import io.github.bonigarcia.wdm.config.OperatingSystem;
import io.github.bonigarcia.wdm.managers.*;
import io.opentelemetry.sdk.autoconfigure.spi.ConfigProperties;
//import loggers.LoggerHelper;

public class TestBase {
    public static WebDriver driver;
    public static long page_Load_Timeout = 60;
    public static long implicit_Wait = 20;
    public static long explicit_Wait = 30;
   // private final Logger log = LoggerHelper.getLogger(TestBase.class);

    // initialize browser
    public WebDriver init(String browser, String baseUrl) throws IOException {
        if (browser.equalsIgnoreCase("chrome")) {
            WebDriverManager webDriverManager = new ChromeDriverManager();
            webDriverManager.operatingSystem(OperatingSystem.WIN);
            WebDriverManager.chromedriver().clearDriverCache();
            WebDriverManager.chromedriver().clearResolutionCache();
            ChromeOptions chromeOptions = new ChromeOptions();
            chromeOptions.addArguments("--no-sandbox");
            chromeOptions.addArguments("--disable-gpu");
            chromeOptions.addArguments("--disable-popup-blocking");
            chromeOptions.addArguments("--disable-dev-shm-usage");
            chromeOptions.setCapability(CapabilityType.UNHANDLED_PROMPT_BEHAVIOUR, UnexpectedAlertBehaviour.IGNORE);
//            String headless = System.getProperties().getProperty("headless", null);
//            if (headless == null || !headless.equals("false")) {
//               // log.info("Running Headless mode");
//                chromeOptions.addArguments("--headless");
            //}
            chromeOptions.addArguments("--disable-gpu", "--window-size=1920,1200", "--ignore-certificate-errors");
            driver = new ChromeDriver(chromeOptions);
           // log.info("Chrome browser initiated");
     }
         //   else if (browser.equalsIgnoreCase(Browsers.IE.name())) {
//            WebDriverManager webDriverManager = new InternetExplorerDriverManager();
//            webDriverManager.operatingSystem(OperatingSystem.WIN);
//            WebDriverManager.iedriver().clearDriverCache();
//            WebDriverManager.iedriver().clearResolutionCache();
//            WebDriverManager.iedriver().setup();
//            driver = new InternetExplorerDriver();
//            log.info("IE browser initiated");
//        } else if (browser.equalsIgnoreCase(Browsers.FIREFOX.name())) {
//            WebDriverManager webDriverManager = new FirefoxDriverManager();
//            webDriverManager.operatingSystem(OperatingSystem.WIN);
//            WebDriverManager.firefoxdriver().clearDriverCache();
//            WebDriverManager.firefoxdriver().clearResolutionCache();
//            WebDriverManager.firefoxdriver().setup();
//            driver = new FirefoxDriver();
//            log.info("Firefox browser initiated");
//        } else if (browser.equalsIgnoreCase(Browsers.EDGE.name())) {
//            WebDriverManager webDriverManager = new EdgeDriverManager();
//            webDriverManager.operatingSystem(OperatingSystem.WIN);
//            WebDriverManager.edgedriver().clearDriverCache();
//            WebDriverManager.edgedriver().clearResolutionCache();
//            WebDriverManager.edgedriver().setup();
//            driver = new EdgeDriver();
//            log.info("Edge browser initiated");
//        } else if (browser.equalsIgnoreCase(Browsers.SAFARI.name())) {
//            WebDriverManager webDriverManager = new SafariDriverManager();
//            webDriverManager.operatingSystem(OperatingSystem.WIN);
//            WebDriverManager.safaridriver().clearDriverCache();
//            WebDriverManager.safaridriver().clearResolutionCache();
//            WebDriverManager.safaridriver().setup();
//            driver = new SafariDriver();
//            log.info("Safari browser initiated");
//        }

        UIHelpers.executor = ((JavascriptExecutor) driver);
        driver.manage().deleteAllCookies();
        driver.manage().window().maximize();

        //String url = ConfigProperties.getConfigProperties().getString(baseUrl);
        driver.get(baseUrl);
        return driver;
        //log.info(url + "is fetched");
    }

    // initialize browser for API feature
////    public void initAPI(String browser) throws IOException {
////        if (browser.equalsIgnoreCase(Browsers.CHROME.name())) {
////            WebDriverManager webDriverManager = new ChromeDriverManager();
////            webDriverManager.operatingSystem(OperatingSystem.WIN);
////            WebDriverManager.chromedriver().clearDriverCache();
////            WebDriverManager.chromedriver().clearResolutionCache();
////            WebDriverManager.chromedriver().setup();
////            ChromeOptions chromeOptions = new ChromeOptions();
////            chromeOptions.addArguments("--no-sandbox");
////            chromeOptions.addArguments("--disable-gpu");
////            chromeOptions.addArguments("disable-notifications");
////            chromeOptions.addArguments("--disable-dev-shm-usage");
////            chromeOptions.setCapability(CapabilityType.UNHANDLED_PROMPT_BEHAVIOUR, UnexpectedAlertBehaviour.IGNORE);
////            chromeOptions.addArguments("--headless", "--disable-gpu", "--window-size=1920,1200",
////                    "--ignore-certificate-errors");
////            driver = new ChromeDriver(chromeOptions);
////        }
//
//        driver.manage().deleteAllCookies();
//        driver.manage().window().maximize();
//    }
    public static WebDriver getDriver() {
		return driver;
	}


}
