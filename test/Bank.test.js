const { expect } = require("chai");
// const { ethers } = require("hardhat");

let bankInstance;

describe("Bank", function() {
    beforeEach(async function () {
        let Bank = await ethers.getContractFactory("Bank")
        bankInstance = await Bank.deploy()
    })


    it("should deposit and return correct balance", async function() {
        const [owner] = await ethers.getSigners();
        
        expect(await bankInstance.getBalance()).to.equal('0')

        await bankInstance.deposit({ value: ethers.parseEther('1') })
        expect(await bankInstance.getBalance()).to.equal((1 * 10**18).toString())
    })

    it('checks balance from a different address', async function () {
        const [owner, address2, address3] = await ethers.getSigners();

        await bankInstance.deposit({ value: ethers.parseEther('1') })

        let bankInstance2 = bankInstance.connect(address2)
        expect(await bankInstance2.getBalance()).to.equal('0')
    })

    it('correctly reverts when the amount is over the balance', async function() {
        let address = '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5'
        await expect(bankInstance.withdraw(address, ethers.parseEther('0.5'))).to.be.revertedWith('Not enough balance.')
    })

    it('correctly withdraws Ether', async function() {
        const [owner, address2] = await ethers.getSigners()

        await bankInstance.deposit({ value: ethers.parseEther('0.5') })
        expect(await bankInstance.getBalance()).to.equal((0.5 * 10**18).toString())

        await expect(bankInstance.withdraw(address2, ethers.parseEther('0.1'))).to.emit(bankInstance, 'Withdrawal').withArgs((0.1 * 10**18).toString())
        expect(await bankInstance.getBalance()).to.equal((0.4 * 10**18).toString())

        // All test accounts have 10000 Ether on them by default, so this one will have 10000.01 afterwards
        expect(await ethers.provider.getBalance(address2)).to.equal('10000100000000000000000')
    })
})