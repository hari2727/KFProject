package stepdefinitions.functional;

import java.io.IOException;

import javax.swing.UIDefaults;

import org.testng.Assert;

import com.kfarchitect.manager.PageObjectManager;

import helpers.pageobjects.*;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import resuable.UIHelpers;

public class KFOneLoginSD {

	  PageObjectManager pom= new PageObjectManager();
public KFOneLoginSD() {
	super();
}

	@Given("User is launches the KFOne application")
	public void user_is_launches_the_kf_one_application() {
		 System.out.println("url launched successfully");
	}

	@When("User provides valid username on the login page")
	public void user_provides_valid_username_on_the_login_page() throws Exception {
	pom.getLoginPage().enterEmailId();
	}

	@Then("User clicks on the Sign In button")
	public void user_clicks_on_the_sign_in_button() throws  Exception {
	    pom.getLoginPage().clickOnSignInBtn();
	}

	@When("User provides valid password on the login page")
	public void user_provides_valid_password_on_the_login_page() throws IOException, Exception {
	   pom.getLoginPage().enterPassword();
	}
	


	@Then("Again User clicks on the Sign In button")
	public void again_user_clicks_on_the_sign_in_button() throws IOException, Exception {
		 pom.getLoginPage().clickOnSignInBtn();
	}


	@Then("User should be navigated to the KFOne landing page")
	public void user_should_be_navigated_to_the_kf_one_landing_page() throws Exception {
	    pom.getLandingPage().verifyLandingPage();
	    
	    
	}

	@Given("User is on the KFOne Clients page")
	public void user_is_on_the_kf_one_clients_page() throws Exception {
		pom.getLandingPage().verifySearchField();
	}

	@When("User searches for client name based on PAMS ID")
	public void user_searches_for_client_name_based_on_pams_id() throws Exception {
		pom.getLandingPage().searchAClient();

	}

	@Then("User should see the list of Products accessible to the client")
	public void user_should_see_the_list_of_products_accessible_to_the_client() throws Exception {
		pom.getHomepage().verifyHomePage();
	}

	@When("User selects the client with access to Profile Manager application")
	public void user_selects_the_client_with_access_to_profile_manager_application() throws Exception {
	    pom.getHomepage().clickProfileManagerSection();
	}

	@Then("User should be navigated to the KFOne Home page")
	public void user_should_be_navigated_to_the_kf_one_home_page() {
	   
	}

	@When("User opens the Profile Manager application under Your Products section")
	public void user_opens_the_profile_manager_application_under_your_products_section() {
	    
	}

	@Then("User should be seamlessly redirected to the Profile Manager dashboard in KF Hub")
	public void user_should_be_seamlessly_redirected_to_the_profile_manager_dashboard_in_kf_hub() throws  Exception {
      pom.getProfileManagerPage().verifyProfileManager();
	}

	@Then("User role should be stored in session storage")
	public void user_role_should_be_stored_in_session_storage() {
	    
	}

	@When("User clicks on the Profile button")
	public void user_clicks_on_the_profile_button() {
	    
	}

	@Then("User clicks on the Preferred Language dropdown")
	public void user_clicks_on_the_preferred_language_dropdown() {
	   
	}

	@Then("User selects English from the language dropdown")
	public void user_selects_english_from_the_language_dropdown() {
	   
	}

	@Then("User clicks on the Apply button")
	public void user_clicks_on_the_apply_button() {
	    
	}

	@Then("The application content should be translated to English")
	public void the_application_content_should_be_translated_to_english() {

	}

	@Then("User should be able to view the toggle message Your language has been updated successfully")
	public void user_should_be_able_to_view_the_toggle_message_your_language_has_been_updated_successfully() {
	 
	}

	@When("User clicks on the Back button")
	public void user_clicks_on_the_back_button() {
	   
	}

	@Then("User should be navigated back to the landing page successfully")
	public void user_should_be_navigated_back_to_the_landing_page_successfully() {
	   
	}

	@When("User clicks on the Logout option")
	public void user_clicks_on_the_logout_option() {
	    
	}

	@Then("User should be successfully logged out of the application")
	public void user_should_be_successfully_logged_out_of_the_application() {
	
	}

}

