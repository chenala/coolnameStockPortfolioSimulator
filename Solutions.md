How to run the application:
1. clone the project
2. make sure nodejs is installed. Run "npm install" in project directory
3. run "node app.js"
4. go to "http://localhost:3000/" and you will see the application running
5. (Optional) Run "ngrok http 3000" to expose the port to the public


As described in Assignment 1, our website is a virtual stock portfolio manager. Users can use it to gain experience managing a portfolio of stocks without risking real money.

The 4 views of our application are:

-Login Page

-Register Page

-User Page

-Admin Page

Below is a breakdown of the functionality and features of each view.


Login Page View:

The first page users see when arriving on the website is the login page. This page simply contains user forms for username & password. Currently, logging in with the username "admin" takes you to the administrator view, and logging in with any other registered username takes you to the user view. Note: Users will need to create an account using the "Create an account" button on the homepage before logging in.

Features Summary: Log in as either an admin user or a regular user.


Register Page View:

When a user clicks on the "Create an account" button in the login page, he/she will be redirected to a register page where he/she will be able to create an account for the application. While creating an account, the user can pick a username, password, and an initial starting cash position for their account.

Features Summary: Create a new account, specifying username, password, and starting cash position.


User Page View:

After logging in as a regular user, users will be redirected to a welcome page that displays information regarding their current portfolio. Furthermore, users will have the ability to search for, view information on, and buy stock using this page. Portfolio information displayed include current cash position, the market value of stocks held, total profit/loss (on the overall portfolio), and finally a breakdown of what stocks are currently held. The breakdown on each stock in user portfolios includes the ticker of the stock, the average price the stock was purchased at, the current stock price, and the profit/loss on the stock. All the information is retrieved from the backend that retrieves information from Mongodb server.

Below portfolio information is a section using which users can buy/sell stock. To buy/sell a stock, users must enter in the ticker of the stock they want to buy/sell, as well as how many shares they wish to buy/sell. If the user is buying a stock, the total price of shares purchased must be equal to or less than the cash currently held in the account. If the user is selling a stock, the amount of stock sold must be equal to or less than the amount of the stock held in the portfolio. When shares in any company are bought or sold, user portfolio information is updated accordingly. The database entry that stores information about the user will be updated by the backend.

If users wish to view recent performance of a stock, they can enter the ticker into the "Search Stock" box to view the 1 month, 6 month, and 1 year trading history of the stock. The search box dynamically makes suggestions for the ticker symbol as users type into the "Search Stock" box. 

Features Summary: View cash, market value of stock, and profit/loss information of portfolio. View breakdown of stocks held, as well as ticker, average purchase price, current price, and protfit/loss information for each stock. Purchase stock after specifying ticker and quantity. Search for stock by ticker. View stock 1-week, 6-month, and 1-year historical stock performance.


Admin Page View:

After logging in as an admin, users will be redirected to a welcome page that displays basic information regarding all users (exluding admin users) of the website. Information displayed for each user includes username, cash in portfolio, companies held in portfolio, quantity of shares in each company held, and the average price stock in each company was purchased at. In addition to the ability to view portfolio information, admin users can make use of "Give Cash to Existing User" buttons and "Delete User" button to modify user accounts. When these buttons are clicked, a new form is created for the admin to fill out the specifications of the request. For "Give Cash to Existing User", the required form asks for the username of the user to give the cash to, as well as how much to give. For "Delete User", the required form asks for the user name of the user to be deleted.

"Give Cash to Existing User" is a PUT request to backend and "Delete User" is a DELETE request to backend. The backend will handle these requests and update database accordingly.

Features Summary: View list of all users. For each user, view username, cash, value of stock, stocks held, and quantity of shares held.  Give cash to an existing user. Delete an existing user.


API Design:

In order to follow RESTful API design guidelines, we designed URL queries to follow the following format: /endpoint?params

As an example, here are what our login, delete user, add cash to user, and buy/sell stock URLs look like:

Login URL: /login?user=username
  
Delete User URL: /delete?user=username
  
Add Cash URL: /addCash?user=username&amount=number

Buy URL: /buy?user=username&symbol=tickerl&quantity=number

Sell URL: /sell?user=username&symbol=ticker&quantity=number

Display Users URL: /users
