@API_Get_Post
Feature: API to call Get and Post methods

  Scenario: Validate that given API to call GET method
    Given User can append the given API
    When User validate the Status code of given API
    And User validate the PER Page value and Total number of data and validate Individual data given API
    And User validate that headers of the given API

  Scenario: Validate that given API to call POST method
    Given User can append the given API test
    When User will get data from the Json String FOR post
    Then User validate the Status code for POST method API

  Scenario: Validate that given API to PUT PATCH and DELETE
    Given User can append the given API for put patch and Delete
    When User validate that call PUT method and data get updated
    Then User validate that call PATCH method and data get updated
    And User validate that call DELETE method and data have updated
