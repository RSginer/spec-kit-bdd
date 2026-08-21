/** @type {import('@cucumber/cucumber').IConfiguration} */
module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["features/**/*.ts"],
    paths: ["features/**/*.feature"],
    format: ["progress"],
  },
};
