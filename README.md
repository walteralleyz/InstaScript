# INSTASCRIPT
> Automated management tool for instagram, BETA.

## Installing
1. You can install this writing "npm install" at your terminal (verify NODE installed first).
.. There's an '.env' file where all variables is in. I know its bad practice, but I'm working on it!
2. You can find your browser driver in selenium webpage project: https://seleniumhq.github.io/selenium/docs/api/javascript/index.html

## Usage
1. To start the script you need to run 'npm run dev' first.
Then your localserver with 2500 port will start.
Send Post request to localhost:2500/session with username, password and target profiles inside an array inside body request Json format.

2. To send requests to the server node you can download either the Postman application, or the ARC extension for Google Chrome. To start your request, fill in the following form, sending json:
⋅⋅*
To http://localhost:2500/followfromusers = { username: your_instagram_username, password: your_instagram_password, accounts: [array_of_accounts] };
To http://localhost:2500/followfromhashes = { username: your_instagram_username, password: your_instagram_password, accounts: [array_of_tags(without hashtag)] };

### Enjoy
