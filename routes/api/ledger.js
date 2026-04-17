const express = require('express');
const router = express.Router();
const validateToken = require('../../middleware/auth');
const { getLedger, getTransaction } = require('../../controllers/ledger');

// GET /api/ledger -- Transaction List in Paginated Format
router.get('/', validateToken, getLedger);

// GET /api/ledger/:transactionId -- Transaction Details
router.get('/:transactionId', validateToken, getTransaction);

module.exports = router;
