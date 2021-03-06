const forge = require("node-forge");

export default class Encryption {
    constructor() {
        
    }
  
    /**
     * Example on how to hash a string
     * @param string
     * @returns {hashedString}
     */
    hashString(string) {
        var md = forge.md.sha512.create();
        md.update(string);
        return (md.digest().toHex());
    }

    /**
     * Example on how to generate a random AES key and re-use it afterwards
     * @param password
     * @param iv
     * @returns {{key: the|*, iv: the|*}}
     */
    derivePassword (password, keySize = 32, iv = false) {
        // generate a random iv
        let passwordIv;
        if (iv) {
            // turn existing iv into bytes
            passwordIv = forge.util.hexToBytes(iv);
        } else {
            // generate a new random iv
            passwordIv = forge.random.getBytesSync(keySize);
        }

        // amount of pbkdf2 iterations,
        const iterations = 300000;

        // derive a 16 bit key from the password and iv
        const derivedBytes = forge.pkcs5.pbkdf2(password, passwordIv, iterations, keySize);

        // turn derivedBytes into a readable string
        const encryptionKey = forge.util.bytesToHex(derivedBytes);

        // turn passwordIv into a readable string
        const encryptionIv = forge.util.bytesToHex(passwordIv);

        return {
            key: encryptionKey,
            iv: encryptionIv
        };
    };

    /**
     * Basic function just to generate a random AES key
     * @param keySize
     */
    generateRandomKey (keySize) {
        // random bytes
        const key = forge.random.getBytesSync(keySize);

        // straight to hex and return it
        return forge.util.bytesToHex(key);
    };



    /**
     * Encrypt a string with a pre-defined encryption key
     * @param string
     * @param encryptionKey
     * @returns {Promise.<{iv: string, encryptedString: string}>}
     */
    encryptString (string, encryptionKey) {
        // create a random initialization vector
        const iv = forge.random.getBytesSync(32);
        // turn hex-encoded key into bytes
        const encryptionKeyBytes = forge.util.hexToBytes(encryptionKey);
        // create a new aes-cbc cipher with our key
        const cipher = forge.cipher.createCipher("AES-CBC", encryptionKeyBytes);
        // turn our string into a buffer
        const buffer = forge.util.createBuffer(string, "utf8");

        cipher.start({ iv: iv });
        cipher.update(buffer);
        cipher.finish();

        return {
            iv: forge.util.bytesToHex(iv),
            key: encryptionKey,
            encryptedString: cipher.output.toHex()
        };
    };

    /**
     * Decrypts a string using the key and iv
     * @param encryptedString
     * @param key
     * @param iv
     * @returns {Promise.<String>}
     */
    decryptString (encryptedString, key, iv) {
        // get byte data from hex encoded strings
        const encrypedBytes = forge.util.hexToBytes(encryptedString);
        // create a new forge buffer using the bytes
        const encryptedBuffer = forge.util.createBuffer(encrypedBytes, "raw");
        const keyBytes = forge.util.hexToBytes(key);
        const ivBytes = forge.util.hexToBytes(iv);

        // create a new decipher with our key and iv
        const decipher = forge.cipher.createDecipher("AES-CBC", keyBytes);
        decipher.start({ iv: ivBytes });
        decipher.update(encryptedBuffer);

        // check the decipher results
        const result = decipher.finish();
        if (!result) {
            throw new Error("Failed to decrypt string, the encryption string might have changed");
        }
        // get the raw bytes from the forge buffer
        const outputBytes = decipher.output.getBytes();

        // turn forge bytes into a regular buffer
        const nodeBuffer = Buffer.from(outputBytes, "binary");

        // return the result as an utf8-encoded string
        return nodeBuffer.toString("utf8");
    };

    setStoredEncryptionValue(val, key){
        const encrypted = this.encryptString(val, key);
        return (encrypted.iv + '~' + encrypted.encryptedString);
    }

    getStoredEncryptionValue(val, key){
        return (val === undefined || val === null) ? null : this.decryptString(val.split('~')[1], key, val.split('~')[0])
    }
  
}

export const encryption = new Encryption();
