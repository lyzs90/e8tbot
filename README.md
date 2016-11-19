# [Coconut](https://www.messenger.com/t/coconutbot)

[![Build Status](https://travis-ci.org/lyzs90/Coconut.svg?branch=master)](https://travis-ci.org/lyzs90/Coconut) [![Coverage Status](https://coveralls.io/repos/github/lyzs90/Coconut/badge.svg?branch=master)](https://coveralls.io/github/lyzs90/Coconut?branch=master)

Coconut is a friendly local Node.js Chatbot built using the Microsoft Bot Framework. Natural Language Processing is handled by [LUIS](https://www.luis.ai/).

If you're starving and would like recommendations for food in the vicinity, look no further. At the moment, Coconut will make recommendations from [HungryGoWhere](www.hungrygowhere.com) when you enter a location e.g. Raffles Place.  

Coconut is available on Facebook Messenger, [@coconutbot](https://www.messenger.com/t/coconutbot).

## Upcoming Features

- More locations
- Search by dish or type of cuisine
- Submit your current location
- Choice of food review websites
- Personalized recommendations


## Requirements

- [Bot Framework](https://dev.botframework.com/)
- [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/)
- [Heroku](https://www.heroku.com/)
- [Travis CI](https://travis-ci.org/)
- [Coveralls](https://coveralls.io/)
- [mLAb MongoDB](https://mlab.com/)
- [Facebook Developer](https://developers.facebook.com/)

## Quick Start  

##### Development

- Clone this repo
- Install with [npm](https://www.npmjs.com): `npm install`
- Set up Azure Cognitive Services, LUIS and mLab MongoDB
- Run setup and add environmental variables to gulpfile.js: `node setup.js`
- Run tests: `npm test`
- Transpile to ES5 and run nodemon dev server with [Gulp](http://gulpjs.com/): `gulp`
- Interact with your bot using the [Bot Framework Emulator](https://docs.botframework.com/en-us/tools/bot-framework-emulator/)
- Each time you make changes to the code, gulp will rebuild and restart your server. Make sure to `start new conversation` in the emulator.

##### Deployment

- Register bot with Bot Framework
- Set up Travis CI and Coveralls
- Create new Heroku app with mLab add-on
- Deploy to Heroku `git push heroku master`
- Configure Facebook App and Page for Messenger
- Set up Facebook Messenger webhook

## License

Code released under [the MIT license](https://github.com/lyzs90/Coconut/blob/master/LICENSE).
