// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Feedback {
    struct FeedbackEntry {
        address sender;
        string message;
        uint256 timestamp;
    }

    FeedbackEntry[] public feedbacks;

    event FeedbackReceived(address indexed sender, string message, uint256 timestamp);

    function submitFeedback(string calldata _message) external {
        FeedbackEntry memory newFeedback = FeedbackEntry(msg.sender, _message, block.timestamp);
        feedbacks.push(newFeedback);
        emit FeedbackReceived(msg.sender, _message, block.timestamp);
    }

    function getAllFeedback() external view returns (FeedbackEntry[] memory) {
        return feedbacks;
    }
}
