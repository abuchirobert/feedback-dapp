// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Feedback {

  // Structure to hold each feedback message
  struct Message {
    address author;
    string content;
    uint256 timestamp;
  }

  // Array to store all feedback messages
  Message[] public messages;

  // Function to add a new feedback message
  function addFeedback(string memory _content) public {
    messages.push(Message(msg.sender, _content, block.timestamp));
  }

  // Function to retrieve all feedback messages
 /*
  function getFeedback() public view returns (Message[] memory) {
    return messages;
  } */

  function getFeedback(uint256 _index) public view returns (address, string memory, uint256){
    Message memory item = messages[_index];

    return(item.author, item.content, item.timestamp);
  }
}
