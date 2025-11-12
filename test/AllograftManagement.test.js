const AllograftManagement = artifacts.require("AllograftManagement");

contract("AllograftManagement", (accounts) => {
  let instance;
  const [admin, doctor, transplantTeam, procurementTeam, matchingOrganizer, donorSurgeon, transporter, transplantSurgeon] = accounts;

  // Role constants
  const DOCTOR_ROLE = web3.utils.keccak256("DOCTOR_ROLE");
  const TRANSPLANT_TEAM_ROLE = web3.utils.keccak256("TRANSPLANT_TEAM_ROLE");
  const PROCUREMENT_TEAM_ROLE = web3.utils.keccak256("PROCUREMENT_TEAM_ROLE");
  const MATCHING_ORGANIZER_ROLE = web3.utils.keccak256("MATCHING_ORGANIZER_ROLE");
  const DONOR_SURGEON_ROLE = web3.utils.keccak256("DONOR_SURGEON_ROLE");
  const TRANSPORTER_ROLE = web3.utils.keccak256("TRANSPORTER_ROLE");
  const TRANSPLANT_SURGEON_ROLE = web3.utils.keccak256("TRANSPLANT_SURGEON_ROLE");

  beforeEach(async () => {
    instance = await AllograftManagement.new({ from: admin });
    
    // Grant roles
    await instance.grantRole(DOCTOR_ROLE, doctor, { from: admin });
    await instance.grantRole(TRANSPLANT_TEAM_ROLE, transplantTeam, { from: admin });
    await instance.grantRole(PROCUREMENT_TEAM_ROLE, procurementTeam, { from: admin });
    await instance.grantRole(MATCHING_ORGANIZER_ROLE, matchingOrganizer, { from: admin });
    await instance.grantRole(DONOR_SURGEON_ROLE, donorSurgeon, { from: admin });
    await instance.grantRole(TRANSPORTER_ROLE, transporter, { from: admin });
    await instance.grantRole(TRANSPLANT_SURGEON_ROLE, transplantSurgeon, { from: admin });
  });

  describe("Algorithm 1: Patient Addition", () => {
    it("should allow doctor to add a patient", async () => {
      const tx = await instance.addPatient(1, 35, 22, "A+", "Kidney", { from: doctor });
      assert.equal(tx.logs[0].event, "PatientAdded");
      assert.equal(tx.logs[0].args.patientId.toNumber(), 1);

      const patient = await instance.patients(1);
      assert.equal(patient.id.toNumber(), 1);
      assert.equal(patient.age.toNumber(), 35);
      assert.equal(patient.bmi.toNumber(), 22);
      assert.equal(patient.bloodGroup, "A+");
      assert.equal(patient.organNeeded, "Kidney");
      assert.equal(patient.verified, false);
    });

    it("should prevent non-doctor from adding patient", async () => {
      try {
        await instance.addPatient(1, 35, 22, "A+", "Kidney", { from: admin });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "revert");
      }
    });

    it("should allow transplant team to verify patient", async () => {
      await instance.addPatient(1, 35, 22, "A+", "Kidney", { from: doctor });
      const tx = await instance.verifyPatient(1, { from: transplantTeam });
      
      assert.equal(tx.logs[0].event, "PatientVerified");
      assert.equal(tx.logs[0].args.patientId.toNumber(), 1);

      const patient = await instance.patients(1);
      assert.equal(patient.verified, true);

      const waitingList = await instance.patientWaitingList(0);
      assert.equal(waitingList.toNumber(), 1);
    });
  });

  describe("Algorithm 2: Donor Addition", () => {
    it("should allow doctor to add a donor", async () => {
      const tx = await instance.addDonor(100, 40, 24, "A+", "Kidney", { from: doctor });
      assert.equal(tx.logs[0].event, "DonorAdded");
      assert.equal(tx.logs[0].args.donorId.toNumber(), 100);

      const donor = await instance.donors(100);
      assert.equal(donor.id.toNumber(), 100);
      assert.equal(donor.age.toNumber(), 40);
      assert.equal(donor.bmi.toNumber(), 24);
      assert.equal(donor.bloodGroup, "A+");
      assert.equal(donor.organDonated, "Kidney");
      assert.equal(donor.verified, false);
    });

    it("should allow procurement team to verify donor", async () => {
      await instance.addDonor(100, 40, 24, "A+", "Kidney", { from: doctor });
      const tx = await instance.verifyDonor(100, { from: procurementTeam });
      
      assert.equal(tx.logs[0].event, "DonorVerified");
      const donor = await instance.donors(100);
      assert.equal(donor.verified, true);
    });

    it("should prevent non-procurement team from verifying donor", async () => {
      await instance.addDonor(100, 40, 24, "A+", "Kidney", { from: doctor });
      try {
        await instance.verifyDonor(100, { from: doctor });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "revert");
      }
    });
  });

  describe("Algorithm 3: Matching Process", () => {
    beforeEach(async () => {
      // Add and verify patient
      await instance.addPatient(1, 35, 22, "A+", "Kidney", { from: doctor });
      await instance.verifyPatient(1, { from: transplantTeam });
      
      // Add and verify donor
      await instance.addDonor(100, 40, 24, "A+", "Kidney", { from: doctor });
      await instance.verifyDonor(100, { from: procurementTeam });
    });

    it("should match patient and donor with compatible criteria", async () => {
      const tx = await instance.matchPatientDonor(100, 30, 50, 18, 30, { from: matchingOrganizer });
      
      assert.equal(tx.logs[0].event, "MatchFound");
      assert.equal(tx.logs[0].args.donorId.toNumber(), 100);
      assert.equal(tx.logs[0].args.patientId.toNumber(), 1);

      const match = await instance.patientToDonor(1);
      assert.equal(match.toNumber(), 100);
    });

    it("should not match if donor not verified", async () => {
      await instance.addDonor(101, 40, 24, "A+", "Kidney", { from: doctor });
      // Don't verify donor
      
      try {
        await instance.matchPatientDonor(101, 30, 50, 18, 30, { from: matchingOrganizer });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "Donor not verified");
      }
    });

    it("should not match if age criteria don't match", async () => {
      const tx = await instance.matchPatientDonor(100, 50, 60, 18, 30, { from: matchingOrganizer });
      
      // Should not emit MatchFound
      const matchFound = tx.logs.find(log => log.event === "MatchFound");
      assert.isUndefined(matchFound);
    });

    it("should only be callable by matching organizer", async () => {
      try {
        await instance.matchPatientDonor(100, 30, 50, 18, 30, { from: doctor });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "revert");
      }
    });
  });

  describe("Algorithm 4: Donation Surgery", () => {
    beforeEach(async () => {
      await instance.addPatient(1, 35, 22, "A+", "Kidney", { from: doctor });
      await instance.verifyPatient(1, { from: transplantTeam });
      await instance.addDonor(100, 40, 24, "A+", "Kidney", { from: doctor });
      await instance.verifyDonor(100, { from: procurementTeam });
      await instance.matchPatientDonor(100, 30, 50, 18, 30, { from: matchingOrganizer });
    });

    it("should complete donation surgery", async () => {
      const tx = await instance.donationSurgery(100, { from: donorSurgeon });
      
      assert.equal(tx.logs[0].event, "DonationCompleted");
      assert.equal(tx.logs[0].args.donorId.toNumber(), 100);

      const donationInfo = await instance.donationInfo(100);
      assert.equal(donationInfo.donorId.toNumber(), 100);
      assert.equal(donationInfo.completed, true);
      assert.isAbove(donationInfo.timestamp.toNumber(), 0);

      const status = await instance.organStatus(100);
      assert.equal(status.organId.toNumber(), 100);
      assert.equal(status.status, "Ready");
    });

    it("should only be callable by donor surgeon", async () => {
      try {
        await instance.donationSurgery(100, { from: doctor });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "revert");
      }
    });
  });

  describe("Algorithm 5: Delivery", () => {
    beforeEach(async () => {
      await instance.addPatient(1, 35, 22, "A+", "Kidney", { from: doctor });
      await instance.verifyPatient(1, { from: transplantTeam });
      await instance.addDonor(100, 40, 24, "A+", "Kidney", { from: doctor });
      await instance.verifyDonor(100, { from: procurementTeam });
      await instance.matchPatientDonor(100, 30, 50, 18, 30, { from: matchingOrganizer });
      await instance.donationSurgery(100, { from: donorSurgeon });
    });

    it("should deliver organ", async () => {
      const tx = await instance.deliverOrgan(100, { from: transporter });
      
      assert.equal(tx.logs[0].event, "OrganDelivered");
      assert.equal(tx.logs[0].args.organId.toNumber(), 100);
      assert.equal(tx.logs[0].args.status, "Delivered");

      const status = await instance.organStatus(100);
      assert.equal(status.status, "Delivered");
    });

    it("should not allow double delivery", async () => {
      await instance.deliverOrgan(100, { from: transporter });
      
      try {
        await instance.deliverOrgan(100, { from: transporter });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "Already delivered");
      }
    });

    it("should confirm organ received", async () => {
      await instance.deliverOrgan(100, { from: transporter });
      const tx = await instance.confirmOrganReceived(100, 1, { from: transplantTeam });
      
      const status = await instance.organStatus(100);
      assert.equal(status.status, "Received");

      const waitingList = await instance.transplantWaitingList(0);
      assert.equal(waitingList.toNumber(), 1);
    });

    it("should only allow transporter to deliver", async () => {
      try {
        await instance.deliverOrgan(100, { from: doctor });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "revert");
      }
    });
  });

  describe("Algorithm 6: Transplant Surgery", () => {
    beforeEach(async () => {
      await instance.addPatient(1, 35, 22, "A+", "Kidney", { from: doctor });
      await instance.verifyPatient(1, { from: transplantTeam });
      await instance.addDonor(100, 40, 24, "A+", "Kidney", { from: doctor });
      await instance.verifyDonor(100, { from: procurementTeam });
      await instance.matchPatientDonor(100, 30, 50, 18, 30, { from: matchingOrganizer });
      await instance.donationSurgery(100, { from: donorSurgeon });
      await instance.deliverOrgan(100, { from: transporter });
      await instance.confirmOrganReceived(100, 1, { from: transplantTeam });
    });

    it("should complete transplant surgery", async () => {
      const tx = await instance.transplantSurgery(1, { from: transplantSurgeon });
      
      assert.equal(tx.logs[0].event, "TransplantCompleted");
      assert.equal(tx.logs[0].args.patientId.toNumber(), 1);

      const transplantInfo = await instance.transplantInfo(1);
      assert.equal(transplantInfo.patientId.toNumber(), 1);
      assert.equal(transplantInfo.completed, true);
      assert.isAbove(transplantInfo.timestamp.toNumber(), 0);
    });

    it("should only be callable by transplant surgeon", async () => {
      try {
        await instance.transplantSurgery(1, { from: doctor });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "revert");
      }
    });
  });

  describe("End-to-End Workflow", () => {
    it("should complete full organ donation workflow", async () => {
      // 1. Doctor adds patient
      await instance.addPatient(1, 35, 22, "O+", "Liver", { from: doctor });
      
      // 2. Transplant team verifies patient
      await instance.verifyPatient(1, { from: transplantTeam });
      
      // 3. Doctor adds donor
      await instance.addDonor(200, 38, 23, "O+", "Liver", { from: doctor });
      
      // 4. Procurement team verifies donor
      await instance.verifyDonor(200, { from: procurementTeam });
      
      // 5. Matching organizer matches patient and donor
      await instance.matchPatientDonor(200, 30, 40, 20, 25, { from: matchingOrganizer });
      
      // 6. Donor surgeon performs donation surgery
      await instance.donationSurgery(200, { from: donorSurgeon });
      
      // 7. Transporter delivers organ
      await instance.deliverOrgan(200, { from: transporter });
      
      // 8. Transplant team confirms organ received
      await instance.confirmOrganReceived(200, 1, { from: transplantTeam });
      
      // 9. Transplant surgeon performs transplant surgery
      const tx = await instance.transplantSurgery(1, { from: transplantSurgeon });
      
      assert.equal(tx.logs[0].event, "TransplantCompleted");
      
      // Verify final state
      const transplantInfo = await instance.transplantInfo(1);
      assert.equal(transplantInfo.completed, true);
      
      const organStatus = await instance.organStatus(200);
      assert.equal(organStatus.status, "Received");
    });
  });

  describe("Helper Functions", () => {
    it("should return waiting lists", async () => {
      await instance.addPatient(1, 35, 22, "A+", "Kidney", { from: doctor });
      await instance.verifyPatient(1, { from: transplantTeam });
      
      await instance.addDonor(100, 40, 24, "A+", "Kidney", { from: doctor });
      await instance.verifyDonor(100, { from: procurementTeam });
      
      const lists = await instance.getWaitingLists();
      assert.equal(lists[0][0].toNumber(), 1); // Patient waiting list
      assert.equal(lists[1][0].toNumber(), 100); // Donor waiting list
    });
  });
});
