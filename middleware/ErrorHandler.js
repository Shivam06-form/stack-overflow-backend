exports.ErrorHandler = (message, istatus, statusCode) => {
  const err = new Error(message);
  err.status = istatus;
  err.statusCode = statusCode;
  return err;
};
