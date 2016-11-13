# [Coconut](https://lyzs90.github.io/projects/)

[![Build Status](https://travis-ci.org/lyzs90/Coconut.svg?branch=master)](https://travis-ci.org/lyzs90/Coconut) [![Coverage Status](https://coveralls.io/repos/github/lyzs90/Coconut/badge.svg?branch=master)](https://coveralls.io/github/lyzs90/Coconut?branch=master)

Coconut is a friendly Node.js Chatbot built using the Microsoft Bot Framework. Natural Language Processing is handled by [LUIS](https://www.luis.ai/). If you're starving and would like nearby food recommendations, look no further. Coconut is available on Facebook Messenger, [@coconutbot](https://www.messenger.com/t/coconutbot).

## Requirements

- [Bot Framework](https://dev.botframework.com/)
- [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/)
- [Heroku](https://www.heroku.com/)
- [MongoDB](https://mlab.com/)

## Quick Start

- Clone this repo
- Install with [npm](https://www.npmjs.com): `npm install`
- Run setup and add environmental variables to gulpfile.js: `node setup.js`
- Transpile to ES5 and run nodemon dev server: `gulp dev`
- Run tests: `npm test`
- Interact with your bot using the [Bot Framework Emulator](https://download.botframework.com/bf-v3/tools/emulator/publish.htm)

## License

Code released under [the MIT license](https://github.com/lyzs90/Coconut/blob/master/LICENSE).
