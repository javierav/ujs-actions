const express = require('express');
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const _ = require('lodash');
const globalVariables = _.pick(global, ['browser', 'expect', 'server', 'page']);

// puppeteer options
const opts = {
  headless: true,
  slowMo: 100,
  timeout: 10000,
  args: ['--window-size=1920,1040']
};

// expose variables
before (async function () {
  this.timeout(10000);

  const app = express();
  app.use(express.static('dist'));
  app.use(express.static('test'));

  global.expect = expect;
  global.server = await app.listen(8000);
  global.browser = await puppeteer.launch(opts);
  global.page = await browser.newPage();

  await global.page.goto('http://localhost:8000/test.html');
});

// close browser and reset global variables
after (async function () {
  await browser.close();
  await server.close();

  global.browser = globalVariables.browser;
  global.server = globalVariables.server;
  global.expect = globalVariables.expect;
  global.page = globalVariables.page;
});
