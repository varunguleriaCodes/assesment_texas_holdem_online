const { mockDataStore } = require('../utils/mockData');
const { asyncHandler, NotFoundError } = require('../utils/errors');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * @route   GET /api/ledger
 * @desc    Get paginated transaction history for the authenticated user
 * @access  Private
 * @query   limit {number}  Records per page (default 20, max 100)
 * @query   offset {number} Number of records to skip (default 0)
 */
exports.getLedger = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

  const { transactions, total } = mockDataStore.ledger.findByUserId(req.user.id, {
    limit,
    offset,
  });

  return sendSuccess(
    res,
    {
      transactions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    },
    SUCCESS_MESSAGES.LEDGER_RETRIEVED,
    HTTP_STATUS.OK
  );
});

/**
 * @route   GET /api/ledger/:txId
 * @desc    Get a single transaction by ID for the authenticated user
 * @access  Private
 */
exports.getTransaction = asyncHandler(async (req, res) => {
  const { txId } = req.params;

  const transaction = mockDataStore.ledger.findByIdAndUserId(txId, req.user.id);

  if (!transaction) {
    throw new NotFoundError(ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
  }

  return sendSuccess(
    res,
    { transaction },
    SUCCESS_MESSAGES.LEDGER_TX_RETRIEVED,
    HTTP_STATUS.OK
  );
});
