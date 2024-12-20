/**
 * @swagger
 * components:
 *   parameters:
 *     walletIdParam:
 *       name: walletId
 *       in: path
 *       required: true
 *       description: The unique identifier for the wallet
 *       schema:
 *         type: string
 *     userIdParam:
 *       name: userId
 *       in: path
 *       required: true
 *       description: The unique identifier for the user
 *       schema:
 *         type: string
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         wallets:
 *           type: array
 *           items:
 *              $ref: "#/components/schemas/WalletWithBalance"
 *           
 *            
 *  
 *     PublicUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *     CreateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "password123" 
 *     UsersList:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/PublicUser"
 *       required:
 *         - items
 *     SavedWallet:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "abc123"
 *         alias:
 *           type: string
 *           example: "My Wallet"
 *         wallet:
 *           type: object
 *           properties:
 *              address:
 *                  type: string
 *                  example: "123"
 *     SavedWalletWithBalance:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "abc123"
 *         alias:
 *           type: string
 *           example: "My Wallet"
 *         wallet:
 *           type: object
 *           properties:
 *              address:
 *                  type: string
 *                  example: "123"
 *              balance:
 *                  type: number
 *                  example: 1000000
 *     SavedWalletCreateInput:
 *       type: object
 *       properties:
 *         alias:
 *           type: string
 *           example: "My Wallet"
 *         walletId:
 *           type: string
 *           example: "123"
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       description: The user's data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateUserInput"
 *     responses:
 *       200:
 *         description: A JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *           $ref: '#/components/responses/BadRequest'
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersList"
 *       401:
 *           $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user
 *     description: Get a single user by their id or your own information if you use 'me' as the id
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/EntityId"
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *           $ref: '#/components/responses/BadRequest'
 *       401:
 *           $ref: '#/components/responses/Unauthorized'
 *       404:
 *           $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update an existing user
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/EntityId"
 *     requestBody:
 *       description: The user's data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateUserInput"
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PublicUser"
 *       400:
 *           $ref: '#/components/responses/BadRequest'
 *       401:
 *           $ref: '#/components/responses/Unauthorized'
 *       404:
 *           $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/EntityId"
 *     responses:
 *       204:
 *         description: No response, the delete was successful
 *       400:
 *           $ref: '#/components/responses/BadRequest'
 *       401:
 *           $ref: '#/components/responses/Unauthorized'
 *       404:
 *           $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /api/users/{userId}/saved-wallets:
 *   post:
 *     summary: Create a saved wallet for a user
 *     description: Adds a new saved wallet to the user's account.
 *     tags: [Saved Wallets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/userIdParam"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SavedWalletCreateInput"
 *     responses:
 *       201:
 *         description: Saved wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SavedWalletWithBalance"
 *       400:
 *           $ref: '#/components/responses/BadRequest'
 *       401:
 *           $ref: '#/components/responses/Unauthorized'
 */
/**
 * @swagger
 * /api/users/{userId}/saved-wallets:
 *   get:
 *     summary: Get all saved wallets for a user
 *     description: Retrieve all saved wallets associated with a specific user.
 *     tags: [Saved Wallets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/userIdParam"
 *     responses:
 *       200:
 *         description: List of saved wallets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/SavedWallet"
 *       401:
 *           $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /api/users/{userId}/saved-wallets/{walletId}:
 *   get:
 *     summary: Get a specific saved wallet
 *     description: Retrieve details of a specific saved wallet by user ID and wallet ID.
 *     tags: [Saved Wallets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/userIdParam"
 *       - $ref: "#/components/parameters/walletIdParam"
 *     responses:
 *       200:
 *         description: Saved wallet details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SavedWalletWithBalance"
 *       400:
 *           $ref: '#/components/responses/BadRequest'
 *       401:
 *           $ref: '#/components/responses/Unauthorized'
 *       404:
 *           $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /api/users/{userId}/saved-wallets/{walletId}:
 *   put:
 *     summary: Update the alias of a saved wallet
 *     description: Update the alias of an existing saved wallet.
 *     tags: [Saved Wallets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/userIdParam"
 *       - $ref: "#/components/parameters/walletIdParam"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Updated Wallet Alias"
 *     responses:
 *       200:
 *         description: Saved wallet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SavedWallet"
 *       400:
 *           $ref: '#/components/responses/BadRequest'
 *       401:
 *           $ref: '#/components/responses/Unauthorized'
 *       404:
 *           $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /api/users/{userId}/saved-wallets/{walletId}:
 *   delete:
 *     summary: Delete a saved wallet
 *     description: Remove a saved wallet by user ID and wallet ID.
 *     tags: [Saved Wallets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/userIdParam"
 *       - $ref: "#/components/parameters/walletIdParam"
 *     responses:
 *       204:
 *         description: No response, the delete was successful
 *       400:
 *           $ref: '#/components/responses/BadRequest'
 *       401:
 *           $ref: '#/components/responses/Unauthorized'
 *       404:
 *           $ref: '#/components/responses/NotFound'
 */
