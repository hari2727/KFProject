 @KFOneLogin
Feature: Verify KF-One Login Page and Navigate

  @User_Login
     Scenario: Login into the Application with User Credentials
     Given User is launches the KFOne application
     When User provides valid username on the login page
     Then User clicks on the Sign In button
     When User provides valid password on the login page
     Then Again User clicks on the Sign In button
     Then User should be navigated to the KFOne landing page
    Then  User is on the KFOne Clients page
    When User searches for client name based on PAMS ID
    Then User should see the list of Products accessible to the client
    When User selects the client with access to Profile Manager application
    Then User should be navigated to the KFOne Home page
    When User opens the Profile Manager application under Your Products section
    Then User should be seamlessly redirected to the Profile Manager dashboard in KF Hub
    Then User role should be stored in session storage

