module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("GrantPayment", {
    from: deployer,
    log: true,
    args: ["0x4582480Eae797Fa27C89B6eac5bf70a386E39AD3"],
  });
};

// deployed address: 0xd9145CCE52D386f254917e481eB44e9943F39138

/**
 * Use tags to run specific deploy scripts
 * For example:- npx hardhat deploy --tags Storage will run only this script
 */
module.exports.tags = ["GrantPayment"];
