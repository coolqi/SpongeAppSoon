export const handleError = async (error: any, provider: any) => {
  let txSignature = '';
        if (error.message?.includes("already been processed")) {
        // If we have a valid signature in the error, use it
        if (
          error.signature &&
          typeof error.signature === "string" &&
          error.signature.length > 0
        ) {
          try {
            const status = await provider.connection.getSignatureStatus(
              error.signature
            );
            if (status?.value?.confirmationStatus === "confirmed") {
              txSignature = error.signature;
            } else {
              throw error;
            }
          } catch (statusError) {
            // If we can't get the status, just use the signature
            txSignature = error.signature;
          }
        } else {
          if (!error.signature) {
            return;
          }
          throw error;
        }
      }
      // Ignore timeout errors
      else if (error.message?.includes("Transaction was not confirmed")) {
        if (
          error.signature &&
          typeof error.signature === "string" &&
          error.signature.length > 0
        ) {
          txSignature = error.signature;
        } else {
          throw error;
        }
      } else {
        throw error;
      }
      return txSignature;
}