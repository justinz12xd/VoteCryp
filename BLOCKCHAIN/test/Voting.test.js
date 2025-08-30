const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting;
  let voting;
  let admin;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    [admin, user1, user2, user3] = await ethers.getSigners();
    
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.deployed();
  });

  describe("Deployment", function () {
    it("Should set the deployer as admin", async function () {
      expect(await voting.admin()).to.equal(admin.address);
    });

    it("Should initialize with zero elections", async function () {
      expect(await voting.electionCount()).to.equal(0);
    });
  });

  describe("Election Creation", function () {
    it("Should allow admin to create election", async function () {
      const title = "Test Election";
      const options = ["Option A", "Option B", "Option C"];
      const duration = 3600; // 1 hour

      await expect(voting.createElection(title, options, duration))
        .to.emit(voting, "ElectionCreated")
        .withArgs(1, title, admin.address);

      expect(await voting.electionCount()).to.equal(1);
    });

    it("Should not allow non-admin to create election", async function () {
      const title = "Test Election";
      const options = ["Option A", "Option B"];
      const duration = 3600;

      await expect(
        voting.connect(user1).createElection(title, options, duration)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should reject empty title", async function () {
      await expect(
        voting.createElection("", ["Option A", "Option B"], 3600)
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should reject less than 2 options", async function () {
      await expect(
        voting.createElection("Test", ["Option A"], 3600)
      ).to.be.revertedWith("At least 2 options required");
    });

    it("Should reject zero duration", async function () {
      await expect(
        voting.createElection("Test", ["Option A", "Option B"], 0)
      ).to.be.revertedWith("Duration must be positive");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      // Create a test election
      await voting.createElection("Test Election", ["Option A", "Option B"], 3600);
    });

    it("Should allow users to vote", async function () {
      await expect(voting.connect(user1).vote(1, 0))
        .to.emit(voting, "Voted")
        .withArgs(1, user1.address, 0);

      expect(await voting.hasUserVoted(1, user1.address)).to.be.true;
    });

    it("Should not allow double voting", async function () {
      await voting.connect(user1).vote(1, 0);
      
      await expect(
        voting.connect(user1).vote(1, 1)
      ).to.be.revertedWith("You have already voted");
    });

    it("Should reject invalid option", async function () {
      await expect(
        voting.connect(user1).vote(1, 5)
      ).to.be.revertedWith("Invalid option");
    });

    it("Should reject voting on non-existent election", async function () {
      await expect(
        voting.connect(user1).vote(999, 0)
      ).to.be.revertedWith("Election does not exist");
    });
  });

  describe("Election Management", function () {
    beforeEach(async function () {
      await voting.createElection("Test Election", ["Option A", "Option B"], 1); // 1 second duration
    });

    it("Should allow admin to close election manually", async function () {
      await expect(voting.closeElection(1))
        .to.emit(voting, "ElectionClosed")
        .withArgs(1);
    });

    it("Should auto-close expired elections", async function () {
      // Wait for election to expire
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await expect(voting.autoCloseElection(1))
        .to.emit(voting, "ElectionClosed")
        .withArgs(1);
    });

    it("Should not allow voting on closed election", async function () {
      await voting.closeElection(1);
      
      await expect(
        voting.connect(user1).vote(1, 0)
      ).to.be.revertedWith("Election is closed");
    });
  });

  describe("Results and Queries", function () {
    beforeEach(async function () {
      await voting.createElection("Test Election", ["Option A", "Option B", "Option C"], 3600);
      
      // Cast some votes
      await voting.connect(user1).vote(1, 0);
      await voting.connect(user2).vote(1, 0);
      await voting.connect(user3).vote(1, 1);
    });

    it("Should return correct results", async function () {
      const results = await voting.getResults(1);
      expect(results[0]).to.equal(2); // Option A: 2 votes
      expect(results[1]).to.equal(1); // Option B: 1 vote
      expect(results[2]).to.equal(0); // Option C: 0 votes
    });

    it("Should return election details", async function () {
      const details = await voting.getElectionDetails(1);
      expect(details.title).to.equal("Test Election");
      expect(details.options).to.deep.equal(["Option A", "Option B", "Option C"]);
      expect(details.creator).to.equal(admin.address);
      expect(details.isActive).to.be.true;
    });

    it("Should check voting status correctly", async function () {
      expect(await voting.hasUserVoted(1, user1.address)).to.be.true;
      expect(await voting.hasUserVoted(1, admin.address)).to.be.false;
    });
  });

  describe("Admin Functions", function () {
    it("Should allow admin change", async function () {
      await expect(voting.changeAdmin(user1.address))
        .to.emit(voting, "AdminChanged")
        .withArgs(user1.address);

      expect(await voting.admin()).to.equal(user1.address);
    });

    it("Should not allow non-admin to change admin", async function () {
      await expect(
        voting.connect(user1).changeAdmin(user2.address)
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });
});
