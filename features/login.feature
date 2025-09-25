Feature: Login to SauceDemo

    Scenario: successfully login in SauceDemo
        Given I am on the SauceDemo login page
        When I login with valid credentials
        Then I should be redirected to the inventory page

    Scenario: unsuccessfully login in SauceDemo
        Given I am on the SauceDemo login page
        When I login with locked out credentials
        Then I should see a login error message