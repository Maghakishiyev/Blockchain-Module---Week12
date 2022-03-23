const previousAddress = "0x28a83dD92F81a50091d1f3cA9c9Ce72E552Fd046";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("susTokenUpgraded");
  const token = await upgrades.upgradeProxy(previousAddress, Token);

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
