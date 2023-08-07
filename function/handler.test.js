'use strict';

const sinon = require('sinon');
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const handler = require('./handler');

describe('Handler Test', () => {
  let puppeteerStub;
  let pageStub;
  let browserStub;
  let contextStub;

  beforeEach(() => {
    pageStub = {
      goto: sinon.stub().resolves({
        ok: sinon.stub().returns(true),
      }),
      title: sinon.stub().resolves('Test Title'),
    };

    browserStub = {
      version: sinon.stub().resolves('Browser Version'),
      newPage: sinon.stub().resolves(pageStub),
      close: sinon.stub().resolves(),
    };

    puppeteerStub = sinon.stub(puppeteer, 'launch').resolves(browserStub);

    contextStub = {
      status: sinon.stub().returnsThis(),
      succeed: sinon.stub(),
    };
  });

  afterEach(() => {
    puppeteerStub.restore();
  });

  it('Should handle the request properly', async () => {
    const event = {
      body: {
        uri: 'https://test.uri',
      },
    };

    await handler(event, contextStub);

    expect(puppeteerStub.calledOnce).to.be.true;
    expect(pageStub.goto.calledWith('https://test.uri')).to.be.true;
    expect(pageStub.title.calledOnce).to.be.true;
    expect(contextStub.status.calledWith(200)).to.be.true;
    expect(contextStub.succeed.calledWith({ title: 'Test Title' })).to.be.true;
  });
});
