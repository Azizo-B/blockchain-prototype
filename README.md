# Blockchain API Project  

A RESTful API built with **Node.js** and **TypeScript**, showcasing a foundational understanding of blockchain principles such as wallet management, transaction handling, and block creation. While the initial aim was to develop a fully decentralized peer-to-peer system, this centralized implementation aligns with academic requirements. The development journey was a transformative learning experience, transitioning from Python-based frameworks like Flask, Django, and FastAPI to the **Node.js** ecosystem with **TypeScript**, while also deepening my expertise in blockchain concepts.

## Project Overview  

### Key Features  

- **Wallet Management**: Create and manage wallets securely.  
- **Transaction Execution**: Perform transactions with cryptographic signatures.  
- **Block Creation**: Store transactions in blocks linked by hashes, ensuring immutability and integrity.  
- **Role-Based Access Control**: Protect sensitive routes using role-based permissions.  
- **Swagger Documentation**: Explore the API with user-friendly, auto-generated documentation.  

### Technical Highlights  

- **Node.js and TypeScript**: Combined the flexibility of Node.js with the type safety of TypeScript for a robust backend.  
- **Blockchain Logic**: Implemented cryptographic hashing and linked data structures.  
- **Modular Design**: Ensured a clean, scalable, and maintainable codebase.  

## Potential Enhancements

### Decentralized Peer-to-Peer Implementation
- Transform the project into a fully decentralized blockchain system using a peer-to-peer network.
- Minimize the API to focus solely on core blockchain components, such as transactions, blocks, and wallets, removing features like user management and saved wallets.

### Improved Type Definitions
- Enhance type definitions across the codebase for better clarity, safety, and maintainability.
- Improve the naming of type definitions for better readability and consistency.

### Comprehensive Testing
- Refactor and expand the test suite to include more robust and edge-case scenarios.
- Transition from loose testing policies to a stricter and more comprehensive testing approach.

### API Optimization
- Optimize the API structure to align with a peer-to-peer model, allowing peers to independently run and manage their own transactions and blocks.


## Requirements  

Ensure the following software is installed:  

- [Node.js](https://nodejs.org)  
- [Yarn](https://yarnpkg.com)  

A MongoDB database is required. You can use:  
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosting  


## Getting Started  

### 1. Install Dependencies  

Run the following command to install all required dependencies:  

```bash
yarn install
```  

### 2. Configure Environment Variables  

Create a `.env` file in the project root with the following values:  

```env
NODE_ENV="development" # Change to "production" for production
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
PORT="9000" # Optional for production
AUTH_JWT_SECRET="jwt-secret" # Required for authentication in production
```  

### 3. Sync Database Schema  

Use Prisma to synchronize the database schema:  

```bash
yarn migrate:dev
```  

### 4. Seed the Database (Optional for Development)  

Seed the database with initial data:  

```bash
yarn seed
```  

### 5. Start the Application  

Run the application in development mode:  

```bash
yarn start:dev
```  

For production, build and start the application:  

```bash
yarn build  
yarn start  
```  

### 6. Access API Documentation  

The API documentation is available at:  

[http://localhost:9000/swagger](http://localhost:9000/swagger)  


## Testing  

### 1. Configure Test Environment  

Create a `.env.test` file for test-specific configurations:  

```env
NODE_ENV="testing"
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
PORT="9000"
```  

### 2. Run Tests  

Execute the test suite:  

```bash
yarn test
```  

### 3. Generate Test Coverage Report  

Generate a test coverage report:  

```bash
yarn test:coverage
```  

The coverage report will be available in the `__tests__/coverage` directory.  