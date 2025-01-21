// pointTransactions.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust path as needed

// Point transfer route
router.post('/point-transfer', async (req, res) => {
  const { senderUsername, recipients, pointAmount } = req.body;
  
  if (!senderUsername || !recipients || !pointAmount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Find sender
    const sender = await User.findOne({ username: senderUsername });
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    if (!sender.isManagement || sender.recognizeNowBalance < pointAmount * recipients.length) {
      return res.status(400).json({ 
        message: 'Insufficient RecognizeNow balance or unauthorized'
      });
    }

    // Update sender's balance
    await User.findOneAndUpdate(
      { username: senderUsername },
      { $inc: { recognizeNowBalance: -(pointAmount * recipients.length) } }
    );

    // Update recipients' balances
    for (const username of recipients) {
      await User.findOneAndUpdate(
        { username },
        { $inc: { currentPointBalance: pointAmount } }
      );
    }

    // Get updated sender data
    const updatedSender = await User.findOne({ username: senderUsername });

    res.status(200).json({
      message: 'Points transferred successfully',
      newSenderBalance: updatedSender.recognizeNowBalance
    });

  } catch (error) {
    console.error('Point transfer error:', error);
    res.status(500).json({ message: 'Error processing point transfer' });
  }
});

module.exports = router;