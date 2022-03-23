//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract susTokenUpgraded is ERC20Upgradeable  {
    uint public tokenPrice;

    function initialize() initializer public {
        __ERC20_init("susToken", "Sus");
        _mint(msg.sender, 1000);
        tokenPrice =  0.000007 ether; 
    }

    function owhBalance(address who) public view returns(uint) {
        address owhAddress = 0xA4465b289842FB8FA856b28236825220202FDe68;
        IERC20Upgradeable owh = IERC20Upgradeable(owhAddress);
        return owh.balanceOf(who);
    }

    event BuyToken(address indexed sender, uint256 tokenAmount, uint256 price);

    receive() external payable {
        uint wantedTokens = msg.value / tokenPrice;
        require(wantedTokens > 0);
        _mint(msg.sender, wantedTokens);
        emit BuyToken(msg.sender, wantedTokens, tokenPrice);
    }
}