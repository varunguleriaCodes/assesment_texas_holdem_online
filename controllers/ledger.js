const mockDataStore = require('../utils/mockData');
const { asyncHandler, NotFoundError } = require('../utils/errors');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, PAGINATION } = require('../utils/constants');


/**
 * @route   GET /api/ledger
 * @desc    Get paginated transaction history for authenticated user
 * @access  Private
 */
// Used to get the whole list of transactions for a user in paginated form.
exports.getLedger = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
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
        total,limit,offset,
        hasMore: offset + limit < total,
      },
    },
    SUCCESS_MESSAGES.LEDGER_RETRIEVED,
    HTTP_STATUS.OK,
  );

});

/**
 * @route   GET /api/ledger/:transactionId
 * @desc    Get a transaction by ID for authenticated user
 * @access  Private
 */
// Used to get Details of a single transaction.
exports.getTransaction = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  const transaction = mockDataStore.ledger.findByTransactionIdAndUserId(transactionId, req?.user?.id);

  if (!transaction) {
    throw new NotFoundError(ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
  }


  return sendSuccess(
    res,
    transaction,
    SUCCESS_MESSAGES.LEDGER_TRANSACTION_RETRIEVED,
    HTTP_STATUS.OK,
  );
});
