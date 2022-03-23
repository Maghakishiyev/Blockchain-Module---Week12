const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("SusToken", async function () {
  it("Should mint 1000 tokens to the owner and set token price", async function () {
    const [owner] = await ethers.getSigners();
    const susToken = await ethers.getContractFactory("susToken");
    const sus = await upgrades.deployProxy(susToken);
    await sus.deployed();

    expect(await sus.totalSupply()).to.equal(1000);
    expect(await sus.balanceOf(owner.getAddress())).to.equal(1000);
    expect(await sus.tokenPrice()).to.equal(
      ethers.utils.parseEther("0.000007")
    );
  });
});
