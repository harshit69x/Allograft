// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AllograftManagement is AccessControl {
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant TRANSPLANT_TEAM_ROLE = keccak256("TRANSPLANT_TEAM_ROLE");
    bytes32 public constant PROCUREMENT_TEAM_ROLE = keccak256("PROCUREMENT_TEAM_ROLE");
    bytes32 public constant MATCHING_ORGANIZER_ROLE = keccak256("MATCHING_ORGANIZER_ROLE");
    bytes32 public constant DONOR_SURGEON_ROLE = keccak256("DONOR_SURGEON_ROLE");
    bytes32 public constant TRANSPORTER_ROLE = keccak256("TRANSPORTER_ROLE");
    bytes32 public constant TRANSPLANT_SURGEON_ROLE = keccak256("TRANSPLANT_SURGEON_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // ---------------- STRUCTS ----------------
    struct PatientInfo {
        uint id;
        uint age;
        uint bmi;
        string bloodGroup;
        string organNeeded;
        bool verified;
    }

    struct DonorInfo {
        uint id;
        uint age;
        uint bmi;
        string bloodGroup;
        string organDonated;
        bool verified;
    }

    struct DonationSurgeryInfo {
        uint donorId;
        uint timestamp;
        bool completed;
    }

    struct TransplantSurgeryInfo {
        uint patientId;
        uint timestamp;
        bool completed;
    }

    struct OrganStatus {
        uint organId;
        string status; // Ready, Delivered, Received, Transplanted
    }

    // ---------------- MAPPINGS ----------------
    mapping(uint => PatientInfo) public patients;
    mapping(uint => DonorInfo) public donors;
    mapping(uint => uint) public patientToDonor; // Match mapping
    mapping(uint => DonationSurgeryInfo) public donationInfo;
    mapping(uint => TransplantSurgeryInfo) public transplantInfo;
    mapping(uint => OrganStatus) public organStatus;

    uint[] public patientWaitingList;
    uint[] public donorWaitingList;
    uint[] public donationSurgeryWaitingList;
    uint[] public deliveryList;
    uint[] public transplantWaitingList;

    // ---------------- EVENTS ----------------
    event PatientAdded(uint patientId);
    event PatientVerified(uint patientId);
    event DonorAdded(uint donorId);
    event DonorVerified(uint donorId);
    event MatchFound(uint donorId, uint patientId);
    event DonationCompleted(uint donorId);
    event OrganDelivered(uint organId, string status);
    event TransplantCompleted(uint patientId);

    // ---------------- ALGORITHM 1: PATIENT ADDITION ----------------
    function addPatient(uint _id, uint _age, uint _bmi, string memory _bloodGroup, string memory _organNeeded)
        public onlyRole(DOCTOR_ROLE)
    {
        patients[_id] = PatientInfo(_id, _age, _bmi, _bloodGroup, _organNeeded, false);
        emit PatientAdded(_id);
    }

    function verifyPatient(uint _id) public onlyRole(TRANSPLANT_TEAM_ROLE) {
        patients[_id].verified = true;
        patientWaitingList.push(_id);
        emit PatientVerified(_id);
    }

    // ---------------- ALGORITHM 2: DONOR ADDITION ----------------
    function addDonor(uint _id, uint _age, uint _bmi, string memory _bloodGroup, string memory _organDonated)
        public onlyRole(DOCTOR_ROLE)
    {
        donors[_id] = DonorInfo(_id, _age, _bmi, _bloodGroup, _organDonated, false);
        emit DonorAdded(_id);
    }

    function verifyDonor(uint _id) public onlyRole(PROCUREMENT_TEAM_ROLE) {
        donors[_id].verified = true;
        donorWaitingList.push(_id);
        emit DonorVerified(_id);
    }

    // ---------------- ALGORITHM 3: MATCHING PROCESS ----------------
    function matchPatientDonor(uint donorId, uint minAge, uint maxAge, uint minBMI, uint maxBMI)
        public onlyRole(MATCHING_ORGANIZER_ROLE)
    {
        DonorInfo memory d = donors[donorId];
        require(d.verified, "Donor not verified");

        for (uint i = 0; i < patientWaitingList.length; i++) {
            uint pid = patientWaitingList[i];
            PatientInfo memory p = patients[pid];

            if (
                keccak256(bytes(p.organNeeded)) == keccak256(bytes(d.organDonated)) &&
                keccak256(bytes(p.bloodGroup)) == keccak256(bytes(d.bloodGroup)) &&
                p.age >= minAge && p.age <= maxAge &&
                p.bmi >= minBMI && p.bmi <= maxBMI
            ) {
                patientToDonor[pid] = donorId;
                donationSurgeryWaitingList.push(donorId);
                emit MatchFound(donorId, pid);
                break;
            }
        }
    }

    // ---------------- ALGORITHM 4: DONATION SURGERY ----------------
    function donationSurgery(uint donorId) public onlyRole(DONOR_SURGEON_ROLE) {
        donationInfo[donorId] = DonationSurgeryInfo(donorId, block.timestamp, true);
        organStatus[donorId] = OrganStatus(donorId, "Ready");
        deliveryList.push(donorId);
        emit DonationCompleted(donorId);
    }

    // ---------------- ALGORITHM 5: DELIVERY ----------------
    function deliverOrgan(uint organId) public onlyRole(TRANSPORTER_ROLE) {
        require(
            keccak256(bytes(organStatus[organId].status)) != keccak256(bytes("Delivered")),
            "Already delivered"
        );
        organStatus[organId].status = "Delivered";
        emit OrganDelivered(organId, "Delivered");
    }

    function confirmOrganReceived(uint organId, uint patientId) public onlyRole(TRANSPLANT_TEAM_ROLE) {
        organStatus[organId].status = "Received";
        transplantWaitingList.push(patientId);
        emit OrganDelivered(organId, "Received");
    }

    // ---------------- ALGORITHM 6: TRANSPLANT SURGERY ----------------
    function transplantSurgery(uint patientId) public onlyRole(TRANSPLANT_SURGEON_ROLE) {
        transplantInfo[patientId] = TransplantSurgeryInfo(patientId, block.timestamp, true);
        emit TransplantCompleted(patientId);
    }

    // ---------------- HELPERS ----------------
    function getWaitingLists() public view returns (uint[] memory, uint[] memory) {
        return (patientWaitingList, donorWaitingList);
    }
}
