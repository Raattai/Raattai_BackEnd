const axios = require('axios');
const { encrypt, decrypt } = require('./encryption');
const config = require('../config/config');

const makeApiCall = async (requestBody) => {
  try {
    const encryptedRequest = encrypt(requestBody);
    const response = await axios.post(config.productionUrl, {
      enc_request: encryptedRequest,
      access_code: config.accessCode,
    });

    if (response.data && response.data.enc_response) {
      const decryptedResponse = decrypt(response.data.enc_response);
      return JSON.parse(decryptedResponse);
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.error('Error making API call:', error);
    throw error;
  }
};

const confirmOrder = async (orders) => {
  const requestBody = JSON.stringify({
    command: 'confirmOrder',
    order_List: orders,
  });

  return await makeApiCall(requestBody);
};

const cancelOrder = async (orders) => {
  const requestBody = JSON.stringify({
    command: 'cancelOrder',
    order_List: orders,
  });

  return await makeApiCall(requestBody);
};

const fetchOrderStatus = async (order) => {
  const requestBody = JSON.stringify({
    command: 'orderStatusTracker',
    access_code: config.accessCode,
    order_no: order.reference_no,
  });

  return await makeApiCall(requestBody);
};

module.exports = {
  confirmOrder,
  cancelOrder,
  fetchOrderStatus,
};
