const CryptoJS = require('crypto-js');
const config = require('../config/config');

const encrypt = (text) => {
  const key = CryptoJS.enc.Utf8.parse(config.encryptionKey);
  const iv = CryptoJS.enc.Utf8.parse('000102030405060708090A0B0C0D0E0F');
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
};

const decrypt = (encryptedText) => {
  const key = CryptoJS.enc.Utf8.parse(config.encryptionKey);
  const iv = CryptoJS.enc.Utf8.parse('000102030405060708090A0B0C0D0E0F');
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt,
};
