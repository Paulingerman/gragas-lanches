function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

function errorResponse(res, message, statusCode = 400) {
  return res.status(statusCode).json({ success: false, error: message });
}

function notFound(res, message = "Recurso não encontrado.") {
  return errorResponse(res, message, 404);
}

module.exports = { successResponse, errorResponse, notFound };
