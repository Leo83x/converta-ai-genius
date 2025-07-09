# Configuração do Backend Venom Bot

## 1. Configurar o backend para aceitar conexões externas

No seu servidor, edite o arquivo do backend para aceitar conexões de qualquer IP:

```javascript
// No arquivo server.js ou index.js do seu backend
const express = require('express');
const app = express();

// Configurar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Fazer o servidor escutar em todas as interfaces, não apenas localhost
app.listen(3002, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 3002 em todas as interfaces');
});
```

## 2. Instalar e ativar o NGINX

```bash
# Instalar nginx
sudo apt update
sudo apt install nginx

# Copiar a configuração
sudo cp nginx-app-convertamais.conf /etc/nginx/sites-available/app.convertamais.online

# Ativar o site
sudo ln -s /etc/nginx/sites-available/app.convertamais.online /etc/nginx/sites-enabled/

# Testar a configuração
sudo nginx -t

# Recarregar o nginx
sudo systemctl reload nginx
```

## 3. Configurar o firewall

```bash
# Permitir HTTP e HTTPS
sudo ufw allow 'Nginx Full'

# Permitir a porta 3002 localmente (se necessário)
sudo ufw allow from 127.0.0.1 to any port 3002
```

## 4. Verificar se está funcionando

Teste as URLs:
- https://app.convertamais.online (deve servir o frontend)
- https://app.convertamais.online/api/status (deve acessar o backend)

## 5. Estrutura de pastas necessária

```
/home/leonardo/htdocs/convertamais.online/
├── frontend/           # Arquivos do frontend (index.html, js, css)
│   ├── index.html
│   ├── assets/
│   └── ...
└── backend/            # Código do backend Node.js (porta 3002)
    ├── server.js
    └── ...
```

## Solução de problemas

1. **Se o backend não responder**: Verifique se está escutando em `0.0.0.0:3002` e não apenas `localhost:3002`
2. **Se der erro 502**: O backend provavelmente não está rodando
3. **Se der erro 404**: Verifique se os arquivos estão na pasta correta do frontend
4. **CORS**: O backend precisa ter headers CORS configurados