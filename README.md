# Trybe Futebol Club

Esta aplicação foi um dos projetos avaliativos do módulo de backend no curso de desenvolvimento web na Trybe. Nele recebi um frontend react que exibe informações sobre partidas e classificações de futebol.

"E de onde essas informações virão?", você deve estar se perguntando. Vem tudo do Backend!

Exatamente, minha missão nesse projeto foi, a partir de um frontend sem lógica (apenas exibe informações), desenvolver uma API na arquitetura MSC e utilizando princípios SOLID com TypeScript e OOP que seria responsável por:

- Criar e manipular um banco de dados MySQL para armazenar todos os dados;
- Autenticar usuários cadastrados através do login;
- Listar clubes cadastrados;
- Listar partidas em andamento e partidas finalizadas;
- Adicionar partidas em andamento;
- Atualizar o placar das partidas em andamento;
- Finalizar partidas;
- Gerar leaderboards ranqueadas e ordenadas baseadas no desempenho dos clubes nas partidas cadastradas, utilizando 5 critérios avaliativos e separando em 3 tipos de classificação (geral, mandante e visitante);
- Orquestrar tudo isso (banco de dados, backend e frontend) em containers `Docker` e executá-los de forma conjunta através de uma orquestração com `Docker-Compose`.

Achou que era só isso? Sabe de nada, inocente! Já dizia o ditado, "aplicação sem testes é aplicação sem futuro", e por isso desenvolvi em TDD uma cobertura de testes de 100% em todas as camadas utilizando Mocha, Chai e Sinon.

## Stacks utilizadas

- Node.js
- TypeScript
- POO
- Express
- MySQL
- Sequelize
- Docker
- Mocha + Chai + Sinon

#### Além das Stacks citadas acima, também foram utilizadas as seguintes bibliotecas:

- `JWT` para fazer a autenticação dos usuários logados;
- `bcrypt` para fazer hashing e verificação das senhas armazenadas no banco de dados.

## Rodando localmente

***Para rodar a API localmente certifique-se de ter [Docker](https://docs.docker.com/get-docker/) 
e [Docker-Compose](https://docs.docker.com/compose/install/) instalados em sua maquina.***

Obs: Docker e Docker-Compose utilizados no desenvolvimento e execução deste projeto estavam nas versões `20.10.13` e `1.29.2` respectivamente.

Clone o projeto:

```bash
  git clone git@github.com:miguelraatz/node-TFC.git
```

Entre no diretório do projeto:

```bash
  cd node-TFC
```

Suba a orquestração de containers:

```bash
  docker-compose up --build -d
```

A API estará pronta para uso quando a saída no seu terminal ficar assim:

```bash
  Creating tfc_database ... done
  Creating tfc_backend ... done
  Creating tfc_frontend ... done
```

A aplicação poderá ser acessada através de:

```bash
  Front-end: localhost:3000
  Back-end: localhost:3001
```

Para realizer o login você pode usar as credenciais abaixo:

```bash
  login: admin@admin.com
  senha: secret_admin 
```

Para rodar a bateria de testes basta executar:

```bash
  docker-compose exec backend npm test
```

Para encerrar a API basta executar o comando:

```bash
  docker-compose down --rmi local --volumes --remove-orphans
```
