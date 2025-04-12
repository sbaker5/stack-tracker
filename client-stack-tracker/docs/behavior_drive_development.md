

1. Authentication
•	Feature: User Authentication
•	Goal: Ensure users can securely log in and their roles are correctly assigned.
•	Scenario 1: Successful Login
o	Given the user is on the login page
o	When the user enters a valid username and password
o	And clicks the "Login" button
o	Then the user should be redirected to the1 main application page
o	And the user should be authenticated as a specific role (e.g., "Editor")
•	Scenario 2: Invalid Login - Incorrect Password
o	Given the user is on the login page
o	When the user enters a valid username and an incorrect password
o	And clicks the "Login" button
o	Then the user should see an error message indicating invalid credentials
o	And the user should remain on the login page
•	Scenario 3: Invalid Login - Incorrect Username
o	Given the user is on the login page
o	When the user enters an invalid username and a valid password
o	And clicks the "Login" button
o	Then the user should see an error message indicating invalid credentials
o	And the user should remain on the login page
•	Scenario 4: Admin User Login
o	Given the user is on the login page
o	When the user enters the username and password for an "Admin" user
o	And clicks the "Login" button
o	Then the user should be redirected to the main application page
o	And the user should have access to admin-specific features (e.g., user management)
•	Scenario 5: Viewer User Login
o	Given the user is on the login page
o	When the user enters the username and password for a "Viewer" user
o	And clicks the "Login" button
o	Then the user should be redirected to the main application page
o	And the user should have read-only access to client data
2. Client Stack Management
•	Feature: Creating a New Client Stack
•	Goal: Verify that users can create new client stack records with the correct data structure.
•	Scenario 1: Successful Client Stack Creation
o	Given the user is logged in as an "Editor"
o	And the user is on the client list page
o	When the user clicks the "Create New Client" button
o	And the user enters all required client details (name, etc.)
o	And the user enters stack details using the template (tiers, etc.)
o	And the user clicks the "Save" button
o	Then a new client record should be created in the database
o	And the user should be redirected to the new client's detail page
o	And the new client's details should be displayed correctly
•	Scenario 2: Client Stack Creation with Missing Required Fields
o	Given the user is logged in as an "Editor"
o	And the user is on the client list page
o	When the user clicks the "Create New Client" button
o	And the user enters some client details but leaves out a required field (e.g., client name)
o	And the user clicks the "Save" button
o	Then an error message should be displayed indicating the missing field
o	And the client record should not be created
•	Scenario 3: Client Stack Creation with Invalid Data
o	Given the user is logged in as an "Editor"
o	And the user is on the client list page
o	When the user clicks the "Create New Client" button
o	And the user enters data in an incorrect format (e.g., invalid date)
o	And the user clicks the "Save" button
o	Then an error message should be displayed indicating the invalid data
o	And the client record should not be created
•	Feature: Editing an Existing Client Stack
•	Goal: Ensure users can modify client stack data and that changes are saved correctly.
•	Scenario 1: Successful Client Stack Edit
o	Given the user is logged in as an "Editor"
o	And the user is on a client's detail page
o	When the user modifies client details (e.g., adds a tag)
o	And the user clicks the "Save" button
o	Then the client record should be updated in the database
o	And the updated details should be displayed on the client's detail page
•	Scenario 2: Editing Client Stack with Invalid Data
o	Given the user is logged in as an "Editor"
o	And the user is on a client's detail page
o	When the user modifies client details with invalid data
o	And the user clicks the "Save" button
o	Then an error message should be displayed
o	And the client record should not be updated with the invalid data
•	Scenario 3: Editing Client Stack with No Changes
o	Given the user is logged in as an "Editor"
o	And the user is on a client's detail page
o	When the user does not modify any client details
o	And the user clicks the "Save" button
o	Then the client record should not be updated
o	And a message should be displayed indicating no changes were made (optional)
•	Feature: Deleting a Client Stack
•	Goal: Verify that users with the correct permissions can delete client stack records.
•	Scenario 1: Successful Client Stack Deletion
o	Given the user is logged in as an "Admin"
o	And the user is on a client's detail page
o	When the user clicks the "Delete Client" button
o	And confirms the deletion
o	Then the client record should be deleted from the database
o	And the user should be redirected to the client list page
o	And the deleted client should not be visible in the list
•	Scenario 2: Client Stack Deletion Attempt by Non-Admin
o	Given the user is logged in as an "Editor"
o	And the user is on a client's detail page
o	When the user attempts to delete the client stack
o	Then the delete option should not be available or should be disabled
o	Or the user should receive an authorization error message
3. Data Visualization
•	Feature: Displaying Client Stack Data
•	Goal: Ensure client stack data is displayed in both tiered and mind map formats.
•	Scenario 1: Displaying Tiered View
o	Given the user is logged in
o	And the user is on a client's detail page
o	When the user selects the "Tiered View"
o	Then the client's stack data should be displayed in a structured, tier-based format 
•	Scenario 2: Displaying Mind Map View
o	Given the user is logged in
o	And the user is on a client's detail page
o	When the user selects the "Mind Map View"
o	Then the client's stack data should be displayed in an unstructured, mind map-style graphical display 
•	Scenario 3: Displaying Client Stack with Nested Tiers
o	Given the user is logged in
o	And the user is on a client's detail page
o	When the client's stack data includes nested tiers
o	Then the tiered view should display the nested tiers correctly
o	And the mind map view should represent the nested tiers in its graphical display
4. Search and Filtering
•	Feature: Searching for Clients
•	Goal: Verify that users can search for clients based on various criteria.
•	Scenario 1: Successful Client Search
o	Given the user is logged in
o	And the user is on the client list page
o	When the user enters a client's name in the search bar
o	And clicks the "Search" button
o	Then the client list should be filtered to display only matching clients 
•	Scenario 2: Client Search with No Results
o	Given the user is logged in
o	And the user is on the client list page
o	When the user enters a non-existent client name in the search bar
o	And clicks the "Search" button
o	Then the client list should display a message indicating no matching clients were found
•	Scenario 3: Client Search by Tag
o	Given the user is logged in
o	And the user is on the client list page
o	When the user searches using a client tag
o	Then the client list should be filtered to show clients with that tag
•	Feature: Filtering Clients
•	Goal: Verify that users can filter clients based on criteria
•	Scenario 1: Filter Clients by Flags
o	Given the user is logged in
o	And the user is on the client list page
o	When the user filters clients by a specific flag (e.g., "Renewal Due")
o	Then the client list should only display clients with that flag 
5. Data Export
•	Feature: Exporting Client Stack Data
•	Goal: Ensure client stack data can be exported in different formats.
•	Scenario 1: Export to PDF - Mind Map
o	Given the user is logged in
o	And the user is on a client's detail page
o	When the user selects "Export to PDF" and chooses the "Mind Map" option
o	Then a PDF file should be generated
o	And the PDF file should contain the client's stack data in a mind map format 
•	Scenario 2: Export to PDF - Tiered List
o	Given the user is logged in
o	And the user is on a client's detail page
o	When the user selects "Export to PDF" and chooses the "Tiered List" option
o	Then a PDF file should be generated
o	And the PDF file should contain the client's stack data in a tiered list format 
•	Scenario 3: Export to CSV
o	Given the user is logged in
o	And the user is on a client's detail page
o	When the user selects "Export to CSV"
o	Then a CSV file should be generated
o	And the CSV file should contain the client's stack data in a flat data table format 
•	Scenario 4: Export with Hidden Fields
o	Given the user has hidden certain fields in the UI
o	When the user exports data
o	Then the exported file should not include the hidden fields 
•	Scenario 5: Export with Tags and Flags Toggled Off
o	Given the user is on the export settings
o	When the user toggles off the "tags" and "flags" options
o	And the user exports the data
o	Then the exported file should not include tags and flags 
6. Data Input
•	Feature: Manual Data Entry
•	Goal: Verify that users can manually input client stack data.
•	Scenario 1: Successful Data Entry
o	Given the user is logged in as an "Editor"
o	And the user is on the client stack input form
o	When the user enters valid data into all the fields
o	And clicks "Save"
o	Then the data is saved correctly.
•	Scenario 2: Data Entry with Freeform Text
o	Given the user is logged in as an "Editor"
o	And the user is on the client stack input form
o	When the user enters freeform text into fields like "NextGen Firewall" (e.g., "Palo Alto") 
o	And clicks "Save"
o	Then the data is saved correctly.
•	Scenario 3: Inline Editing
o	Given the user is logged in as an "Editor"
o	And the user is viewing a client stack
o	When the user edits data directly within the display 
o	And saves the changes
o	Then the data is updated correctly.
7. User Roles and Permissions
•	Feature: Access Control
•	Goal: Verify that user roles and permissions are enforced correctly.
•	Scenario 1: Admin User Access
o	Given the user is logged in as an "Admin"
o	Then the user should have access to all features, including user management, client data editing, and export functionality 
•	Scenario 2: Editor User Access
o	Given the user is logged in as an "Editor"
o	Then the user should be able to create and update client data records 
o	And the user should not have access to admin-specific features
•	Scenario 3: Viewer User Access
o	Given the user is logged in as a "Viewer"
o	Then the user should have read-only access to client data 
o	And the user should not be able to create, update, or delete client records
8. Data Management
•	Feature: Data Backup
•	Goal: Verify that the database can be backed up.
•	Scenario 1: Database Backup
o	Given the user is logged in as an "Admin"
o	When the user initiates a database backup
o	Then the database should be exported as a zipped JSON or CSV file 
9. Change Log
•	Feature: Change Log Tracking
•	Goal: Verify that changes to client stacks are logged.
•	Scenario 1: Change Log Entry on Edit
o	Given the user is logged in as an "Editor"
o	And the user edits a client stack
o	When the user saves the changes
o	Then a new entry should be added to the change log
o	And the change log entry should include user identity, timestamp, and action description 
10. UI/UX
•	Feature: Responsive Design
•	Goal: Verify the UI is responsive.
•	**Scenario 1: Mobile Responsiveness
o	Given the user is on a mobile device (e.g., iPhone 15 Pro Max) 
o	When the user accesses the application
o	Then the UI should adapt to the device's screen size and orientation
o	And the UI should be touch-first.
•	Feature: Dark Mode
•	Goal: Verify dark mode functionality.
•	**Scenario 1: Persistent Dark Mode
o	Given the user toggles dark mode on
o	When the user navigates through the application
o	Then dark mode should persist across all pages and sessions 



