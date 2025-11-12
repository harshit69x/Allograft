const AllograftManagement = artifacts.require("AllograftManagement");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(AllograftManagement);
  const instance = await AllograftManagement.deployed();
  
  // Grant roles to demo accounts for testing
  const DOCTOR_ROLE = web3.utils.keccak256("DOCTOR_ROLE");
  const TRANSPLANT_TEAM_ROLE = web3.utils.keccak256("TRANSPLANT_TEAM_ROLE");
  const PROCUREMENT_TEAM_ROLE = web3.utils.keccak256("PROCUREMENT_TEAM_ROLE");
  const MATCHING_ORGANIZER_ROLE = web3.utils.keccak256("MATCHING_ORGANIZER_ROLE");
  const DONOR_SURGEON_ROLE = web3.utils.keccak256("DONOR_SURGEON_ROLE");
  const TRANSPORTER_ROLE = web3.utils.keccak256("TRANSPORTER_ROLE");
  const TRANSPLANT_SURGEON_ROLE = web3.utils.keccak256("TRANSPLANT_SURGEON_ROLE");

  // For demo: Grant all roles to first account (admin)
  await instance.grantRole(DOCTOR_ROLE, accounts[0]);
  await instance.grantRole(TRANSPLANT_TEAM_ROLE, accounts[0]);
  await instance.grantRole(PROCUREMENT_TEAM_ROLE, accounts[0]);
  await instance.grantRole(MATCHING_ORGANIZER_ROLE, accounts[0]);
  await instance.grantRole(DONOR_SURGEON_ROLE, accounts[0]);
  await instance.grantRole(TRANSPORTER_ROLE, accounts[0]);
  await instance.grantRole(TRANSPLANT_SURGEON_ROLE, accounts[0]);

  console.log("AllograftManagement deployed at:", instance.address);
  console.log("All roles granted to admin:", accounts[0]);
};
