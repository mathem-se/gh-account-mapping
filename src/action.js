import { aws4Interceptor } from "aws4-axios";

const core = require("@actions/core");
const axios = require("axios");

const region = core.getInput("aws-region");

const interceptor = aws4Interceptor({
  region,
  service: "execute-api",
});

axios.interceptors.request.use(interceptor);

const accountName = core.getInput("accountName");
const branch = core.getInput("branch");
const url = core.getInput("api-url");

let accName;
if (accountName) {
  accName = accountName;
} else {
  accName = "LEGACY";
}

const account = await getAccount(url, domain, branch);

core.setOutput("account", account);

async function getAccount(url, domain, branch) {
  const getAccount = await axios.get(`${url}/domain/${domain}/${branch}/`);
  const account = getAccount.data;
  return account;
}
