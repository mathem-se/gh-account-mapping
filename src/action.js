import { aws4Interceptor } from 'aws4-axios';

const core = require('@actions/core');
const axios = require('axios');

const region = core.getInput('aws-region');

const interceptor = aws4Interceptor({
  region,
  service: 'execute-api'
});

axios.interceptors.request.use(interceptor);

async function makeGetRequest(type, item, url) {
  const getDomain = await axios.get(`${url}/${type}/${item}`);
  const domain = getDomain.data;
  core.setOutput('domain', domain);

  const getAccount = await axios.get(`${url}/domain/${domain}`);
  const account = getAccount.data;
  core.setOutput('account', account);
}

const item = core.getInput('team');
const url = core.getInput('api-url');

makeGetRequest('team', item, url);
