const formatResponse = (role, message, aiResponse, metadata = {}) => {
  return {
    status: 'success',
    role: role,
    message: message,
    aiResponse: aiResponse,
    metadata: metadata
  };
};

module.exports = formatResponse;
