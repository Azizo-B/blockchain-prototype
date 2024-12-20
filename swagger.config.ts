import config from "config";
const PORT = config.get<number>("port");

export default {
  failOnErrors: true,
  apis: ["./src/docs/*.ts"],
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blockchain Prototype API",
      version: "0.1.0",
      description: "A prototype used to explore the fundamentals of blockchain and blockchain development.",
    },
    servers: [{ url: `http://localhost:${PORT}/` }, {url: "https://frontendweb-2425-azizo-b.onrender.com"}],
  },
};
