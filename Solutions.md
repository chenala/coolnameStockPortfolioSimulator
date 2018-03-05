As described in Assignment 1, our website is a virtual stock portfolio manager. Users can use it to gain experience managing a portfolio of stocks without risking real money.

The 3 views of our application are:
-Login Page
-User Page
-Admin Page
Below is a breakdown of the functionality and features of each view.


Login View:

The first page users see when arriving on the website is the login page. This page simply contains user forms for username & password. Since there is currently no backend to store login information, users can currently log in using any combination of username and password. Currently, logging in with the username "admin" takes you to the administrator view, and logging in with any other username takes you to the user view.

Features Summary: Log in as either an admin user or a regular user.


User View:

After logging in as a regular user, users will be redirected to a welcome page that displays information regarding their current portfolio. Furthermore, users will have the ability to search for, view information on, and buy stock using this page. Portfolio information displayed include current cash position (all users start out with $1000 in cash), the market value of stocks held, total profit/loss (on the overall portfolio), and finally a breakdown of what stocks are currently held. The breakdown on each stock in user portfolios includes the ticker of the stock, the average price the stock was purchased at, the current stock price, and the profit/loss on the stock. Since there's no backend to our website yet, we've coded some user information into the front-end in order to demonstrate what information will be displayed (currently, users are set to having 1000 dollars in cash, as well as 1 share in each of Apple and Facebook. It is assumed that these shares were purchased at $100 each). 

Below portfolio information is a section using which users can buy stock. To buy a stock, users must enter in the ticker of the stock they want to buy, as well as how many share they wish to purchase. The total price of shares purchases must be equal to or less than the cash currently held in the account. When shares in any company are bought, user portfolio information is updated accordingly.

If users wish to view recent performance of the stock, they can enter the ticker into the "Search Stock" box to view the 1 month, 6 month, and 1 year trading history of the stock. The search box dynamically makes suggestions for the ticker symbol as users type into the "Search Stock" box. After purchasing stock, the user's portfolio information will be updated accordingly.

Features Summary: View cash, market value of stock, and profit/loss information of portfolio. View breakdown of stocks held, as well as ticker, average purchase price, current price, and protfit/loss information for each stock. Purchase stock after specifying ticker and quantity. Search for stock by ticker. View stock 1-week, 6-month, and 1-year historical stock performance.


Admin View:

After logging in as an admin user, users will be redirected to a welcome page that displays basic information regarding all users(exluding admin users) of the website. Information displayed for each user include username, cash in portfolio, value of stock in portfolio, companies held in portfolio, and quantity of shares in each company held. In addition to the ability to view portfolio information, admin users can make use of the "Add New User" and "Give Cash to Existing User" buttons to modify/add user accounts. When either of these buttons are clicked, a new form is created for the admin to fill out the specifications of the request. For "Add New User", the required form asks for username, password, and initial cash in portfolio. For "Give Cash to Existing User", the required form asks for the username of the user to give the cash to, as well as how much to give. 

To demonstrate how we envision this page working, we've coded 3 users with varying portfolio statistics. The admin can interact with these portfolios by giving them cash, or create entirely new users.

Features Summary: View list of all users. For each user, view username, cash, value of stock, stocks held, and quantity of shares held. Create new users. Give cash to an existing user.

