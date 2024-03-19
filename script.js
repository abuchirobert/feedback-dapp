const provider = new ethers.providers.JsonRpcProvider('https://floral-alpha-season.ethereum-sepolia.quiknode.pro/bfc56c51a1137de214326963e3dfcdfa6526ccf1/');
const signer = provider.getSigner();

const contractAddress = '0xaCC7c8633ae08b2e762D1b41146051B9a652Ac6C';
const abi = [
    'function submitFeedback(string _message) public',
    'function getAllFeedback() public view returns (address[] memory, string[] memory, uint256[] memory)'
];
const contract = new ethers.Contract(contractAddress, abi, signer);

const feedbackForm = document.getElementById('feedbackForm');
const feedbackMessage = document.getElementById('feedbackMessage');
const feedbackList = document.getElementById('feedbackList');

feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!signer) {
        alert('Please connect your wallet');
        return;
    }

    const tx = await contract.submitFeedback(feedbackMessage.value);
    await tx.wait();

    feedbackMessage.value = '';
    alert('Feedback submitted successfully');
});

async function getFeedbacks() {
    const [senders, messages, timestamps] = await contract.getAllFeedback();

    feedbackList.innerHTML = '';
    for (let i = 0; i < senders.length; i++) {
        const li = document.createElement('li');
        li.textContent = `${senders[i]}: ${messages[i]} (Timestamp: ${timestamps[i]})`;
        feedbackList.appendChild(li);
    }
}

getFeedbacks();
