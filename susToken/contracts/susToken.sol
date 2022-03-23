//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract susToken is ERC20Upgradeable  {
    uint public tokenPrice;

    function initialize() initializer public {
        __ERC20_init("susToken", "Sus");
        _mint(msg.sender, 1000);
        tokenPrice =  0.000007 ether; 
    }
}