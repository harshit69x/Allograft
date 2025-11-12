# Allograft Management System

🏥 **Blockchain-based organ donation management and tracking system** implementing TransChain Algorithms 1–6.

## 📋 Features

- **7 Role-Based Access Control** using OpenZeppelin AccessControl
- **End-to-End Organ Tracking** from patient registration to transplant completion
- **Smart Contract Algorithms:**
  1. Patient Addition (Doctor)
  2. Donor Addition (Doctor)
  3. Matching Process (Matching Organizer)
  4. Donation Surgery (Donor Surgeon)
  5. Delivery (Transporter)
  6. Transplant Surgery (Transplant Surgeon)
- **Separate Frontend Portals** for each role
- **Comprehensive Test Suite** with 100% workflow coverage

## 🛠️ Tech Stack

- **Blockchain:** Solidity ^0.8.0
- **Framework:** Truffle v5.12
- **Local Blockchain:** Ganache
- **Frontend:** HTML, CSS, Web3.js
- **Access Control:** OpenZeppelin Contracts
- **Testing:** Truffle Test (Mocha/Chai)

## 📦 Prerequisites

- Node.js LTS (v18+ recommended)
- Ganache (running on port 8545)
- MetaMask browser extension

## 🚀 Installation

```powershell
# Install dependencies
npm install
```

## ⚙️ Setup

### 1. Start Ganache

Launch Ganache and ensure it's running on:
- Host: `127.0.0.1`
- Port: `8545`
- Network ID: `*` (any)

### 2. Compile Contracts

```powershell
npx truffle compile
```

### 3. Deploy Contracts

```powershell
npx truffle migrate --reset
```

This will:
- Deploy the `AllograftManagement` contract
- Grant all 7 roles to the deployer account (for testing)
- Output the contract address

### 4. Run Tests

```powershell
npx truffle test
```

Test coverage includes:
- ✅ Algorithm 1: Patient Addition
- ✅ Algorithm 2: Donor Addition
- ✅ Algorithm 3: Matching Process
- ✅ Algorithm 4: Donation Surgery
- ✅ Algorithm 5: Delivery
- ✅ Algorithm 6: Transplant Surgery
- ✅ Role-based access control
- ✅ End-to-end workflow

## 🌐 Frontend Usage

### Start the Development Server

```powershell
npm run dev
```

This starts `lite-server` at `http://localhost:3000`

### Available Portals

| Role | Portal | Responsibilities |
|------|--------|-----------------|
| **Admin** | `/admin.html` | Grant roles, view system status |
| **Doctor** | `/doctor.html` | Add patients and donors |
| **Transplant Team** | `/transplant-team.html` | Verify patients, confirm organ receipt |
| **Procurement Team** | `/procurement-team.html` | Verify donors |
| **Matching Organizer** | `/matching-organizer.html` | Match patients with donors |
| **Donor Surgeon** | `/donor-surgeon.html` | Perform donation surgery |
| **Transporter** | `/transporter.html` | Deliver organs |
| **Transplant Surgeon** | `/transplant-surgeon.html` | Perform transplant surgery |

### Connect MetaMask

1. Open MetaMask
2. Add custom network:
   - Network Name: Ganache
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency: ETH
3. Import Ganache accounts using private keys
4. Click "Connect Wallet" in any portal

## 📖 Complete Workflow Example - Step by Step Guide

This section provides a detailed walkthrough of the entire organ donation and transplant process, explaining each step, who performs it, why that role is important, and exactly how to execute it in the system.

### STEP 1: Doctor Adds Patient 👨‍⚕️

**Portal:** Doctor Portal (`doctor.html`)

**What happens:**
A doctor registers a patient who needs an organ transplant. This is the first step in the process—the patient's medical information is recorded on the blockchain.

**Why this role?**
Only doctors have the medical authority and expertise to identify and register patients who are candidates for organ transplantation. Doctors understand the patient's medical condition, organ needs, and overall health status.

**Function:** `addPatient(id, age, bmi, bloodGroup, organNeeded)`

**How to do it:**

1. Open `http://localhost:3000` in your browser
2. Click the **"Doctor"** role card (👨‍⚕️)
3. Click **"Connect Wallet"** → Approve the MetaMask popup
4. Scroll to the **"Algorithm 1: Add Patient"** section
5. Fill in the form with the following data:
   - **Patient ID:** `1`
   - **Age:** `35`
   - **BMI:** `22`
   - **Blood Group:** `A+`
   - **Organ Needed:** `Kidney`
6. Click **"Add Patient"** button
7. Approve the MetaMask transaction
8. Watch the activity log for confirmation message

**✅ Result:**
- Patient is now registered in the system
- Patient information is stored on the blockchain
- **Important:** Patient is NOT yet verified and cannot be matched with a donor
- Next step: Transplant Team must verify this patient

**Data Example:**
```
Patient Record:
├── ID: 1
├── Age: 35 years
├── BMI: 22 kg/m²
├── Blood Group: A+
├── Organ Needed: Kidney
├── Verified: false (until transplant team verifies)
└── Status: Awaiting Transplant Team verification
```

---

### STEP 2: Transplant Team Verifies Patient 🏥

**Portal:** Transplant Team Portal (`transplant-team.html`)

**What happens:**
The transplant team reviews the patient's medical records and conducts a thorough evaluation to confirm they are medically eligible for organ transplantation. This verification is crucial before the patient can be matched with a donor.

**Why this role?**
Transplant teams are specialized medical professionals (surgeons, coordinators, immunologists) who evaluate whether a patient is medically fit for surgery. They check:
- Is the patient healthy enough for surgery?
- Will their body tolerate the transplant?
- Are there any contraindications?
- Is the patient psychologically prepared?

Once verified, the patient is officially added to the **Patient Waiting List** on the blockchain.

**Function:** `verifyPatient(id)`

**How to do it:**

1. Click **"Transplant Team"** in the navigation menu (or click the card at home)
2. Click **"Connect Wallet"** if not already connected
3. Scroll to the **"Verify Patient"** section
4. Enter the patient ID: `1`
5. Click **"Verify Patient"** button
6. Approve the MetaMask transaction
7. View the confirmation in the activity log

**✅ Result:**
- Patient ID 1 is now **verified**
- Patient is added to the **Patient Waiting List**
- Patient information is displayed with verification status ✓
- Patient can now be **matched with a compatible donor**
- Next step: A donor must be registered and verified

**Patient Status After Verification:**
```
Patient Record Updated:
├── ID: 1
├── Age: 35 years
├── BMI: 22 kg/m²
├── Blood Group: A+
├── Organ Needed: Kidney
├── Verified: true ✅
├── On Waiting List: true
└── Status: Awaiting Donor Match
```

---

### STEP 3: Doctor Adds Donor 👨‍⚕️

**Portal:** Doctor Portal (`doctor.html`)

**What happens:**
A doctor registers a donor who wants to donate an organ. The donor's medical information and the organ they're willing to donate are recorded on the blockchain.

**Why this role?**
Doctors are responsible for identifying potential donors and recording their medical information. A donor could be:
- A brain-dead individual whose family consented to donation (cadaveric donor)
- A living person willing to donate part of an organ (living donor)
- A person enrolled in an organ donation program

Doctors ensure all medical data is accurate.

**Function:** `addDonor(id, age, bmi, bloodGroup, organDonated)`

**How to do it:**

1. Go back to the **Doctor** portal (if not already there)
2. Scroll down to the **"Algorithm 2: Add Donor"** section
3. Fill in the form with the following data:
   - **Donor ID:** `100`
   - **Age:** `40`
   - **BMI:** `24`
   - **Blood Group:** `A+`
   - **Organ to Donate:** `Kidney`
4. Click **"Add Donor"** button
5. Approve the MetaMask transaction
6. Watch for confirmation in the activity log

**✅ Result:**
- Donor is now registered in the system
- Donor information is stored on the blockchain
- **Important:** Donor is NOT yet verified and cannot be matched
- Next step: Procurement Team must verify this donor

**Data Example:**
```
Donor Record:
├── ID: 100
├── Age: 40 years
├── BMI: 24 kg/m²
├── Blood Group: A+
├── Organ to Donate: Kidney
├── Verified: false (until procurement team verifies)
└── Status: Awaiting Procurement Team verification
```

---

### STEP 4: Procurement Team Verifies Donor 🩺

**Portal:** Procurement Team Portal (`procurement-team.html`)

**What happens:**
The procurement team (organ procurement organization) conducts a thorough medical evaluation of the donor. They verify that the organ is healthy, viable, and suitable for transplantation.

**Why this role?**
The procurement team includes specialized nurses, coordinators, and physicians who:
- Verify donor medical history
- Conduct organ viability testing
- Check for infectious diseases and contraindications
- Ensure the organ meets transplant standards
- Coordinate the logistics of organ retrieval

This step is critical because organs have limited preservation time. Only viable organs can be transplanted.

**Function:** `verifyDonor(id)`

**How to do it:**

1. Click **"Procurement Team"** in the navigation menu (or from home page)
2. Click **"Connect Wallet"** if not already connected
3. Scroll to the **"Verify Donor"** section
4. Enter the donor ID: `100`
5. Click **"Verify Donor"** button
6. Approve the MetaMask transaction
7. The donor details will be displayed with verification confirmation

**✅ Result:**
- Donor ID 100 is now **verified**
- Donor is added to the **Donor Waiting List**
- Donor's information is displayed with verification status ✓
- Donor can now be **matched with a compatible patient**
- **Important:** Now we have a verified patient (ID: 1) AND a verified donor (ID: 100) who can be matched!

**Donor Status After Verification:**
```
Donor Record Updated:
├── ID: 100
├── Age: 40 years
├── BMI: 24 kg/m²
├── Blood Group: A+
├── Organ to Donate: Kidney
├── Verified: true ✅
├── On Waiting List: true
└── Status: Awaiting Match with Patient
```

---

### STEP 5: Matching Organizer Matches Patient & Donor 🔗

**Portal:** Matching Organizer Portal (`matching-organizer.html`)

**What happens:**
The matching organizer runs a compatibility algorithm to find a suitable patient for the verified donor. The system checks multiple criteria to ensure the patient and donor are medically compatible.

**Why this role?**
The matching organizer (like UNOS - United Network for Organ Sharing in the US) uses sophisticated algorithms to match donors with patients based on:
- Blood type compatibility
- Organ type match
- Age compatibility
- BMI (body mass index) compatibility
- Geographic proximity
- Waiting time

This ensures the best possible outcome for the transplant.

**Function:** `matchPatientDonor(donorId, minAge, maxAge, minBMI, maxBMI)`

**Matching Criteria Checked by the Smart Contract:**

1. **Blood Type Compatibility:** Donor and patient must have same blood type
2. **Organ Type:** Donor must be offering the same organ the patient needs
3. **Age Range:** Patient's age must be within the specified min/max range
4. **BMI Range:** Patient's BMI must be within the specified min/max range

**How to do it:**

1. Click **"Matching Organizer"** in the navigation menu
2. Click **"Connect Wallet"** if not already connected
3. (Optional) Click **"Refresh Lists"** to see all verified patients and donors currently waiting
4. Scroll to the **"Match Patient & Donor"** section
5. Fill in the form with:
   - **Donor ID:** `100`
   - **Min Age:** `30`
   - **Max Age:** `50`
   - **Min BMI:** `18`
   - **Max BMI:** `30`
6. Click **"Find Match"** button
7. Approve the MetaMask transaction

**✅ Result:**
- The system searches for patients who match the criteria
- **Patient ID 1 is automatically matched** because:
  - ✓ Blood type matches: A+ = A+
  - ✓ Organ type matches: Kidney = Kidney
  - ✓ Age matches: 35 is between 30-50
  - ✓ BMI matches: 22 is between 18-30
- A match record is created linking Donor #100 with Patient #1
- Both are removed from the waiting lists
- Next step: Donor Surgeon performs the donation surgery

**Match Record Created:**
```
Match Record:
├── Donor ID: 100
├── Patient ID: 1 (Auto-found match)
├── Compatibility Score: 100% ✅
├── Blood Type: A+ = A+ ✓
├── Organ Type: Kidney = Kidney ✓
├── Age Compatibility: 35 ∈ [30,50] ✓
├── BMI Compatibility: 22 ∈ [18,30] ✓
└── Status: Matched - Ready for Surgery
```

---

### STEP 6: Donor Surgeon Performs Donation Surgery ⚕️

**Portal:** Donor Surgeon Portal (`donor-surgeon.html`)

**What happens:**
The donor surgical team retrieves the organ from the donor's body through a carefully planned surgical procedure. This is a critical step where the organ is extracted and prepared for transport.

**Why this role?**
Donor surgeons are highly specialized surgeons who:
- Perform the organ retrieval surgery with precision
- Minimize organ damage during extraction
- Preserve organ viability for transplant
- Follow strict surgical protocols
- Work quickly as some organs have limited preservation time (minutes to hours)

Once the surgery is complete, the organ is marked as **"Ready"** for immediate transport.

**Function:** `donationSurgery(donorId)`

**How to do it:**

1. Click **"Donor Surgeon"** in the navigation menu
2. Click **"Connect Wallet"** if not already connected
3. (Optional) Click **"Refresh List"** to see the donation surgery waiting list (should show Donor #100)
4. Scroll to the **"Perform Donation Surgery"** section
5. Enter or select from the list:
   - **Donor ID:** `100`
6. Click **"Complete Surgery"** button
7. Approve the MetaMask transaction
8. Watch for success confirmation in the activity log

**✅ Result:**
- Donation surgery for Donor #100 is marked as **completed**
- The organ status changes to **"Ready"** for transport
- The organ is now preserved and ready for immediate delivery
- Time is critical - the organ must reach the recipient hospital within a specific timeframe
- Next step: Transporter must deliver the organ

**Donation Surgery Record:**
```
Donation Surgery Record:
├── Donor ID: 100
├── Organ Type: Kidney
├── Surgery Status: Completed ✅
├── Organ Status: Ready (waiting to be transported)
├── Timestamp: [Recorded on blockchain]
├── Surgeon Notes: Successfully extracted and preserved
└── Next Step: Transport to recipient hospital immediately
```

**Important Note:** 
Different organs have different preservation times:
- Heart: 4-6 hours
- Kidney: 24-36 hours
- Liver: 8-12 hours
- Lung: 4-6 hours

The transporter must deliver quickly!

---

### STEP 7: Transporter Delivers Organ 🚚

**Portal:** Transporter Portal (`transporter.html`)

**What happens:**
The organ is carefully transported from the donor hospital to the recipient hospital. The transporter ensures the organ stays viable and reaches safely within the preservation window.

**Why this role?**
Medical transporters/couriers are trained professionals who:
- Handle organs with extreme care
- Maintain proper temperature and preservation conditions
- Track organ location and condition
- Meet strict time deadlines
- Document the journey for traceability
- Comply with all regulations for organ transportation

The blockchain records the entire transport journey, ensuring transparency and accountability.

**Function:** `deliverOrgan(organId)`

**How to do it:**

1. Click **"Transporter"** in the navigation menu
2. Click **"Connect Wallet"** if not already connected
3. (Optional) Click **"Refresh List"** to see organs marked as "Ready" for delivery (should show Organ #100)
4. Scroll to the **"Deliver Organ"** section
5. Enter:
   - **Organ ID:** `100` (same as donor ID)
6. Click **"Deliver Organ"** button
7. Approve the MetaMask transaction

**Additional Features:**

**Check Organ Status:**
- Scroll to **"Check Organ Status"** section
- Enter Organ ID: `100`
- Click **"Check Status"** to verify it shows as "Delivered"

**✅ Result:**
- Organ delivery is recorded on the blockchain
- Organ status changes to **"Delivered"**
- The recipient hospital is notified of arrival
- The transplant team prepares for receipt confirmation
- Next step: Transplant Team confirms organ receipt

**Organ Journey Record:**
```
Organ Transport Record:
├── Organ ID: 100
├── Organ Type: Kidney
├── Donor Hospital: [Origin]
├── Recipient Hospital: [Destination]
├── Transport Status: Delivered ✅
├── Delivery Timestamp: [Recorded on blockchain]
├── Condition at Delivery: Viable ✓
├── Time in Transit: [Calculated and logged]
└── Next Step: Recipient hospital confirmation
```

---

### STEP 8: Transplant Team Confirms Organ Received 🏥

**Portal:** Transplant Team Portal (`transplant-team.html`)

**What happens:**
The receiving hospital's transplant team confirms that they have received the organ in good condition. This is a critical checkpoint where the organ is medically assessed and officially linked to the patient who will receive it.

**Why this role?**
The receiving transplant team:
- Physically verifies organ arrival
- Assesses organ viability after transport
- Performs initial medical tests
- Confirms organ condition is suitable for transplant
- Links the organ to the specific patient
- Prepares the patient and operating room for surgery

This confirmation activates the final step: the transplant surgery.

**Function:** `confirmOrganReceived(organId, patientId)`

**How to do it:**

1. Go to the **"Transplant Team"** portal
2. Ensure wallet is connected
3. Scroll to the **"Confirm Organ Received"** section
4. Fill in:
   - **Organ ID:** `100`
   - **Patient ID:** `1`
5. Click **"Confirm Received"** button
6. Approve the MetaMask transaction
7. Watch for confirmation message in activity log

**✅ Result:**
- Organ receipt is officially recorded on the blockchain
- Organ status changes to **"Received"**
- Patient ID 1 is added to the **Transplant Surgery Waiting List**
- The patient is prepared for immediate transplant surgery
- All previous steps are now locked on the blockchain for transparency
- Final step: Transplant Surgeon performs the transplant

**Organ Receipt Confirmation Record:**
```
Organ Receipt Record:
├── Organ ID: 100
├── Patient ID: 1
├── Organ Status: Received ✅
├── Received Timestamp: [Recorded on blockchain]
├── Condition Assessment: Viable for transplant
├── Patient Status: Ready for transplant surgery
├── Blockchain Status: All previous steps immutable and verified
└── Next Step: Transplant surgeon performs final surgery
```

**What's Recorded on Blockchain So Far:**
1. ✅ Patient registered and verified
2. ✅ Donor registered and verified
3. ✅ Patient and donor matched
4. ✅ Donation surgery completed
5. ✅ Organ transported
6. ✅ Organ received

All these steps cannot be changed or erased—complete transparency!

---

### STEP 9: Transplant Surgeon Performs Transplant Surgery 🏥 [FINAL STEP]

**Portal:** Transplant Surgeon Portal (`transplant-surgeon.html`)

**What happens:**
The transplant surgeon performs the final surgery to implant the organ into the patient. This is the culmination of the entire donation and matching process. Once complete, the patient has received the transplanted organ and the entire workflow is finished.

**Why this role?**
Transplant surgeons are elite specialists who:
- Perform complex organ transplantation surgery
- Surgically remove the patient's failing organ (if needed)
- Implant the new organ with precision
- Connect blood vessels and other structures
- Ensure proper function of the transplanted organ
- Monitor immediate post-surgical recovery

This is the final and most critical surgical step.

**Function:** `transplantSurgery(patientId)`

**How to do it:**

1. Click **"Transplant Surgeon"** in the navigation menu
2. Click **"Connect Wallet"** if not already connected
3. (Optional) Click **"Refresh List"** to see the transplant surgery waiting list (should show Patient #1)
4. Scroll to the **"Perform Transplant Surgery"** section
5. Enter:
   - **Patient ID:** `1`
6. Click **"Complete Surgery"** button
7. Approve the MetaMask transaction
8. Watch for success confirmation in activity log

**Verify Completion:**

1. Scroll to the **"View Transplant Info"** section
2. Enter Patient ID: `1`
3. Click **"Check Info"**
4. You should see:
   - Status: **Completed ✅**
   - Timestamp: [Exact date/time recorded on blockchain]

**✅ Result: WORKFLOW COMPLETE! 🎉**

- Transplant surgery is marked as **completed**
- Patient ID 1's transplant is marked as **successful**
- Exact timestamp is recorded on the blockchain
- The entire organ donation journey is now documented immutably
- The patient has received a new organ and hopefully a new chance at life

**Final Transplant Surgery Record:**
```
Transplant Surgery Record:
├── Patient ID: 1
├── Organ Type: Kidney (received)
├── Transplant Status: Completed ✅
├── Transplant Timestamp: [Recorded on blockchain]
├── Surgeon: [Recorded on blockchain]
├── Surgery Outcome: Successful
└── Patient Status: Post-transplant recovery

Complete Blockchain Journey:
1. ✅ Patient registered (Step 1)
2. ✅ Patient verified (Step 2)
3. ✅ Donor registered (Step 3)
4. ✅ Donor verified (Step 4)
5. ✅ Patient-Donor matched (Step 5)
6. ✅ Donation surgery (Step 6)
7. ✅ Organ delivered (Step 7)
8. ✅ Receipt confirmed (Step 8)
9. ✅ Transplant completed (Step 9)

🎉 ENTIRE WORKFLOW SUCCESSFULLY COMPLETED! 🎉
```

---

## 📊 Complete Workflow Summary Table

| Step | Role | Portal | Function | Status Transition |
|------|------|--------|----------|------------------|
| 1 | Doctor | doctor.html | Add Patient | Added → Pending Verification |
| 2 | Transplant Team | transplant-team.html | Verify Patient | Pending → Verified + On Waiting List |
| 3 | Doctor | doctor.html | Add Donor | Added → Pending Verification |
| 4 | Procurement Team | procurement-team.html | Verify Donor | Pending → Verified + On Waiting List |
| 5 | Matching Organizer | matching-organizer.html | Match Patient & Donor | Matched + Removed from waiting lists |
| 6 | Donor Surgeon | donor-surgeon.html | Donation Surgery | Surgery Complete → Organ Ready |
| 7 | Transporter | transporter.html | Deliver Organ | Ready → Delivered |
| 8 | Transplant Team | transplant-team.html | Confirm Receipt | Delivered → Received |
| 9 | Transplant Surgeon | transplant-surgeon.html | Transplant Surgery | Ready → **COMPLETED ✅** |

---

## 🔄 How the System Prevents Errors

The smart contract and frontend work together to prevent common mistakes:

1. **Role-Based Access Control:** Only the correct role can perform each step
2. **Verification Requirements:** Patients and donors must be verified before matching
3. **Compatibility Checks:** Matching verifies blood type, organ type, age, and BMI
4. **Status Tracking:** Each entity's status prevents duplicate actions
5. **Blockchain Immutability:** Once recorded, steps cannot be changed or undone
6. **Timeout Prevention:** Organs can only be delivered if they're marked as "Ready"

---

## 💡 Real-World Inspiration

This system is inspired by the actual organ transplantation process:

- **UNOS (United Network for Organ Sharing):** Real matching organizer in the US
- **OPOs (Organ Procurement Organizations):** Real procurement teams
- **Medical Standards:** All checks match real medical protocols
- **Blockchain Transparency:** Creates auditable trail for all stakeholders
- **Time-Sensitive Operations:** Reflects actual organ preservation limits

## 🔐 Roles & Permissions

| Role | Role Hash | Capabilities |
|------|-----------|--------------|
| `DOCTOR_ROLE` | `keccak256("DOCTOR_ROLE")` | Add patients and donors |
| `TRANSPLANT_TEAM_ROLE` | `keccak256("TRANSPLANT_TEAM_ROLE")` | Verify patients, confirm organ receipt |
| `PROCUREMENT_TEAM_ROLE` | `keccak256("PROCUREMENT_TEAM_ROLE")` | Verify donors |
| `MATCHING_ORGANIZER_ROLE` | `keccak256("MATCHING_ORGANIZER_ROLE")` | Match patients and donors |
| `DONOR_SURGEON_ROLE` | `keccak256("DONOR_SURGEON_ROLE")` | Perform donation surgery |
| `TRANSPORTER_ROLE` | `keccak256("TRANSPORTER_ROLE")` | Deliver organs |
| `TRANSPLANT_SURGEON_ROLE` | `keccak256("TRANSPLANT_SURGEON_ROLE")` | Perform transplant surgery |

### Grant Roles (Admin only)

```javascript
await contract.grantRole(DOCTOR_ROLE, "0x...");
```

## 📂 Project Structure

```
Allograft/
├── contracts/
│   ├── AllograftManagement.sol   # Main smart contract
│   └── Migrations.sol
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js     # Deployment + role grants
├── test/
│   └── AllograftManagement.test.js  # Comprehensive tests
├── frontend/
│   ├── index.html                # Landing page
│   ├── admin.html                # Admin portal
│   ├── doctor.html               # Doctor portal
│   ├── transplant-team.html      # Transplant team portal
│   ├── procurement-team.html     # Procurement portal
│   ├── matching-organizer.html   # Matching portal
│   ├── donor-surgeon.html        # Donor surgeon portal
│   ├── transporter.html          # Transporter portal
│   ├── transplant-surgeon.html   # Transplant surgeon portal
│   ├── styles.css                # Common styles
│   └── common.js                 # Shared utilities
├── build/                        # Compiled contracts (auto-generated)
├── truffle-config.js             # Truffle configuration
├── package.json
└── README.md
```

## 🧪 Testing

Run the full test suite:

```powershell
npx truffle test
```

Expected output:
```
Contract: AllograftManagement
  Algorithm 1: Patient Addition
    ✓ should allow doctor to add a patient
    ✓ should prevent non-doctor from adding patient
    ✓ should allow transplant team to verify patient
  Algorithm 2: Donor Addition
    ✓ should allow doctor to add a donor
    ✓ should allow procurement team to verify donor
    ✓ should prevent non-procurement team from verifying donor
  Algorithm 3: Matching Process
    ✓ should match patient and donor with compatible criteria
    ✓ should not match if donor not verified
    ✓ should not match if age criteria don't match
    ✓ should only be callable by matching organizer
  Algorithm 4: Donation Surgery
    ✓ should complete donation surgery
    ✓ should only be callable by donor surgeon
  Algorithm 5: Delivery
    ✓ should deliver organ
    ✓ should not allow double delivery
    ✓ should confirm organ received
    ✓ should only allow transporter to deliver
  Algorithm 6: Transplant Surgery
    ✓ should complete transplant surgery
    ✓ should only be callable by transplant surgeon
  End-to-End Workflow
    ✓ should complete full organ donation workflow
  Helper Functions
    ✓ should return waiting lists

  20 passing
```

## 🐛 Troubleshooting

### Contract not found error
- Ensure Ganache is running
- Run `npx truffle migrate --reset`

### MetaMask connection issues
- Check network configuration (localhost:8545, Chain ID 1337)
- Ensure correct account is selected
- Clear browser cache and reconnect

### Role permission errors
- Verify account has correct role via admin portal
- Check if using the right account in MetaMask

## 📄 License

MIT

## 👥 Contributors

Built for blockchain-based healthcare management research.

---

**Note:** This is a development version. For production use:
- Add proper authentication
- Implement IPFS for medical records
- Add encryption for sensitive data
- Conduct security audits
- Use testnet/mainnet deployment

