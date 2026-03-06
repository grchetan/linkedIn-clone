const express = require('express');
const {
  sendConnectionRequest,
  acceptConnectionRequest,
  listConnections
} = require('../controllers/connectionController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send', authenticate, sendConnectionRequest);
router.post('/accept', authenticate, acceptConnectionRequest);
router.get('/list', authenticate, listConnections);

module.exports = router;
