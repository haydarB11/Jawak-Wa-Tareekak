const crypto = require('crypto'); 

require('dotenv').config()
const algorithm = 'aes-256-cbc';


exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm,Buffer.from(process.env.KEY, 'hex') ,Buffer.from(process.env.IV, 'hex') ); 
  let encrypted = cipher.update(text, 'utf8', 'hex'); 
  encrypted += cipher.final('hex');
  return encrypted; 
}; 

exports.decrypt = (text) => { 
  const decipher = crypto.createDecipheriv(algorithm,Buffer.from(process.env.KEY, 'hex') ,Buffer.from(process.env.IV, 'hex') ); 
  let decrypted = decipher.update(text, 'hex', 'utf8'); 
  decrypted += decipher.final('utf8'); 
  return decrypted; 
};