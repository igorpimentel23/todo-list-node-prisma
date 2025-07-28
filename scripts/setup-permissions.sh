#!/bin/bash

# Aguardar o MySQL estar pronto
echo "Aguardando MySQL estar pronto..."
sleep 30

# Conectar como root e dar permissões ao usuário docker
mysql -h localhost -P 3306 -u root -pdocker << EOF
GRANT ALL PRIVILEGES ON *.* TO 'docker'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'docker'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

echo "Permissões configuradas com sucesso!"
