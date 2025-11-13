package helpers.api;

import dataProviders.ConfigProperties;
import dataUsers.APIResponseStatusCode;
import org.apache.http.ParseException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import restassured.automation.utils.RestClient;
import restassured.automation.utils.TestUtil;
import reusable.TestBase;

import java.io.IOException;
import java.util.HashMap;

public class GetAITest extends TestBase {

	String URL;
	String Authorizationkey;
	String serviceUrl;
	String apiUrl;
	String url;
	APIResponseStatusCode status;
	RestClient restClient;
	CloseableHttpResponse closebaleHttpResponse;

	public GetAITest() throws IOException {
		PageFactory.initElements(driver, this);
	}

	// API append
	public void setUp() throws ParseException, IOException {
		status = new APIResponseStatusCode();
		ConfigProperties configProperties = ConfigProperties.getConfigProperties();
		serviceUrl = configProperties.getString("URL");
		apiUrl = configProperties.getString("serviceURL");
		// https://reqres.in/api/users

		url = serviceUrl + apiUrl;
	}

	// validate status code and API data
	public void getAPIStatusUrl() throws IOException {
		restClient = new RestClient();
		closebaleHttpResponse = restClient.get(url);

		// a. Status Code:
		int statusCode = closebaleHttpResponse.getStatusLine().getStatusCode();
		System.out.println("Status Code--->" + statusCode);

		Assert.assertEquals(statusCode, status.RESPONSE_STATUS_CODE_200, "Status code is not 200");
	}

	// validate data from given API
	public void getAPITestWithoutHeaders() throws IOException {

		String responseString = EntityUtils.toString(closebaleHttpResponse.getEntity(), "UTF-8");
		JSONObject responseJson = new JSONObject(responseString);
		System.out.println("Response JSON from API---> " + responseJson);

		// single value assertion:
		// per_page:
		String perPageValue = TestUtil.getValueByJPath(responseJson, "/per_page");
		System.out.println("value of per page is-->" + perPageValue);
		Assert.assertEquals(Integer.parseInt(perPageValue), 6);

		// total:
		String totalValue = TestUtil.getValueByJPath(responseJson, "/total");
		System.out.println("value of total is-->" + totalValue);
		Assert.assertEquals(Integer.parseInt(totalValue), 12);
		String lastName = TestUtil.getValueByJPath(responseJson, "/data[0]/last_name");
		String id = TestUtil.getValueByJPath(responseJson, "/data[0]/id");
		String avatar = TestUtil.getValueByJPath(responseJson, "/data[0]/avatar");
		String firstName = TestUtil.getValueByJPath(responseJson, "/data[0]/first_name");

		System.out.println(lastName);
		System.out.println(id);
		System.out.println(avatar);
		System.out.println(firstName);
	}

	// validate headers of given API
	public void getAPITestWithHeaders() throws IOException {
		restClient = new RestClient();

		HashMap<String, String> headerMap = new HashMap<String, String>();
		headerMap.put("Host", "<calculated when request is sent>");

		System.out.println("WithHeader method is passed");
	}
}
