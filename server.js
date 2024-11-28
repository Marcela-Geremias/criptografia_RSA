const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); // Habilitando CORS


// Armazena as chaves (somente para exemplo, não é seguro em produção)
let keys = {};

// Gerar chaves pública e privada
app.get('/generate-keys', (req, res) => {
    console.log('Endpoint /generate-keys acessado'); // Log para verificar a chamada
    try {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048, // Tamanho da chave em bits
        });
        keys = {
            publicKey: publicKey.export({ type: 'pkcs1', format: 'pem' }),
            privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }),
        };
        console.log('Chaves geradas com sucesso');
        res.json({ publicKey: keys.publicKey });
    } catch (error) {
        console.error('Erro ao gerar as chaves:', error);
        res.status(500).json({ error: 'Erro ao gerar as chaves' });
    }
});

// Cifrar mensagem com chave pública
app.post('/encrypt', (req, res) => {
    console.log('Endpoint /encrypt acessado'); // Log para verificar a chamada
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Mensagem ausente' });
    }
    if (!keys.publicKey) {
        return res.status(400).json({ error: 'Chave pública ausente. Gere as chaves primeiro.' });
    }

    try {
        const encryptedMessage = crypto.publicEncrypt(
            keys.publicKey,
            Buffer.from(message, 'utf-8')
        );
        console.log('Mensagem cifrada com sucesso');
        res.json({ encryptedMessage: encryptedMessage.toString('base64') });
    } catch (error) {
        console.error('Erro ao cifrar a mensagem:', error);
        res.status(500).json({ error: 'Erro ao cifrar a mensagem' });
    }
});

// Decifrar mensagem com chave privada
app.post('/decrypt', (req, res) => {
    console.log('Endpoint /decrypt acessado'); // Log para verificar a chamada
    const { encryptedMessage } = req.body;

    if (!encryptedMessage) {
        return res.status(400).json({ error: 'Mensagem cifrada ausente' });
    }
    if (!keys.privateKey) {
        return res.status(400).json({ error: 'Chave privada ausente. Gere as chaves primeiro.' });
    }

    try {
        const decryptedMessage = crypto.privateDecrypt(
            keys.privateKey,
            Buffer.from(encryptedMessage, 'base64')
        );
        console.log('Mensagem decifrada com sucesso');
        res.json({ decryptedMessage: decryptedMessage.toString('utf-8') });
    } catch (error) {
        console.error('Erro ao decifrar a mensagem:', error);
        res.status(500).json({ error: 'Erro ao decifrar a mensagem' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
