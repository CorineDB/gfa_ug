export const CODE = {
  ERR_BAD_REQUEST: "ERR_BAD_REQUEST",
};

export const messageError = (error) => {
  return error.response.data.message;
};

export function getAllErrorMessages(errorResponse) {
  if (errorResponse.response.data) {
    const message = Object.values(errorResponse.response.data.errors)
      .flatMap((error) => error)
      .join(", ");
    if (message) return message;
    return "Une erreur est survenue.";
  }

  return "Une erreur est survenue.";
}
