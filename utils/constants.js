/**
 * Application-wide constants
 */

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized request',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists with this email or name',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_REQUEST: 'Invalid request',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
};

const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  USER_RETRIEVED: 'User retrieved successfully',
  CHIPS_ADDED: 'Chips added successfully',
  LEDGER_RETRIEVED: 'Ledger is retrieved successfully',
  LEDGER_TRANSACTION_RETRIEVED: 'Transaction is retrieved successfully',
};

const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
};

const TRANSACTION_TYPES = {
  BUY_IN: 'buy_in',
  CASH_OUT: 'cash_out',
  FREE_CHIPS: 'free_chips',
  WIN: 'win',
  LOSS: 'loss',
};

const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  TRANSACTION_TYPES,
  PAGINATION,
};
