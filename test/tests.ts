import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("MyNFT", function () {

    async function deployMyNFTFixture() {
        const [owner, addr1, addr2] = await hre.ethers.getSigners();

        const MyNFT = await hre.ethers.getContractFactory("MyNFT");

        const myNFT = await MyNFT.deploy("MyNFT", "MNFT", "data:image/svg+xml;base64,PHN2ZyB4b");

        return { myNFT, owner, addr1, addr2 };
    }

    describe("Deployment", function () {
        it("Should deploy with correct name and symbol", async function () {
            const { myNFT } = await loadFixture(deployMyNFTFixture);
            expect(await myNFT.name()).to.equal("MyNFT");
            expect(await myNFT.symbol()).to.equal("MNFT");
        });
    });

    describe("Minting", function () {
        it("Should mint a new NFT and assign it to the correct owner", async function () {
            const { myNFT, addr1 } = await loadFixture(deployMyNFTFixture);
            await myNFT.mint(addr1.address, "data:image/svg+xml;base64,PHN2ZyB4b");
            expect(await myNFT.ownerOf(1)).to.equal(addr1.address);
            expect(await myNFT.balanceOf(addr1.address)).to.equal(1);
        });

        it("Should store on-chain image data", async function () {
            const { myNFT, addr1 } = await loadFixture(deployMyNFTFixture);
            await myNFT.mint(addr1.address, "data:image/svg+xml;base64,PHN2ZyB4b");
            expect(await myNFT.tokenImage(1)).to.equal("data:image/svg+xml;base64,PHN2ZyB4b");
        });
    });

    describe("Transfers", function () {
        it("Should allow transferring an NFT", async function () {
            const { myNFT, addr1, addr2 } = await loadFixture(deployMyNFTFixture);
            await myNFT.mint(addr1.address, "data:image/svg+xml;base64,PHN2ZyB4b");
            await myNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
            expect(await myNFT.ownerOf(1)).to.equal(addr2.address);
        });

        it("Should fail when transferring a token without ownership", async function () {
            const { myNFT, addr1, addr2 } = await loadFixture(deployMyNFTFixture);
            await myNFT.mint(addr1.address, "data:image/svg+xml;base64,PHN2ZyB4b");
            expect(
                await myNFT.connect(addr2).transferFrom(addr1.address, addr2.address, 1)
            ).to.be.revertedWith("Not owner");
        });
    });
});
