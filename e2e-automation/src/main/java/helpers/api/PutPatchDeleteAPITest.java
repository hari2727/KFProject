package helpers.api;

import dataProviders.ConfigProperties;
import dataUsers.APIResponseStatusCode;
import io.restassured.http.ContentType;
import org.apache.http.ParseException;
import org.json.JSONObject;
import reusable.TestBase;

import java.io.IOException;

import static io.restassured.RestAssured.baseURI;
import static io.restassured.RestAssured.given;

public class PutPatchDeleteAPITest extends TestBase {
	String URL;
	String serviceUrl;
	String apiUrl;
	APIResponseStatusCode status;

	// API append
	public void setUp() throws ParseException, IOException {

		ConfigProperties configProperties = ConfigProperties.getConfigProperties();
		serviceUrl = configProperties.getString("URL");
		apiUrl = configProperties.getString("serviceURL");
		status = new APIResponseStatusCode();
		// https://reqres.in/api/users

		URL = serviceUrl + apiUrl;
		System.out.println(URL);
	}

	// put method(update)
	public void testPUT() {
		baseURI = URL;
		System.out.println("=============PUT Method is Passed==========");

		// Post Data with using JSON Object
		JSONObject request = new JSONObject();
		request.put("name", "Praveen");
		request.put("job", "AutomationTester");
		System.out.println("Post Data with using JSON Object====>" + request);

		given().header("Content-Type", "application/json").contentType(ContentType.JSON).accept(ContentType.JSON)
				.body(request.toString()).when().put("/2").then().

				statusCode(status.RESPONSE_STATUS_CODE_200).log().all();
	}

	// test patch
	public void testPatch() {
		baseURI = URL;
		System.out.println("=============Patch Method is Passed==========");

		// Post Data with using JSON Object
		JSONObject request = new JSONObject();
		request.put("name", "Praveen");
		request.put("job", "AutomationTester");
		System.out.println("Post Data with using JSON Object====>" + request);

		given().header("Content-Type", "application/json").contentType(ContentType.JSON).accept(ContentType.JSON)
				.body(request.toString()).when().patch("/2").then().statusCode(status.RESPONSE_STATUS_CODE_200).log()
				.all();
	}

	// test delete API
	public void testDelete() {
		baseURI = URL;
		System.out.println("=============Delete Method is Passed==========");
		given().when().delete("/2").then().statusCode(status.RESPONSE_STATUS_CODE_204).log().all();
	}
}
