# Configuração do Servidor Venom Bot

Este sistema utiliza o Venom Bot para integração com WhatsApp. Para que a funcionalidade funcione corretamente, você precisa configurar um servidor Venom Bot local.

## Pré-requisitos

- Node.js versão 14 ou superior
- npm ou yarn

## Instalação do Servidor Venom Bot

1. **Clone o repositório do Venom Bot API:**
```bash
git clone https://github.com/orkestral/venom.git
cd venom
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Crie um servidor básico** (arquivo `server.js`):
```javascript
const venom = require('venom-bot');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let venomSession = null;
let qrCodeData = null;

// Endpoint para iniciar sessão
app.post('/api/start-session', async (req, res) => {
  try {
    const { sessionName } = req.body;
    
    venomSession = await venom
      .create({
        session: sessionName,
        multidevice: true,
        headless: true,
        devtools: false,
        useChrome: true,
        debug: false,
        logQR: false,
        browserWS: '',
        browserArgs: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ],
        refreshQR: 15000,
        autoClose: 60000,
        disableSpins: true,
      })
      .then((client) => {
        console.log('Venom session started successfully');
        return client;
      })
      .catch((erro) => {
        console.error('Error starting session:', erro);
        throw erro;
      });

    res.json({
      success: true,
      sessionName: sessionName,
      status: 'started'
    });

  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint para verificar status
app.get('/api/session/:sessionName/status', (req, res) => {
  if (venomSession) {
    res.json({
      success: true,
      status: 'connected',
      connectionStatus: 'open'
    });
  } else {
    res.json({
      success: true,
      status: 'pending',
      connectionStatus: 'connecting'
    });
  }
});

// Endpoint para obter QR Code
app.get('/api/session/:sessionName/qr', (req, res) => {
  if (qrCodeData) {
    res.json({
      success: true,
      qrcode: qrCodeData,
      qr: qrCodeData
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'QR Code not available'
    });
  }
});

// Capturar QR Code quando gerado
venom.create('session', (base64Qr, asciiQR) => {
  console.log('QR Code gerado!');
  qrCodeData = base64Qr;
}, undefined, { logQR: false });

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor Venom Bot rodando na porta ${PORT}`);
});
```

4. **Instale as dependências adicionais:**
```bash
npm install express cors
```

5. **Execute o servidor:**
```bash
node server.js
```

## Configuração no Sistema

1. Certifique-se de que o servidor Venom está rodando em `http://localhost:3002`
2. No sistema ConvertaPlus, vá para a seção "WhatsApp (Venom)"
3. Clique em "Iniciar Conexão"
4. O sistema agora irá se conectar ao seu servidor Venom local
5. Escaneie o QR Code que aparecer na tela

## Troubleshooting

### Servidor não inicia
- Verifique se a porta 3002 não está sendo usada por outro processo
- Certifique-se de que o Node.js está instalado corretamente

### QR Code não aparece
- Verifique os logs do servidor Venom
- Certifique-se de que o navegador tem permissão para executar o Chromium

### Conexão falha
- Verifique se o firewall não está bloqueando a conexão
- Certifique-se de que ambos os serviços estão na mesma rede

## Fallback para Desenvolvimento

Se o servidor Venom não estiver disponível, o sistema irá mostrar um QR Code de demonstração com instruções sobre como configurar o servidor.

Para desabilitar o fallback e forçar o uso do servidor real, remova o código de mock das edge functions.