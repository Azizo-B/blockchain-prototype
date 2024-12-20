/**
 * @swagger
 * components:
 *   schemas:
 *     NFT:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the NFT
 *         metadata:
 *           type: object
 *           description: Metadata of the NFT (e.g., name, description, image URL, etc.)
 *         burned:
 *           type: boolean
 *           description: Whether the NFT has been burned (i.e., destroyed)
 *         ownerId:
 *           type: string
 *           description: ID of the owner of the NFT
 *         creatorId:
 *           type: string
 *           description: ID of the creator of the NFT
 *       required:
 *         - id
 *         - metadata
 *         - walletId
 *         - burned
 *         - ownerId
 *         - creatorId

 *     CreateNFTRequest:
 *       type: object
 *       required:
 *         - metadata
 *         - privateKey
 *         - walletId
 *       properties:
 *         metadata:
 *           type: object
 *           description: Metadata of the NFT
 *         walletId:
 *           type: string
 *           description: Wallet ID of the wallet to associated with the NFT
 *         privateKey:
 *           type: string
 *           description: Private key of the wallet

 *     CreateNFTResponse:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/NFT'

 *     GetAllNFTsResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NFT'

 *     GetNFTByIdResponse:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/NFT'

 *     DeleteNFTRequest:
 *       type: object
 *       required:
 *         - privateKey
 *       properties:
 *         privateKey:
 *           type: string
 *           description: Private key for wallet authorization
 */

/**
 * @swagger
 * /api/nfts:
 *   post:
 *     tags:
 *       - NFT
 *     summary: Create a new NFT
 *     description: Create a new NFT, private key is required for authorization.
 *     requestBody:
 *       description: NFT creation payload
 *       required: true
 *       content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateNFTRequest'
 *     responses:
 *       201:
 *         description: NFT successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NFT'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @swagger
 * /api/nfts:
 *   get:
 *     tags:
 *       - NFT
 *     summary: Get all NFTs
 *     description: Retrieve all NFTs from the system.
 *     responses:
 *       200:
 *         description: A list of NFTs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetAllNFTsResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
*/

/**
 * @swagger
 * /api/nfts/{id}:
 *   get:
 *     tags:
 *       - NFT
 *     summary: Get NFT by ID
 *     description: Retrieve an NFT by its unique ID.
 *     parameters:
 *       - $ref: '#/components/parameters/EntityId'
 *     responses:
 *       200:
 *         description: NFT found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NFT'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/nfts/{id}:
 *   delete:
 *     tags:
 *       - NFT
 *     summary: Delete an NFT
 *     description: Delete an NFT by its unique ID, private key is required for authorization.
 *     parameters:
 *       - $ref: '#/components/parameters/EntityId'
 *     requestBody:
 *       description: Payload to validate the deletion request
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privateKey:
 *                 type: string
 *                 description: Private key for wallet authorization
 *     responses:
 *       204:
 *         description: NFT successfully deleted
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
