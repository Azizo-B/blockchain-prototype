/**
 * @swagger
 * tags:
 *   - name: Sessions
 *     description: Represents sessions in the system
 *   - name: Users
 *     description: Represents users in the system
 *   - name: Wallets
 *     description: Represents wallets in the system
 *   - name: Saved Wallets
 *     description: Represents saved wallets in the system
 *   - name: Transactions
 *     description: Represents transactions in the system
 *   - name: NFT
 *     description: Represents Non-Fungible Tokens (NFTs) in the system
 *   - name: Blocks
 *     description: Represents blocks in the system
 * 
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   parameters:
 *     EntityId:
 *       name: id
 *       in: path
 *       required: true
 *       description: ID of the entity
 *       schema:
 *         type: string
 *   schemas:
 *    TokenResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *   responses:
 *     NotFound:
 *       description: Entity not found
 *     BadRequest:
 *       description: Bad Request - Invalid input data
 *     InternalServerError:
 *       description: Internal Server Error
 *     Unauthorized:
 *       description: Unauthorized - Invalid or missing authentication
*/