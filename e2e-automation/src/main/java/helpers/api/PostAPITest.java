package helpers.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import dataProviders.ConfigProperties;
import dataUsers.APIResponseStatusCode;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.testng.Assert;
import restassured.automation.utils.RestClient;
import restassured.automation.utils.Users;
import reusable.TestBase;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

public class PostAPITest extends TestBase {
	APIResponseStatusCode status;
	String serviceUrl;
	String apiUrl;
	String url;
	RestClient restClient;
	CloseableHttpResponse closebaleHttpResponse;

	// API append
	public void setUp() throws IOException {
		status = new APIResponseStatusCode();
		ConfigProperties configProperties = ConfigProperties.getConfigProperties();
		serviceUrl = configProperties.getString("URL");
		apiUrl = configProperties.getString("serviceURL");
		// https://reqres.in/api/users

		url = serviceUrl + apiUrl;
		System.out.println(url);
	}

	// post data to API
	public void postAPITest() throws IOException {
		restClient = new RestClient();
		HashMap<String, String> headerMap = new HashMap<String, String>();
		headerMap.put("Content-Type", "application/json");

		// jackson API:
		ObjectMapper mapper = new ObjectMapper();
		Users users = new Users("morpheus", "leader"); // expected users obejct

		mapper.writeValue(new File(System.getProperty("user.dir") + "/src/test/dataUsers/users.json"), users);
		// java object to json in String:
		String usersJsonString = mapper.writeValueAsString(users);
		System.out.println(usersJsonString);

		closebaleHttpResponse = restClient.post(url, usersJsonString, headerMap); // call the API

		// validate response from API:
		// 1. status code:
		int statusCode = closebaleHttpResponse.getStatusLine().getStatusCode();
		Assert.assertEquals(statusCode, status.RESPONSE_STATUS_CODE_201);

		// 2. JsonString:
		String responseString = EntityUtils.toString(closebaleHttpResponse.getEntity(), "UTF-8");

		JSONObject responseJson = new JSONObject(responseString);
		System.out.println("The response from API is:" + responseJson);

		// json to java object:
		Users usersResObj = mapper.readValue(responseString, Users.class); // actual users object
		System.out.println(usersResObj);

		Assert.assertTrue(users.getName().equals(usersResObj.getName()));

		Assert.assertTrue(users.getJob().equals(usersResObj.getJob()));
	}

	// validate status code for Post API
	public void getStatusCodePOSTAPI() {
		// closebaleHttpResponse = restClient.post(url, usersJsonString, headerMap);
		// //call the API

		// validate response from API:
		// 1. status code:
		int statusCode = closebaleHttpResponse.getStatusLine().getStatusCode();
		Assert.assertEquals(statusCode, status.RESPONSE_STATUS_CODE_201);
	}
}
