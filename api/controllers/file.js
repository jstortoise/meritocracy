const openpgp = require('openpgp');
const request = require('request');
const ipfsAPI = require('ipfs-api');

const db = require('../models');
const { PGP_PASS_PHRASE } = require('../config');
const ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' });

/**
 * Get file contents from URL
 * @param {String} url - File URL
 */
const getFileFromURL = async url => {
    return new Promise((resolve, reject) => {
        request.get(url, { encoding: null }, (err, response, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
};

/**
 * Sign file content with PGP
 * @param {Buffer} file 
 * @param {String} privateKey 
 */
const signWithPGP = async (file, privateKey = '') => {
    var privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
    await privKeyObj.decrypt(PGP_PASS_PHRASE);
    const options = {
        message: openpgp.message.fromBinary(file),
        privateKeys: [privKeyObj]
    };
     
    const signed = await openpgp.sign(options);
    return signed.data;
};

/**
 * Verify signed file content with PGP
 * @param {Buffer} file_sign 
 * @param {String} publicKey 
 */
const verifyWithPGP = async (file_sign, publicKey = '') => {
    const options = {
        message: await openpgp.message.readArmored(file_sign), // parse armored message
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys // for verification
    };
     
    let verified = await openpgp.verify(options);
    await openpgp.stream.readToEnd(verified.data);
    validity = await verified.signatures[0].verified; // true
    if (validity) {
        return { data: verified.data, mid: verified.signatures[0].keyid.toHex() };
    } else {
        throw 'Validation failed';
    }
};

/**
 * Encrypt file content with PGP
 * @param {Buffer} file 
 * @param {String} publicKey 
 */
const encryptWithPGP = async (file, publicKey = '') => {
    const options = {
        message: openpgp.message.fromBinary(file),
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
        armor: false
    };
    const encryptionResponse = await openpgp.encrypt(options);
    const encrypted = encryptionResponse.message.packets.write();
    return encrypted;
};

/**
 * Decrypt encrypted file content with PGP
 * @param {Buffer} encrypted 
 * @param {String} privateKey 
 */
const decryptWithPGP = async (encrypted, privateKey = '') => {
    const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
    await privKeyObj.decrypt(PGP_PASS_PHRASE);
    const options = {
        message: await openpgp.message.read(encrypted),
        privateKeys: [privKeyObj],
        format: 'binary'
    };
    const decryptionResponse = await openpgp.decrypt(options);
    const decrypted = decryptionResponse.data;
    return decrypted;
};

/**
 * Get file from DB
 * @param {Object} where 
 */
const findOne = where => {
    return db.File.findOne({ where, raw: true });
};

/**
 * Create file on DB
 * @param {Object} data 
 */
const create = data => {
    return db.File.create(data);
};

const addIPFS = buffer => {
    return new Promise((resolve, reject) => {
        ipfs.files.add(buffer, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
};

const getIPFS = hash => {
    return new Promise((resolve, reject) => {
        ipfs.files.get(hash, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
};

module.exports = {
    getFileFromURL,
    signWithPGP, verifyWithPGP,
    encryptWithPGP, decryptWithPGP,
    findOne,
    create,
    addIPFS,
    getIPFS,
};