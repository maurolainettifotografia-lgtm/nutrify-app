# Backup do Nutrify 1.1.2

Salvo em 25/10/2026.

O arquivo NUTRIFY-fonte-1.1.2-GitHub.zip contém o projeto completo: frontend Expo/React Native, projeto Android nativo utilizado na versão 1.1.2, backend FastAPI, arquivos de dependências e configurações de exemplo.

Pacote Android: com.maurolainetti.nutrify. Versão 1.1.2, versionCode 4.
Correção: atualização dos relatórios de Evolução ao excluir, adicionar ou copiar alimentos. Inclui novo ícone e integração com Strava.

## Restaurar
1. Extraia o ZIP.
2. Consulte README.md, frontend/README.md e os arquivos .env.example.
3. No frontend, instale dependências com npm ci. Configure EXPO_PUBLIC_BACKEND_URL com a URL HTTPS da API.
4. No backend, instale requirements.txt e configure as variáveis do servidor em ambiente protegido.
5. O projeto nativo está em frontend/android. A versão release usa NUTRIFY_UPLOAD_STORE e NUTRIFY_UPLOAD_PASSWORD, definidos fora do código.

As credenciais do servidor, tokens, bancos de dados pessoais, dependências instaladas, caches e chaves de assinatura não fazem parte deste backup. A chave de upload Android deve ser preservada separadamente para atualizar o mesmo aplicativo na loja.

## Google Play
A versão 1.1.2 foi publicada no teste interno em 24/10/2026. Ainda não é um lançamento público. Faltam os e-mails dos testadores e a conclusão das demais informações de publicação. O teste fechado exige no mínimo 12 participantes durante 14 dias antes de solicitar acesso à produção.

Teste interno: https://play.google.com/apps/internaltest/4701351075932533953
Política de privacidade: https://nutrify-app-tiab.onrender.com/privacy

O backend em produção continua nos arquivos da raiz da branch main. Esta branch mantém uma cópia de segurança do projeto completo.
