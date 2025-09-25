Feature: Add multiple items to the cart

  Scenario: Add 3 random items to the shopping cart
    Given I am logged in as a standard user
    When I select 3 random items from the inventory
    Then I should see 3 items in the shopping cart