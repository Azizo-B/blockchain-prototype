/**
 * @swagger
 * 
 * components:
 *   schemas:
 *     BlockBase:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the block.
 *         index:
 *           type: integer
 *           description: The index of the block in the blockchain.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the block was created.
 *         previousHash:
 *           type: string
 *           description: The hash of the previous block.
 *         hash:
 *           type: string
 *           description: The hash of the current block.
 *         nonce:
 *           type: integer
 *           description: The nonce used in mining the block.
 *       required:
 *         - id
 *         - index
 *         - timestamp
 *         - previousHash
 *         - hash
 *         - nonce
 *     BlockWithTransactions:
 *       allOf:
 *         - $ref: '#/components/schemas/BlockBase'
 *         - type: object
 *           properties:
 *             transactions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *               description: List of transactions included in this block.
 *   responses:
 *     BlockCreated:
 *       description: Block successfully created and added to the blockchain, along with pending transactions.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlockWithTransactions'
 *     BlocksRetrieved:
 *       description: Blocks successfully retrieved.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BlockBase'
 *     BlockRetrieved:
 *       description: Block successfully retrieved, along with its transactions.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlockWithTransactions'
 * 
 * /api/blocks:
 *   post:
 *     tags:
 *       - Blocks
 *     summary: Add a block with pending transactions to the blockchain
 *     description: Creates a new block in the blockchain, including all pending transactions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: The public wallet address of the miner who is adding the block to the blockchain
 *             required:
 *               - walletAddress
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BlockCreated'
 *       400:
 *         description: Bad Request - Invalid miner address or other input validation failure.
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   get:
 *     tags:
 *       - Blocks
 *     summary: Get all blocks
 *     description: Retrieve all blocks from the blockchain
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BlocksRetrieved'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * 
 * /api/blocks/{id}:
 *   get:
 *     tags:
 *       - Blocks
 *     summary: Get a single block
 *     description: Retrieve a block by its ID, including transactions written on that block.
 *     parameters:
 *         - $ref: '#/components/parameters/EntityId'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BlockRetrieved'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
