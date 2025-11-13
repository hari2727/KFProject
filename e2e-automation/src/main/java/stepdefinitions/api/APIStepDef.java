package stepdefinitions.api;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.apache.http.ParseException;
import helpers.api.GetAITest;
import helpers.api.PostAPITest;
import helpers.api.PutPatchDeleteAPITest;
import reusable.TestBase;

import java.io.IOException;

public class APIStepDef extends TestBase {
    private final GetAITest getMethod;
    private final PostAPITest postMethod;
    PutPatchDeleteAPITest getAPI;

    public APIStepDef() throws IOException {

        getMethod = new GetAITest();
        postMethod = new PostAPITest();
        getAPI = new PutPatchDeleteAPITest();
    }

    @Given("^User can append the given API$")
    public void user_can_append_the_given_API() throws ParseException, IOException {
        getMethod.setUp();
    }

    @When("^User validate the Status code of given API$")
    public void user_validate_the_Status_code_of_given_API() throws IOException {
        getMethod.getAPIStatusUrl();
    }

    @When("^User validate the PER Page value and Total number of data and validate Individual data given API$")
    public void user_validate_the_PER_Page_value_and_Total_number_of_data() throws IOException {
        getMethod.getAPITestWithoutHeaders();
    }

    @Then("^User validate that headers of the given API$")
    public void user_validate_that_headers_of_the_given_API() throws IOException {
        getMethod.getAPITestWithHeaders();
    }

    @Given("^User can append the given API test$")
    public void user_can_append_the_given_API_test() throws Throwable {
        postMethod.setUp();
    }

    @When("^User validate the Status code for POST method API$")
    public void user_validate_the_Status_code_for_POST_method_API() throws Throwable {
        postMethod.getStatusCodePOSTAPI();
    }

    @When("^User will get data from the Json String FOR post$")
    public void user_will_get_data_from_the_Json_String_FOR_post() throws IOException {
        postMethod.postAPITest();
    }

    @Given("^User can append the given API for put patch and Delete$")
    public void user_can_append_the_given_API_for_put_patch_and_Delete() throws ParseException, IOException {
        getAPI.setUp();
    }

    @When("^User validate that call PUT method and data get updated$")
    public void user_validate_that_call_PUT_method_and_data_get_updated() {
        getAPI.testPUT();
    }

    @Then("^User validate that call PATCH method and data get updated$")
    public void user_validate_that_call_PATCH_method_and_data_get_updated() {
        getAPI.testPatch();
    }

    @Then("^User validate that call DELETE method and data have updated$")
    public void user_validate_that_call_DELETE_method_and_data_have_updated() {
        getAPI.testDelete();
    }
}
