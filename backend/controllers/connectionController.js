const Connection = require('../models/Connection');

const sendConnectionRequest = async (req, res, next) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'receiverId is required.' });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({ message: 'You cannot send a connection request to yourself.' });
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id }
      ]
    });

    if (existingConnection) {
      return res.status(409).json({ message: 'Connection request already exists.' });
    }

    const connection = await Connection.create({
      sender: req.user.id,
      receiver: receiverId,
      status: 'pending'
    });

    return res.status(201).json({
      message: 'Connection request sent.',
      connection
    });
  } catch (error) {
    next(error);
  }
};

const acceptConnectionRequest = async (req, res, next) => {
  try {
    const { connectionId } = req.body;

    if (!connectionId) {
      return res.status(400).json({ message: 'connectionId is required.' });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found.' });
    }

    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the receiver can accept this request.' });
    }

    connection.status = 'accepted';
    await connection.save();

    return res.json({
      message: 'Connection request accepted.',
      connection
    });
  } catch (error) {
    next(error);
  }
};

const listConnections = async (req, res, next) => {
  try {
    const acceptedConnections = await Connection.find({
      status: 'accepted',
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .populate('sender', 'name title profilePicture')
      .populate('receiver', 'name title profilePicture')
      .sort({ updatedAt: -1 });

    return res.json(acceptedConnections);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendConnectionRequest,
  acceptConnectionRequest,
  listConnections
};
