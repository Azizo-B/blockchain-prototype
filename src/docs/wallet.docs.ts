/**
 * @swagger
 * components:
 *   schemas:
 *     Wallet:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "saved-wallet-123"
 *         address:
 *           type: string
 *           example: "My Wallet Address"
 *     WalletWithBalance:
 *       allOf:
 *         - $ref: '#/components/schemas/Wallet'
 *         - type: object
 *           properties:
 *             balance:
 *               type: integer
 *               example: 101
 *     WalletList:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Wallet'
 *   responses:
 *     WalletCreated:
 *       description: Wallet successfully created
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wallet'
 *     WalletsRetrieved:
 *       description: Successfully retrieved all wallets
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WalletList'
 *     WalletRetrieved:
 *       description: Successfully retrieved wallet
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WalletWithBalance'
 */

/**
 * @swagger
 * paths:
 *   /api/wallets:
 *     post:
 *       tags:
 *         - Wallets
 *       summary: Create a new wallet
 *       description: >
 *         Creates a new wallet on the blockchain.
 *         This wallet will be associated with a unique blockchain address
 *         and can store digital assets. Keep the private key safe as it will
 *         be needed when signing off on transactions.
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/WalletCreated'
 *         '500':
 *           $ref: '#/components/responses/InternalServerError'
 *     get:
 *       tags:
 *         - Wallets
 *       summary: Retrieve all wallets
 *       description: >
 *         Retrieves a list of all wallets from the blockchain, including their
 *         associated addresses. This allows an overview of all wallet addresses
 *         in the system.
 *       responses:
 *         '200':
 *           $ref: '#/components/responses/WalletsRetrieved'
 *         '500':
 *           $ref: '#/components/responses/InternalServerError'
 *   /api/wallets/{id}:
 *     get:
 *       tags:
 *         - Wallets
 *       summary: Retrieve a wallet by ID
 *       description: >
 *         Retrieves a specific wallet by its ID from the blockchain. Use this
 *         endpoint to fetch the wallet and its balance using a unique wallet ID.
 *       parameters:
 *         - $ref: '#/components/parameters/EntityId'
 *       responses:
 *         '200':
 *           $ref: '#/components/responses/WalletRetrieved'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/InternalServerError'
 *     delete:
 *       tags:
 *         - Wallets
 *       summary: Delete a wallet by ID
 *       description: >
 *         Delete a specific wallet by its ID from the blockchain.
 *       parameters:
 *         - $ref: '#/components/parameters/EntityId'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 privateKey:
 *                   type: string
 *                   example: "private key 1"
 *       responses:
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/InternalServerError'
 */
