const config = require('../config');
const {TRANSACTION_TYPES} = require('./constants');
/**
 * In-memory mock data store for demo purposes
 * This replaces database operations for the demo project
 */

let users = [];
let nextUserId = 1;

/**
 * Initialize mock data with demo users
 */
const initializeMockData = () => {
  users = [
    {
      id: '1',
      name: 'Demo Player 1',
      email: 'player1@demo.com',
      password: 'hashed_password_demo', // In production, this would be hashed
      chipsAmount: config.INITIAL_CHIPS_AMOUNT,
      type: 0,
      created: new Date(),
    },
    {
      id: '2',
      name: 'Demo Player 2',
      email: 'player2@demo.com',
      password: 'hashed_password_demo',
      chipsAmount: config.INITIAL_CHIPS_AMOUNT,
      type: 0,
      created: new Date(),
    },
  ];
  nextUserId = 3;
};


let transactions = [];
let nextTransactionId = 1;

/**
 * Initialize mock ledger data with demo transactions for users.
 */
const initializeLedger = () => {
  transactions = [
    {
      id: String(nextTransactionId++),
      userId: '1',
      type: TRANSACTION_TYPES.BUY_IN,
      amount: 1000,
      balance: 1000,
      description: 'Initial buy-in',
      tableId: 'table-1',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: String(nextTransactionId++),
      userId: '1',
      type: TRANSACTION_TYPES.WIN,
      amount: 250,
      balance: 1250,
      description: 'Won hand',
      tableId: 'table-1',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: String(nextTransactionId++),
      userId: '1',
      type: TRANSACTION_TYPES.LOSS,
      amount: -400,
      balance: 850,
      description: 'Lost hand',
      tableId: 'table-1',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: String(nextTransactionId++),
      userId: '1',
      type: TRANSACTION_TYPES.FREE_CHIPS,
      amount: 1000,
      balance: 1850,
      description: 'Free chips awarded',
      tableId: null,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: String(nextTransactionId++),
      userId: '1',
      type: TRANSACTION_TYPES.CASH_OUT,
      amount: -1850,
      balance: 0,
      description: 'Cash-out',
      tableId: 'table-1',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: String(nextTransactionId++),
      userId: '2',
      type: TRANSACTION_TYPES.BUY_IN,
      amount: 1000,
      balance: 1000,
      description: 'Initial buy-in',
      tableId: 'table-2',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: String(nextTransactionId++),
      userId: '2',
      type: TRANSACTION_TYPES.WIN,
      amount: 500,
      balance: 1500,
      description: 'Won hand',
      tableId: 'table-2',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];
};

// Initialize on module load
initializeMockData();
initializeLedger();

/**
 * Mock Data Store
 * Provides database-like operations for demo purposes
 */
const mockDataStore = {
  users: {
    /**
     * Find user by ID
     * @param {string} id - User ID
     * @returns {Object|null} User object or null
     */
    findById: (id) => {
      if (!id) return null;
      return users.find((user) => user.id === String(id)) || null;
    },

    /**
     * Find user by query (email or name)
     * @param {Object} query - Query object with email or name
     * @returns {Object|null} User object or null
     */
    findOne: (query) => {
      if (!query) return null;

      if (query.email) {
        return users.find((user) => user.email.toLowerCase() === query.email.toLowerCase().trim()) || null;
      }
      if (query.name) {
        return users.find((user) => user.name.toLowerCase() === query.name.toLowerCase().trim()) || null;
      }
      return null;
    },

    /**
     * Create new user
     * @param {Object} userData - User data object
     * @returns {Object} Created user object
     */
    create: (userData) => {
      if (!userData || !userData.email || !userData.name) {
        throw new Error('Invalid user data');
      }

      const newUser = {
        id: String(nextUserId++),
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        chipsAmount: userData.chipsAmount || config.INITIAL_CHIPS_AMOUNT,
        type: userData.type || 0,
        created: new Date(),
      };

      users.push(newUser);
      return newUser;
    },

    /**
     * Update user by ID
     * @param {string} id - User ID
     * @param {Object} updateData - Data to update
     * @returns {Object|null} Updated user object or null
     */
    update: (id, updateData) => {
      if (!id || !updateData) return null;

      const userIndex = users.findIndex((user) => user.id === String(id));
      if (userIndex === -1) return null;

      // Merge update data with existing user
      users[userIndex] = {
        ...users[userIndex],
        ...updateData,
        // Preserve immutable fields
        id: users[userIndex].id,
        created: users[userIndex].created,
      };

      return users[userIndex];
    },

    /**
     * Get user without sensitive password field
     * @param {Object} user - User object
     * @returns {Object|null} User object without password
     */
    getUserWithoutPassword: (user) => {
      if (!user) return null;
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },

    /**
     * Get all users (for admin purposes)
     * @returns {Array} Array of users without passwords
     */
    findAll: () => {
      return users.map((user) => mockDataStore.users.getUserWithoutPassword(user));
    },

    /**
     * Reset mock data to initial state
     */
    reset: () => {
      initializeMockData();
        },
  },

  ledger: {
    /**
     * Get transactions for a user in sorted order with newest first.
     * @param {string} userId
     * @param {Object} userTransactionOptions - Contains limit and offset for pagination
     * @returns {{ transactions: Array, total: number }}
     */
    findByUserId: (userId, userTransactionOptions = {}) => {
      const { limit = 20, offset = 0 } = userTransactionOptions;
      if (!userId) return { transactions: [], total: 0 };
      const userTxs = transactions
        .filter((tx) => tx.userId === String(userId))
        .sort((a, b) => b.createdAt - a.createdAt);
      return {
        transactions: userTxs.slice(offset, offset + limit),
        total: userTxs.length,
      };
    },

    /**
     * Get a single transaction by ID, only if it belongs to userId.
     * @param {string} transactionId
     * @param {string} userId
     * @returns {Object|null}
     */
    findByTransactionIdAndUserId: (transactionId, userId) => {
      if (!transactionId || !userId) return null;
      return (
        transactions.find(
          (tx) => tx.id === String(transactionId) && tx.userId === String(userId),
        ) || null
      );
    },

    /**
     * Append a new transaction.
     * @param {Object} transactionData
     * @returns {Object} Created transaction
     */
    create: (transactionData) => {
      const tx = {
        id: String(nextTransactionId++),
        userId: String(transactionData.userId),
        type: transactionData.type,
        amount: transactionData.amount,
        balance: transactionData.balance,
        description: transactionData.description || '',
        tableId: transactionData.tableId || null,
        createdAt: new Date(),
      };
      transactions.push(tx);
      return tx;
    },
        /**
     * Reset mock transaction data to initial state
     */
    reset: () => {
      initializeLedger();    },
  },
};

module.exports =  mockDataStore ;
