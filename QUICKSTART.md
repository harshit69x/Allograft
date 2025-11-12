# 🚀 Quick Start Guide

## Step 1: Install Dependencies
```powershell
npm install
```

## Step 2: Start Ganache
- Open Ganache
- Quick Start or New Workspace
- Ensure settings: `127.0.0.1:8545`

## Step 3: Compile & Deploy
```powershell
npx truffle compile
npx truffle migrate --reset
```

## Step 4: Run Tests (Optional)
```powershell
npx truffle test
```

## Step 5: Start Frontend
```powershell
npm run dev
```

Opens at `http://localhost:3000`

## Step 6: Configure MetaMask
1. Networks → Add Network
   - Network Name: `Ganache`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency: `ETH`
2. Import Account
   - Copy private key from Ganache
   - MetaMask → Import Account → Paste

## Step 7: Use the System

### Demo Workflow (All roles granted to account[0] for testing)

1. **Add Patient** → `doctor.html`
   - ID: 1, Age: 35, BMI: 22, Blood: A+, Organ: Kidney

2. **Verify Patient** → `transplant-team.html`
   - Patient ID: 1

3. **Add Donor** → `doctor.html`
   - ID: 100, Age: 40, BMI: 24, Blood: A+, Organ: Kidney

4. **Verify Donor** → `procurement-team.html`
   - Donor ID: 100

5. **Match** → `matching-organizer.html`
   - Donor: 100, Ages: 30-50, BMI: 18-30

6. **Donation Surgery** → `donor-surgeon.html`
   - Donor ID: 100

7. **Deliver Organ** → `transporter.html`
   - Organ ID: 100

8. **Confirm Received** → `transplant-team.html`
   - Organ: 100, Patient: 1

9. **Transplant Surgery** → `transplant-surgeon.html`
   - Patient ID: 1

✅ **Complete!**

## 🎯 Key Points

- **Default Admin:** First Ganache account has all roles
- **Contract Auto-loads:** Frontend fetches ABI from `build/contracts/`
- **Check Logs:** Every portal has activity log at bottom
- **Role Management:** Use `admin.html` to grant roles to other accounts

## 🆘 Common Issues

**"Contract not deployed"**
→ Run `npx truffle migrate --reset`

**"Connection refused"**
→ Check Ganache is running on port 8545

**"Unauthorized"**
→ Connect correct MetaMask account with role permissions

---

Happy Testing! 🏥
