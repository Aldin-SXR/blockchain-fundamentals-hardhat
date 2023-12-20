// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Bank {

    mapping (address => uint) balances;
    event Withdrawal(uint _amount);

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function getBalance() external view returns (uint) {
        return balances[msg.sender];
    }

    function withdraw(address _address, uint _amount) external {
        require(_amount <= balances[msg.sender], "Not enough balance.");

        balances[msg.sender] -= _amount;
        (bool sent, ) = _address.call{value: _amount}("");
        emit Withdrawal(_amount);
        require(sent, "Failed to send Ether.");
    }
}