/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the transaction.
 *         type:
 *           type: string
 *           enum:
 *             - transfer
 *             - nft_transfer
 *             - minting
 *             - block_reward
 *           description: The type of transaction.
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - completed
 *             - canceled
 *           description: The status of transaction.
 *         amount:
 *           type: number
 *           format: float
 *           description: The amount of value involved in the transaction.
 *         fromAddress:
 *           type: string
 *           description: The address from which the funds are transferred (optional).
 *         toAddress:
 *           type: string
 *           description: The address to which the funds are transferred.
 *         signature:
 *           type: string
 *           description: The signature for the transaction (optional).
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the transaction.
 *         blockId:
 *           type: string
 *           description: The ID of the block this transaction is part of (optional).
 *         nftId:
 *           type: string
 *           description: The ID of the NFT associated with this transaction (optional).
 *       required:
 *         - id
 *         - type
 *         - amount
 *         - toAddress
 *         - timestamp
 *     PublicTransaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the transaction.
 *         type:
 *           type: string
 *           enum:
 *             - transfer
 *             - nft_transfer
 *             - minting
 *             - block_reward
 *           description: The type of transaction.
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - completed
 *             - canceled
 *           description: The status of transaction.
 *         amount:
 *           type: number
 *           format: float
 *           description: The amount of value involved in the transaction.
 *         fromAddress:
 *           type: string
 *           description: The address from which the funds are transferred (optional).
 *         toAddress:
 *           type: string
 *           description: The address to which the funds are transferred.
 *         signature:
 *           type: string
 *           description: The signature for the transaction (optional).
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the transaction.
 *       required:
 *         - id
 *         - type
 *         - amount
 *         - toAddress
 *         - timestamp
 *     TransactionGetById:
 *       allOf:
 *         - $ref: '#/components/schemas/PublicTransaction'
 *         - type: object
 *           properties:
 *             block:
 *               $ref: '#/components/schemas/BlockBase'
 *             nft:
 *               $ref: '#/components/schemas/NFT'
 *     CreateTransactionInput:
 *       type: object
 *       properties:
 *         tx:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *               format: float
 *               description: The amount of value involved in the transaction.
 *             fromAddress:
 *               type: string
 *               description: The address from which the funds are transferred.
 *             toAddress:
 *               type: string
 *               description: The address to which the funds are transferred.
 *           required:
 *             - amount
 *             - fromAddress
 *             - toAddress
 *           description: The transaction data for creating a new transaction.
 *         privateKey:
 *           type: string
 *           description: Private key associated with the transaction, required for validation.
 *       required:
 *         - tx
 *         - privateKey
 *     TransactionList:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PublicTransaction'
 *   responses:
 *     TransactionCreated:
 *       description: Transaction successfully created
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PublicTransaction'
 *     TransactionsRetrieved:
 *       description: Successfully retrieved all transactions
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionList'
 *     TransactionRetrieved:
 *       description: Successfully retrieved transaction
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionGetById'
 * paths:
 *   /api/transactions:
 *     post:
 *       tags:
 *         - Transactions
 *       summary: Create a new transaction
 *       description: >
 *         Creates a new transaction that will be added to the blockchain as part of the next block.
 *         This endpoint requires the transaction data and a private key is required for authorization..
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateTransactionInput'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/TransactionCreated'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '500':
 *           $ref: '#/components/responses/InternalServerError'
 *     get:
 *       tags:
 *         - Transactions
 *       summary: Retrieve all transactions
 *       description: >
 *         Retrieves a list of all transactions, including pending transactions, on the blockchain.
 *       responses:
 *         '200':
 *           $ref: '#/components/responses/TransactionsRetrieved'
 *         '500':
 *           $ref: '#/components/responses/InternalServerError'
 *   /api/transactions/{id}:
 *     get:
 *       tags:
 *         - Transactions
 *       summary: Retrieve a transaction by ID
 *       description: >
 *         Retrieves details of a specific transaction using its unique identifier.
 *       parameters:
 *         - $ref: '#/components/parameters/EntityId'
 *       responses:
 *         '200':
 *           $ref: '#/components/responses/TransactionRetrieved'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/InternalServerError'
 *     delete:
 *       tags:
 *         - Transactions
 *       summary: Delete a transaction by ID
 *       description: >
 *         Removes a specific transaction using its ID. Only pending transactions can be deleted,
 *         confirmed transactions on the blockchain are immutable. A private key is required for authorization.
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
 *         '204':
 *           description: Transaction successfully deleted.
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/InternalServerError'
 */
