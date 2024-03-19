const feedbackContainer = document.getElementById('feedback-container');
const newFeedbackInput = document.getElementById('new-feedback');
const submitButton = document.getElementById('submit-button');

// Replace with your deployed contract address
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with actual address
const abi = [{
    "inputs": [
      {
        "internalType": "string",
        "name": "_content",
        "type": "string"
      }
    ],
    "name": "addFeedback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFeedback",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "author",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "content",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct Feedback.Message[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "messages",
    "outputs": [
      {
        "internalType": "address",
        "name": "author",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "content",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }

  // ... Paste your contract ABI here
];

// Function to connect to the Ethereum network and get a provider
async function connectToEthereum() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      await provider.send("eth_requestAccounts", []);
      return provider;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      return null;
    }
  } else {
    console.error("No Ethereum wallet detected.");
    return null;
  }
}

// Function to fetch feedback messages from the contract
async function getFeedback() {
  const provider = await connectToEthereum();
  if (!provider) return;

  const signer = provider.getSigner();
  console.log("Using contract address:", contractAddress);
  const contract = new ethers.Contract(contractAddress, abi, signer); // Replace 'abi' with your contract ABI

  try {
    const messages = await contract.getFeedback();
    const formattedMessages = messages.map(message => {
      const author = message.author;
      const content = message.content;
      const timestamp = new Date(message.timestamp.toNumber() * 1000).toLocaleString();
      return `<b>${author}</b>: ${content} - ${timestamp}`;
    });
    feedbackContainer.innerHTML = formattedMessages.join('<br>');
  } catch (error) {
    console.error("Error fetching feedback:", error);
  }
}

// Function to submit new feedback to the contract
async function submitFeedback(content) {
  if (!content.trim()) {
    alert('Please enter your feedback!');
    return;
  }

  const provider = await connectToEthereum();
  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer); // Replace 'abi' with your contract ABI

  try {
    const tx = await contract.addFeedback(content);
    console.log("Transaction sent:", tx.hash);

    // Display a loading indicator or message while waiting for confirmation
    submitButton.textContent = 'Submitting...';

    const receipt = await tx.wait(); // Wait for confirmation
    console.log("Feedback submitted successfully:", receipt.transactionHash);

    submitButton.textContent = 'Submit Feedback'; // Reset button text
    newFeedbackInput.value = ''; // Clear input field
    getFeedback(); // Refresh feedback after submission
  } catch (error) {
    console.error("Error submitting feedback:", error);
    submitButton.textContent = 'Submit Feedback'; // Reset button text in case of error
  }
}

submitButton.addEventListener('click', () => {
  const content = newFeedbackInput.value;
  submitFeedback(content);
});

getFeedback(); // Call getFeedback on page load to display initial messages
