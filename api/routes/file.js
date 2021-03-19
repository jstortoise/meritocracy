const express = require('express');

const Common = require('../controllers/common');
const File = require('../controllers/file');

const router = express.Router();
const { IPFS_PATH } = require('../config');

router.post('/sign', Common.verifyCertSecret, Common.verifyOrgToken, async (req, res) => {
    try {
        const { fileUrl } = req.body;
        const { id: userId, privateKey, publicKey } = req.authData;
        
        // Check file URL
        if (!Common.checkURLValid(fileUrl)) {
            res.send({ success: false, message: 'Invalid URL' });
            return;
        }
        
        const fileBody = await File.getFileFromURL(fileUrl);
        const binaryFile = new Uint8Array(fileBody);
        const encrypted = await File.signWithPGP(binaryFile, privateKey);
        const encBuffer = new Buffer(encrypted);

        const files = await File.addIPFS(encBuffer);
        
        // Create on DB
        const fileData = {
            userId, privateKey, publicKey,
            hash: files[0].hash,
            path: IPFS_PATH + files[0].path,
            size: files[0].size
        };
        await File.create(fileData);
        
        const data = { userId, path: fileData.path, hash: fileData.hash, size: fileData.size };
        // Success
        res.send({ success: true, data, message: 'File signed successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/verify', Common.verifyCertSecret, Common.verifyOrgToken, async (req, res) => {
    try {
        const { hash } = req.body;
        const { id: userId, privateKey, publicKey } = req.authData;

        const file = await File.findOne({ userId, privateKey, publicKey, hash });
        if (!file) {
            res.send({ success: false, message: 'You are not the owner of this file' });
            return;
        }

        const files = await File.getIPFS(hash);
        const fileContent = files[0].content.toString();
        
        const decrypted = await File.verifyWithPGP(fileContent, publicKey)
        const decBuffer = new Buffer(decrypted.data);
        const { mid } = decrypted;

        const addedFiles = await File.addIPFS(decBuffer);
        
        const result = {
            userId,
            publicKey,
            path: IPFS_PATH + addedFiles[0].path,
            hash: addedFiles[0].hash,
            size: addedFiles[0].size
        };
        // Success
        res.send({ success: true, data: result, message: `Signed by key id ${mid}` });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/encrypt', Common.verifyCertSecret, Common.verifyOrgToken, async (req, res) => {
    try {
        const { fileUrl } = req.body;
        const { id: userId, privateKey, publicKey } = req.authData;
    
        if (!Common.checkURLValid(fileUrl)) {
            res.send({ success: false, message: 'Invalid URL' });
            return;
        }
        
        const fileBody = await File.getFileFromURL(fileUrl);
        
        const binaryFile = new Uint8Array(fileBody);
        const encrypted = await File.encryptWithPGP(binaryFile, publicKey);
        
        const encBuffer = new Buffer(encrypted);
        const files = await File.addIPFS(encBuffer);

        const fileData = {
            userId,
            publicKey,
            privateKey,
            hash: files[0].hash,
            path: IPFS_PATH + files[0].path,
            size: files[0].size
        };
        await File.create(fileData)
        
        const result = { userId, path, hash, size } = fileData;
        // Success
        res.send({ success: true, data: result, message: 'File encrypted successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

router.post('/decrypt', Common.verifyCertSecret, Common.verifyOrgToken, async (req, res) => {
    try {
        const { hash } = req.body;
        const { id: userId, privateKey, publicKey } = req.authData;
    
        const file = await File.findOne({ userId, privateKey, publicKey, hash: hash });
        if (!file) {
            res.send({ success: false, message: 'You are not the owner of this file' });
            return;
        }
        
        const files = await File.getIPFS(hash);
        
        const fileContent = files[0].content;
        const binaryFile = new Uint8Array(fileContent);
        const decrypted = await File.decryptWithPGP(binaryFile, privateKey);
        
        const decBuffer = new Buffer(decrypted);
        const addedFiles = await File.addIPFS(decBuffer);
        
        const result = {
            userId,
            publicKey,
            path: IPFS_PATH + addedFiles[0].path,
            hash: addedFiles[0].hash,
            size: addedFiles[0].size
        };
        // Success
        res.send({ success: true, data: result, message: 'File decrypted successfully' });
    } catch(e) {
        // Failed
        res.send({ success: false, message: e.message });
    }
});

module.exports = router;