const express = require('express');
const router = express.Router();
const validateToken = require('../../middleware/auth');
const { getLedger, getTransaction } = require('../../controllers/ledger');

// GET /api/ledger          – paginated transaction list
router.get('/', validateToken, getLedger);

// GET /api/ledger/:txId    – single transaction
router.get('/:txId', validateToken, getTransaction);

module.exports = router;
