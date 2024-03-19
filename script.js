const connectButton = document.getElementById('connectWallet');
const feedbackList = document.getElementById('feedbackList');
const newFeedbackInput = document.getElementById('newFeedback');
const submitButton = document.getElementById('submitFeedback');

// Replace with your actual contract address deployed on Remix
const contractAddress = '0xaCC7c8633ae08b2e762D1b41146051B9a652Ac6C';

// Initialize Web3 provider (assuming browser has MetaMask)
let provider = new ethers.providers.Web3Provider(window.ethereum);

// Contract ABI (generated from your Solidity code)
const abi = [
    {
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
      },
    



  // Paste your smart contract ABI here
];

let contract;

// Connect MetaMask wallet
connectButton.addEventListener('click', async () => {
  try {
    await provider.send("eth_requestAccounts", []);
    contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
    connectButton.innerText = "Connected";
  } catch (error) {
    console.error("Error connecting wallet:", error);
  }
});

// Get all feedbacks on button click
submitButton.addEventListener('click', async () => {
  if (!contract) {
    alert("Please connect your wallet first!");
    return;
  }

  // Get feedback count
  const feedbackCount = await contract.messages.length();

  // Retrieve and display all feedbacks
  for (let i = 0; i < feedbackCount; i++) {
    const feedback = await contract.getFeedback(i);
    displayFeedback(feedback[0], feedback[1], feedback[2]);
  }
});

// Submit new feedback
submitButton.addEventListener('click', async () => {
  if (!contract || !newFeedbackInput.value) {
    return;
  }

  try {
    const tx = await contract.addFeedback(newFeedbackInput.value);
    await tx.wait(); // Wait for transaction confirmation
    console.log("Feedback submitted successfully!");
    newFeedbackInput.value = ""; // Clear input field after submission
  } catch (error) {
    console.error("Error submitting feedback:", error);
  }
});

// Helper function to display feedback
function displayFeedback(author, content, timestamp) {
  const feedbackItem = document.createElement('li');
  feedbackItem.innerText = `Author: ${author}\nContent: ${content}\nTimestamp: ${new Date(timestamp * 1000)}`;
  feedbackList.appendChild(feedbackItem);
}
