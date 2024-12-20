import ServiceError from "../core/serviceError";

export default function handleDBError(error: any): never {
  const { code = "", message } = error;

  if (code === "P2002") {
    switch (true) {
      case message.includes("idx_user_email_unique"):
        throw ServiceError.validationFailed("There is already a user with this email address");
      case message.includes("idx_wallet_address_unique"):
        throw ServiceError.validationFailed("A wallet with this address already exists.");
      case message.includes("idx_unique_saved_wallet"):
        throw ServiceError.validationFailed("Wallet already saved.");
      default:
        throw ServiceError.validationFailed("This item already exists");
    }
  }

  if (code === "P2025") {
    switch (true) {
      case message.includes("fk_transaction_user"):
        throw ServiceError.notFound("This user does not exist");
      case message.includes("transaction"):
        throw ServiceError.notFound("No transaction with this id exists");
      case message.includes("user"):
        throw ServiceError.notFound("No user with this id exists");
      case message.includes("wallet"):
        throw ServiceError.notFound("No wallet with this id exists");
    }
  }

  if (code === "P2003") {
    switch (true) {
      case message.includes("blockId"):
        throw ServiceError.conflict("Invalid block ID reference in transactions.");
    }
  }

  if (code === "P2014") {
    throw ServiceError.conflict(
      "This entity is related to another entity. Please delete or unlink the related entity first.",
    );
  }
  
  throw error;
};
