#!/bin/bash

# Script para instalar e configurar NGINX para app.convertamais.online

echo "=== Configurando NGINX para app.convertamais.online ==="

# 1. Copiar configuração para sites-available
echo "Copiando configuração..."
sudo cp nginx-app-convertamais.conf /etc/nginx/sites-available/app.convertamais.online

# 2. Remover link simbólico se existir
echo "Removendo configuração anterior se existir..."
sudo rm -f /etc/nginx/sites-enabled/app.convertamais.online

# 3. Criar link simbólico para sites-enabled
echo "Ativando site..."
sudo ln -s /etc/nginx/sites-available/app.convertamais.online /etc/nginx/sites-enabled/

# 4. Testar configuração do NGINX
echo "Testando configuração do NGINX..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração válida!"
    
    # 5. Recarregar NGINX
    echo "Recarregando NGINX..."
    sudo systemctl reload nginx
    
    echo "✅ NGINX recarregado com sucesso!"
    
    # 6. Verificar status
    echo "Status do NGINX:"
    sudo systemctl status nginx --no-pager -l
    
    echo ""
    echo "=== Configuração concluída! ==="
    echo "Frontend: http://app.convertamais.online"
    echo "API Test: http://app.convertamais.online/api/session/Converta/qr"
    echo ""
    echo "Logs de acesso: /var/log/nginx/app.convertamais.online.access.log"
    echo "Logs de erro: /var/log/nginx/app.convertamais.online.error.log"
    
else
    echo "❌ Erro na configuração do NGINX!"
    echo "Verifique o arquivo de configuração e tente novamente."
    exit 1
fi