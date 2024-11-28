const serverUrl = 'http://localhost:3000';

// Gerar chaves
document.getElementById('generate-keys').addEventListener('click', async () => {
    try {
        const response = await fetch(`${serverUrl}/generate-keys`);
        if (!response.ok) throw new Error('Erro ao gerar as chaves');
        const data = await response.json();
        document.getElementById('public-key').value = data.publicKey;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao gerar as chaves. Verifique o console para mais detalhes.');
    }
});

// Cifrar mensagem
document.getElementById('encrypt').addEventListener('click', async () => {
    const message = document.getElementById('message').value;
    if (!message) {
        alert('Por favor, digite uma mensagem!');
        return;
    }

    try {
        const response = await fetch(`${serverUrl}/encrypt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        if (!response.ok) throw new Error('Erro ao cifrar a mensagem');
        const data = await response.json();
        document.getElementById('encrypted-message').value = data.encryptedMessage;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cifrar a mensagem. Verifique o console para mais detalhes.');
    }
});

// Decifrar mensagem
document.getElementById('decrypt').addEventListener('click', async () => {
    const encryptedMessage = document.getElementById('encrypted-input').value;
    if (!encryptedMessage) {
        alert('Por favor, cole uma mensagem cifrada!');
        return;
    }

    try {
        const response = await fetch(`${serverUrl}/decrypt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ encryptedMessage }),
        });
        if (!response.ok) throw new Error('Erro ao decifrar a mensagem');
        const data = await response.json();
        document.getElementById('decrypted-message').value = data.decryptedMessage;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao decifrar a mensagem. Verifique o console para mais detalhes.');
    }
});
