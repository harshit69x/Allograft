// Common utilities for all frontend pages
let web3;
let contract;
let accounts;
let currentAccount;

// Load contract from build artifacts
async function loadContract() {
  try {
    console.log('Fetching contract artifact...');
    const res = await fetch('/AllograftManagement.json');
    
    if (!res.ok) {
      throw new Error(`Failed to load contract artifact: ${res.status} ${res.statusText}`);
    }
    
    const artifact = await res.json();
    console.log('Contract artifact loaded:', artifact);
    
    const networkIds = Object.keys(artifact.networks || {});
    if (!networkIds.length) {
      throw new Error('Contract not deployed. Run: truffle migrate --reset');
    }
    
    const lastId = networkIds[networkIds.length - 1];
    const address = artifact.networks[lastId].address;
    console.log('Contract address:', address, 'Network ID:', lastId);
    
    return new web3.eth.Contract(artifact.abi, address);
  } catch (error) {
    console.error('Error loading contract:', error);
    throw error;
  }
}

// Connect wallet
async function connectWallet() {
  console.log('connectWallet function called');
  
  if (typeof window.ethereum === 'undefined') {
    const msg = 'MetaMask not detected. Please install MetaMask extension.';
    alert(msg);
    console.error(msg);
    return false;
  }
  
  console.log('MetaMask detected, requesting accounts...');
  
  try {
    // Request account access
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    currentAccount = accounts[0];
    console.log('Connected account:', currentAccount);
    
    // Initialize Web3 with ethereum provider
    if (typeof Web3 !== 'undefined') {
      web3 = new Web3(window.ethereum);
      console.log('Web3 initialized');
    } else {
      alert('Web3 library not loaded. Please refresh the page.');
      console.error('Web3 undefined');
      return false;
    }
    
    // Load contract
    console.log('Loading contract...');
    contract = await loadContract();
    console.log('Contract loaded:', contract.options.address);
    
    log(`Connected: ${currentAccount.substring(0, 10)}...`, 'success');
    updateWalletDisplay();
    
    // Listen for account changes
    window.ethereum.on('accountsChanged', function (newAccounts) {
      currentAccount = newAccounts[0];
      updateWalletDisplay();
      log(`Account changed: ${currentAccount.substring(0, 10)}...`, 'info');
    });
    
    return true;
  } catch (error) {
    console.error('Connection error:', error);
    log('Connection failed: ' + error.message, 'error');
    alert('Connection failed: ' + error.message);
    return false;
  }
}

// Update wallet display
function updateWalletDisplay() {
  const walletEl = document.getElementById('walletAddress');
  if (walletEl && currentAccount) {
    walletEl.textContent = currentAccount;
  }
}

// Logging utility
function log(message, type = 'info') {
  const logEl = document.getElementById('log');
  if (!logEl) return;
  
  const timestamp = new Date().toLocaleTimeString();
  const className = `log-${type}`;
  const entry = `<div class="log-entry ${className}">[${timestamp}] ${message}</div>`;
  logEl.innerHTML += entry;
  logEl.scrollTop = logEl.scrollHeight;
}

// Send transaction wrapper
async function sendTransaction(methodName, args = [], fromAccount = null) {
  if (!contract) {
    log('Contract not loaded. Please connect wallet.', 'error');
    return null;
  }
  
  try {
    const from = fromAccount || currentAccount;
    log(`Sending ${methodName}...`, 'info');
    console.log('Method:', methodName, 'Args:', args, 'From:', from);
    
    // Try to call first to get better error messages
    try {
      await contract.methods[methodName](...args).call({ from });
      console.log('Call succeeded, proceeding with transaction');
    } catch (callError) {
      console.error('Call failed:', callError);
      let errorMsg = 'Transaction would fail';
      
      // Try to extract revert reason
      if (callError.message) {
        if (callError.message.includes('revert')) {
          const match = callError.message.match(/revert (.+?)(?:"|$)/);
          errorMsg = match ? match[1] : callError.message;
        } else {
          errorMsg = callError.message;
        }
      }
      
      // Check for specific error data
      if (callError.data) {
        console.error('Error data:', callError.data);
        if (typeof callError.data === 'object' && callError.data.message) {
          errorMsg = callError.data.message;
        }
      }
      
      log(`✗ ${methodName} failed: ${errorMsg}`, 'error');
      return null;
    }
    
    // Estimate gas and convert BigInt to Number
    const gasEstimate = await contract.methods[methodName](...args).estimateGas({ from });
    const gasLimit = typeof gasEstimate === 'bigint' 
      ? Number(gasEstimate * 120n / 100n) 
      : Math.floor(Number(gasEstimate) * 1.2);
    
    console.log('Gas estimate:', gasEstimate, 'Gas limit:', gasLimit);
    
    const receipt = await contract.methods[methodName](...args).send({ 
      from, 
      gas: gasLimit
    });
    
    log(`✓ ${methodName} success! Tx: ${receipt.transactionHash}`, 'success');
    return receipt;
  } catch (error) {
    console.error('Transaction error:', error);
    const msg = error.message.includes('revert') 
      ? error.message.split('revert')[1] || 'Transaction reverted'
      : error.message;
    log(`✗ ${methodName} failed: ${msg}`, 'error');
    return null;
  }
}

// Call view function
async function callView(methodName, args = []) {
  if (!contract) {
    log('Contract not loaded', 'error');
    return null;
  }
  
  try {
    const result = await contract.methods[methodName](...args).call();
    return result;
  } catch (error) {
    // Don't log errors for array index out of bounds (expected when iterating arrays)
    if (error.message && error.message.includes('Internal JSON-RPC error')) {
      console.log(`${methodName} - array end or invalid index (expected)`);
      return null;
    }
    
    log(`View call ${methodName} failed: ${error.message}`, 'error');
    return null;
  }
}

// Get value from input
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// Get number from input
function getNum(id) {
  const val = getVal(id);
  return val ? parseInt(val, 10) : 0;
}

// Clear form
function clearForm(formId) {
  const form = document.getElementById(formId);
  if (form) form.reset();
}

// Format address
function formatAddress(addr) {
  if (!addr) return 'N/A';
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}

// Display patient data
function displayPatient(patient, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="card">
      <h3>Patient #${patient.id}</h3>
      <p><strong>Age:</strong> ${patient.age}</p>
      <p><strong>BMI:</strong> ${patient.bmi}</p>
      <p><strong>Blood Group:</strong> ${patient.bloodGroup}</p>
      <p><strong>Organ Needed:</strong> ${patient.organNeeded}</p>
      <p><strong>Status:</strong> 
        <span class="badge ${patient.verified ? 'badge-success' : 'badge-warning'}">
          ${patient.verified ? 'Verified' : 'Pending'}
        </span>
      </p>
    </div>
  `;
}

// Display donor data
function displayDonor(donor, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="card">
      <h3>Donor #${donor.id}</h3>
      <p><strong>Age:</strong> ${donor.age}</p>
      <p><strong>BMI:</strong> ${donor.bmi}</p>
      <p><strong>Blood Group:</strong> ${donor.bloodGroup}</p>
      <p><strong>Organ Donated:</strong> ${donor.organDonated}</p>
      <p><strong>Status:</strong> 
        <span class="badge ${donor.verified ? 'badge-success' : 'badge-warning'}">
          ${donor.verified ? 'Verified' : 'Pending'}
        </span>
      </p>
    </div>
  `;
}

// Auto-connect on page load
window.addEventListener('load', () => {
  console.log('Page loaded, setting up event handlers...');
  
  const connectBtn = document.getElementById('btnConnect');
  if (connectBtn) {
    console.log('Connect button found, attaching click handler');
    connectBtn.onclick = async (e) => {
      console.log('Connect button clicked');
      e.preventDefault();
      await connectWallet();
    };
    
    // Also add event listener as backup
    connectBtn.addEventListener('click', async (e) => {
      console.log('Connect button clicked (addEventListener)');
      e.preventDefault();
      await connectWallet();
    });
  } else {
    console.error('Connect button not found!');
  }
  
  // Check if MetaMask is installed
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
  } else {
    console.warn('MetaMask is NOT installed');
  }
  
  // Check if Web3 is loaded
  if (typeof Web3 !== 'undefined') {
    console.log('Web3 library loaded successfully');
  } else {
    console.error('Web3 library NOT loaded');
  }
});
