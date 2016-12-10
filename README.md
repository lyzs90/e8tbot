# [E-8T](https://www.messenger.com/t/e8tbot)

[![Build Status](https://travis-ci.org/lyzs90/e8tbot.svg?branch=master)](https://travis-ci.org/lyzs90/e8tbot) [![Coverage Status](https://coveralls.io/repos/github/lyzs90/e8tbot/badge.svg?branch=master)](https://coveralls.io/github/lyzs90/e8tbot?branch=master)

E-8T is a food recommendation Chatbot built using Node.js and the Microsoft Bot Framework. Natural Language Processing is handled by [LUIS](https://www.luis.ai/).

If you're starving and would like recommendations for food in the vicinity, look no further. At the moment, E-8T will make recommendations from [HungryGoWhere](www.hungrygowhere.com) when you submit your location.

E-8T is available on Facebook Messenger, [@e8tbot](https://www.messenger.com/t/e8tbot). Note that **Send Location** only works on mobile.

## Upcoming Features

- Support for more food searches
- Add more food review websites
- Personalized recommendations

## Quick Start  

#### Development

- Clone this repo
- Install with [npm](https://www.npmjs.com): `NODE_ENV=development npm install`
- Set up [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/), [LUIS](https://www.luis.ai/) and [mLAb MongoDB](https://mlab.com/)
- Run setup and add environmental variables to gulpfile.js: `node setup.js`
- Transpile to ES5 and run nodemon dev server with [Gulp](http://gulpjs.com/): `gulp`
- Interact with your bot
    - Using the [Bot Framework Emulator](https://docs.botframework.com/en-us/tools/bot-framework-emulator/) **OR**
    - Directly from WebChat/Facebook Messenger
        - Create a secure tunnel to your nodemon server using ngrok: `ngrok http 3978`
        - Change your Bot Framework messaging endpoint to `https://<yourapp>.ngrok.io/api/messages`
- Each time you make changes to the code, gulp will rebuild and restart your server. Make sure to `start new conversation` in the emulator.
- Before shipping, run your tests: `gulp build` and `npm test`
- And generate coverage stats: `npm run cover`

#### Deployment

- Register bot with [Bot Framework](https://dev.botframework.com/)
- Set up [Travis CI](https://travis-ci.org/) and [Coveralls](https://coveralls.io/)
- Create new [Heroku](https://www.heroku.com/) app with mLab add-on
- Deploy to Heroku `git push heroku master`
- Set Bot Framework messaging endpoint to `https://<yourapp>.herokuapp.com/api/messages`
- Access [Facebook Developer](https://developers.facebook.com/) and create Facebook App and Page for Messenger
- Set up Facebook Messenger webhook
- Get your Facebook App approved for Send/Receive API (pages_messaging)
- Add your Facebook Page Access Token to setup-fb.js then run `node setup-fb.js`

## License

Code released under [the MIT license](https://github.com/lyzs90/Coconut/blob/master/LICENSE).
