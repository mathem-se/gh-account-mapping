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
const team = core.getInput("team");

let accName;

console.log(team)
if (team != null) {
  const getDomain = await axios.get(`${url}/team/${team}`);
  accName = getDomain.data;
  core.setOutput("domain", accName);
} else {
  accName = accountName ? accountName : "LEGACY";
}

const account = await getAccount(url, accName, branch);
core.setOutput("account", account);

async function getAccount(url, accName, branch) {
  const getAccount = await axios.get(`${url}/domain/${accName}/${branch}/`);
  const account = getAccount.data;
  return account;
}
