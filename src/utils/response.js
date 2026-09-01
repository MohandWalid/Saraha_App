export const Asynhadler = (fn) => {
  return async (req, res, next) => {
    await fn(req, res, next).catch((error) => {
      error.cause = 500;
      return next(error);
    });
  };
};

export const globalErrorHandler = (error, req, res, next) => {
  const statusCode = Number.isInteger(error.cause) ? error.cause : 500;

  return res.status(statusCode).json({
    err_message: error.message,
    stask: error.stack,
  });
};

export const successfullyResponse = ({
  res,
  message = "Done",
  data = {},
  status = 200,
} = {}) => {
  return res.status(status).json({ message: message, data: data });
};
