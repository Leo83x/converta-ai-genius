#!/bin/bash

# Script para instalar e configurar NGINX para app.convertamais.online

echo "=== Configurando NGINX para app.convertamais.online ==="

# Verificar se o arquivo de configuração existe
if [ ! -f "nginx-app-convertamais.conf" ]; then
    echo "❌ Arquivo nginx-app-convertamais.conf não encontrado!"
    echo "Certifique-se de que está no diretório correto."
    exit 1
fi

# 1. Copiar configuração para sites-available
echo "Copiando configuração..."
sudo cp nginx-app-convertamais.conf /etc/nginx/sites-available/app.convertamais.online

# 2. Verificar se a pasta frontend existe
if [ ! -d "/home/leonardo/htdocs/convertamais.online/frontend" ]; then
    echo "⚠️  Pasta do frontend não encontrada!"
    echo "Criando estrutura de pastas..."
    sudo mkdir -p /home/leonardo/htdocs/convertamais.online/frontend
    echo "<h1>Frontend Placeholder</h1>" | sudo tee /home/leonardo/htdocs/convertamais.online/frontend/index.html
fi

# 3. Remover link simbólico se existir
echo "Removendo configuração anterior se existir..."
sudo rm -f /etc/nginx/sites-enabled/app.convertamais.online
sudo rm -f /etc/nginx/sites-enabled/default

# 4. Criar link simbólico para sites-enabled
echo "Ativando site..."
sudo ln -s /etc/nginx/sites-available/app.convertamais.online /etc/nginx/sites-enabled/

# 5. Testar configuração do NGINX
echo "Testando configuração do NGINX..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração válida!"
    
    # 6. Recarregar NGINX
    echo "Recarregando NGINX..."
    sudo systemctl reload nginx
    
    echo "✅ NGINX recarregado com sucesso!"
    
    # 7. Verificar status
    echo "Status do NGINX:"
    sudo systemctl status nginx --no-pager -l
    
    # 8. Testar conectividade
    echo ""
    echo "=== Testes de Conectividade ==="
    echo "Testando backend local..."
    curl -I http://localhost:3002/session/Converta/qr 2>/dev/null || echo "❌ Backend não responde localmente"
    
    echo "Testando frontend..."
    curl -I http://localhost/ 2>/dev/null || echo "❌ Frontend não responde"
    
    echo ""
    echo "=== Configuração concluída! ==="
    echo "Frontend: http://app.convertamais.online"
    echo "API Test: http://app.convertamais.online/api/session/Converta/qr"
    echo ""
    echo "Logs de acesso: /var/log/nginx/app.convertamais.online.access.log"
    echo "Logs de erro: /var/log/nginx/app.convertamais.online.error.log"
    
else
    echo "❌ Erro na configuração do NGINX!"
    echo "Verificando arquivos de configuração..."
    sudo nginx -T 2>&1 | tail -20
    exit 1
fi