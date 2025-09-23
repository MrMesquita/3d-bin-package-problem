# 📦 Manoel Games Store API

> **API para otimização de embalagens 3D com algoritmo Best Fit e sistema de autenticação JWT**

Uma solução completa para otimizar o empacotamento de produtos em caixas, maximizando a eficiência do espaço e minimizando custos de envio.

## 🎯 Funcionalidades

- ✅ **Algoritmo 3D Bin Packing** - Best Fit Decreasing para otimização de espaço
- ✅ **Autenticação JWT** - Sistema seguro de login e registro
- ✅ **Persistência MySQL** - TypeORM para gestão de dados
- ✅ **Documentação Swagger** - API totalmente documentada
- ✅ **Validação robusta** - class-validator para entrada de dados
- ✅ **Arquitetura modular** - NestJS com separação de responsabilidades

## 🛠️ Tecnologias

- **Backend:** NestJS (Node.js 22 + TypeScript)
- **Banco de dados:** MySQL 8.0
- **ORM:** TypeORM
- **Autenticação:** JWT + bcrypt
- **Documentação:** Swagger/OpenAPI
- **Containerização:** Docker

---

## 🚀 Instalação - Super Simples com Docker

### 📋 Pré-requisitos

- **Docker** e **Docker Compose**
- **Git**

### ⚡ Instalação em 3 comandos

```bash
# 1. Clone o repositório
git clone https://github.com/MrMesquita/3d-bin-package-problem.git
3d-bin-package-problem

# 2. Configure o ambiente (o .env já está pronto!)
# Opcional: edite o .env se quiser alterar senhas/configurações

# 3. Execute tudo com Docker Compose
docker-compose up -d
```

**🎉 PRONTO! Em menos de 2 minutos você terá:**

✅ **API NestJS** rodando em http://localhost:3000  
✅ **Documentação Swagger** em http://localhost:3000/docs  
✅ **Banco MySQL** configurado e funcionando  
✅ **Autenticação JWT** pronta para uso  
✅ **Algoritmo 3D** otimizado e testado  

### 🔧 Configuração do .env (já está pronto!)

O arquivo `.env` já vem configurado com valores padrão:

```env
# Database MySQL
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=manoel
DB_PASSWORD=manoel123
DB_DATABASE=manoel_games_store
MYSQL_ROOT_PASSWORD=root

# JWT
JWT_SECRET=seu-jwt-secret-seguro

# Environment
NODE_ENV=development
PORT=3000
```

**💡 Opcional:** Edite o `.env` se quiser alterar senhas ou configurações

### 📋 Comandos úteis do Docker

```bash
# Ver logs em tempo real
docker-compose logs -f

# Parar tudo
docker-compose down

# Reiniciar tudo
docker-compose restart

# Rebuild completo (se fez mudanças no código)
docker-compose down && docker-compose up -d --build
```

---

## 🧪 Testar a API rapidamente

Após o `docker-compose up -d`, teste imediatamente:

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "teste", "password": "123456"}'

# 2. Fazer login (copie o token da resposta)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "teste", "password": "123456"}'

# 3. Testar otimização (use o token do passo 2)
curl -X POST http://localhost:3000/api/packaging/optimize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "pedidos": [{
      "pedido_id": "123",
      "produtos": [{
        "produto_id": "PROD001",
        "dimensoes": {"altura": 5, "largura": 10, "comprimento": 3}
      }]
    }]
  }'
```

---

## 🔧 Desenvolvimento Local (Se preferir sem Docker)

<details>
<summary>🖱️ Clique aqui para instruções de desenvolvimento local</summary>

### Pré-requisitos adicionais:
- **Node.js** (versão 22)
- **npm**
- **MySQL** local

### Passos:

```bash
# Instalar dependências
npm install

# Configurar MySQL local
# Altere no .env: DB_HOST=localhost

# Executar aplicação
npm run start:dev
```

</details>

---

## 📚 Como usar a API

### 🎯 Acesso direto via Swagger

**Mais fácil:** Acesse http://localhost:3000/docs e teste diretamente pela interface!

### 🔐 Via curl/Postman

#### 1. Registrar um usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "seuusuario",
    "password": "suasenha123"
  }'
```

**Resposta:**
```json
{
  "id": 1,
  "username": "seuusuario"
}
```

#### 2. Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "seuusuario",
    "password": "suasenha123"
  }'
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "seuusuario"
  }
}
```

### 📦 Otimização de embalagens

Use o token JWT para acessar o endpoint de otimização:

```bash
curl -X POST http://localhost:3000/api/packaging/optimize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
  -d '{
    "pedidos": [
      {
        "pedido_id": 12345,
        "produtos": [
          {
            "produto_id": "PROD001",
            "dimensoes": {
              "altura": 5,
              "largura": 10,
              "comprimento": 3
            }
          },
          {
            "produto_id": "PROD002",
            "dimensoes": {
              "altura": 8,
              "largura": 4,
              "comprimento": 2
            }
          }
        ]
      }
    ]
  }'
```

**Resposta:**
```json
[
  {
    "pedido_id": "12345",
    "caixas": [
      {
        "caixa_id": "CAIXA001",
        "produtos": ["PROD001", "PROD002"],
        "observacao": "Otimização realizada com sucesso"
      }
    ]
  }
]
```

---

## 📖 Documentação da API

### Swagger UI

Acesse a documentação interativa completa em:

**🔗 http://localhost:3000/docs**

A documentação inclui:
- ✅ Todos os endpoints disponíveis
- ✅ Esquemas de request/response
- ✅ Exemplos práticos
- ✅ Códigos de erro
- ✅ Interface para testar a API

---

## 🐳 Docker e Docker Compose

### Comandos úteis do Docker Compose

```bash
# Executar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Visualizar logs
docker-compose logs -f

# Reconstruir imagens
docker-compose build --no-cache

# Executar apenas o banco
docker-compose up -d mysql

# Executar bash no container da API
docker-compose exec api sh

# Executar bash no container MySQL
docker-compose exec mysql mysql -u manoel -p manoel_games_store
```

### Estrutura dos containers

- **mysql**: Banco de dados MySQL 8.0
- **api**: Aplicação NestJS 

### Volumes e persistência

Os dados do MySQL são persistidos no volume `mysql_data`, garantindo que os dados não sejam perdidos quando os containers são recriados.

### Credenciais padrão (Docker)

Configuradas automaticamente no `.env`:
- **MySQL Root**: `root`
- **MySQL User**: `manoel` / `manoel123`
- **Database**: `manoel_games_store`

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

---

## 🏗️ Arquitetura do projeto

```
src/
├── auth/                    # Módulo de autenticação
│   ├── controllers/         # Controllers REST
│   ├── services/           # Lógica de negócio
│   ├── dtos/               # Data Transfer Objects
│   ├── guards/             # Guards JWT
│   └── strategies/         # Estratégias Passport
├── users/                  # Módulo de usuários
│   ├── models/             # Entidades TypeORM
│   └── services/           # Serviços de usuário
├── packaging/              # Módulo de otimização
│   ├── controllers/        # Endpoints de otimização
│   ├── services/          # Algoritmo 3D Bin Packing
│   ├── dtos/              # DTOs de entrada/saída
│   └── interfaces/        # Interfaces TypeScript
└── main.ts                # Bootstrap da aplicação
```

---

## 🔧 Scripts disponíveis

### Scripts de desenvolvimento local
```bash
# Desenvolvimento
npm run start:dev          # Inicia com hot-reload
npm run start:debug        # Inicia com debugger

# Build
npm run build              # Compila o TypeScript
npm run start:prod         # Executa versão de produção

# Qualidade de código
npm run lint              # ESLint
npm run format            # Prettier

# Testes
npm run test              # Testes unitários
npm run test:watch        # Testes em modo watch
npm run test:e2e          # Testes end-to-end
npm run test:cov          # Cobertura de testes
```

### Scripts do Docker
```bash
# Docker Compose
npm run docker:build      # Build das imagens
npm run docker:up         # Subir todos os serviços
npm run docker:down       # Parar todos os serviços
npm run docker:logs       # Ver logs em tempo real
npm run docker:restart    # Restart dos serviços
npm run docker:clean      # Limpeza completa (cuidado!)
```

---

## 🚨 Troubleshooting

### Problema: Erro de conexão com banco de dados

**Solução para Docker Compose:**
```bash
# Verificar status dos containers
docker-compose ps

# Verificar logs do MySQL
docker-compose logs mysql

# Verificar logs da API
docker-compose logs api

# Restart do MySQL
docker-compose restart mysql
```

**Solução para instalação manual:**
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no `.env`
3. Teste a conexão:

```bash
# Para Docker
docker exec -it manoel-mysql mysql -u manoel -p

# Para MySQL local
mysql -u manoel -p
```

### Problema: Containers não sobem

**Solução:**
```bash
# Verificar se as portas estão livres
sudo lsof -i :3000
sudo lsof -i :3306

# Parar containers existentes
docker-compose down --volumes

# Limpar sistema Docker (cuidado!)
docker system prune -a

# Rebuild completo
docker-compose up -d --build
```

### Problema: API não conecta no banco via Docker

**Solução:**
1. Verifique se o MySQL está healthy:
```bash
docker-compose ps
```

2. Teste conectividade entre containers:
```bash
docker-compose exec api ping mysql
```

3. Verificar logs detalhados:
```bash
docker-compose logs api | grep -i error
```

### Problema: Erro 401 (Unauthorized)

**Solução:**
1. Verifique se o token JWT está válido
2. Certifique-se de incluir o header `Authorization: Bearer TOKEN`
3. Verifique se o `JWT_SECRET` está configurado

### Problema: Porta 3000 em uso

**Solução:**
```bash
# Altere a porta no .env
PORT=3001

# Ou mate o processo que usa a porta 3000
lsof -ti:3000 | xargs kill -9
```

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Manoel** - *Desenvolvedor Full Stack*

- GitHub: [@MrMesquita](https://github.com/MrMesquita)

---

## 🆘 Suporte

Se você teve problemas ou dúvidas:

1. **Consulte a documentação:** http://localhost:3000/docs
2. **Verifique os logs:** `npm run start:dev` mostra logs detalhados
3. **Issues:** Abra uma issue no GitHub
4. **Documentação NestJS:** https://docs.nestjs.com

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!**
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
