const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust the path to your User model if necessary

// POST emblems/send
router.post('/send', async (req, res) => {
  const { senderId, recipientId, reason } = req.body;

  try {
    // Update sender: increment emblemsSent
    const sender = await User.findByIdAndUpdate(
      senderId,
      { $inc: { emblemsSent: 1 } },
      { new: true } // Return the updated document
    );

    // Update recipient: add to emblemsReceived
    const recipient = await User.findByIdAndUpdate(
      recipientId,
      {
        $push: {
          emblemsReceived: { from: senderId, reason, date: new Date() },
        },
      },
      { new: true } // Return the updated document
    );

    // Ensure sender and recipient exist
    if (!sender || !recipient) {
      return res.status(404).json({ message: 'Sender or recipient not found.' });
    }

    res.status(200).json({
      message: 'Emblem sent successfully!',
      sender,
      recipient,
    });
  } catch (error) {
    console.error('Error sending emblem:', error);
    res.status(500).json({ message: 'An error occurred while sending the emblem.' });
  }
});


module.exports = router;
