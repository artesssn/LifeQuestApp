# LifeQuest

## Visao Geral

O LifeQuest e um aplicativo mobile em Expo com foco em frontend, criado para apresentar um sistema de gamificacao de tarefas reais.

A proposta do projeto e transformar atividades do dia a dia em missoes de um universo RPG, com:

- criacao e validacao de missoes por responsaveis ou gestores
- progresso por XP e niveis
- moeda virtual `LQ`
- mini game de foco para desestresse
- indicadores de produtividade para gestor e trabalhador

## Objetivo Academico

Este projeto foi desenvolvido para a disciplina com foco em:

- demonstracao funcional do sistema
- organizacao visual e narrativa do app
- processo SDD
- testes automatizados com evidencias
- relatorio de seguranca com base em OWASP

## Funcionalidades Principais

### 1. Jornada de Acesso

- escolha do ambiente: `Empresarial` ou `Residencial`
- escolha da classe do usuario
- cadastro com nome, senha e companheiro
- login com usuario salvo localmente

### 2. Painel Principal

- dashboard com resumo da jornada
- leitura de produtividade
- resumo narrativo do capitulo atual
- acesso rapido para missoes e Arena

### 3. Missoes

- gestor cria missoes
- trabalhador acompanha suas tarefas
- fluxo de aprovacao visual
- justificativa de atraso ou nao conclusao

### 4. Arena

- mini game "Ritual das Runas"
- recompensa em `LQ`
- historico de sessoes
- impacto no indicador de foco

## Tecnologias

- Expo
- React Native
- Expo Router
- AsyncStorage
- JSON Server
- Playwright
- TypeScript

## Estrutura de Entrega da Disciplina

### Processo SDD

Documento:

- [docs/SDD-processo.md](C:\Users\joaog\OneDrive\Área de Trabalho\Codigo Do App LifeQuest\LifeQuest\docs\SDD-processo.md)

### Testes Automatizados

Casos e evidencias:

- [docs/Testes-Playwright.md](C:\Users\joaog\OneDrive\Área de Trabalho\Codigo Do App LifeQuest\LifeQuest\docs\Testes-Playwright.md)
- [tests/e2e/lifequest.spec.ts](C:\Users\joaog\OneDrive\Área de Trabalho\Codigo Do App LifeQuest\LifeQuest\tests\e2e\lifequest.spec.ts)
- [tests/evidencias](C:\Users\joaog\OneDrive\Área de Trabalho\Codigo Do App LifeQuest\LifeQuest\tests\evidencias)

### Relatorio OWASP

Documento:

- [docs/OWASP-relatorio.md](C:\Users\joaog\OneDrive\Área de Trabalho\Codigo Do App LifeQuest\LifeQuest\docs\OWASP-relatorio.md)

## Como Rodar o Projeto

Dentro da pasta do projeto:

```powershell
cd "C:\Users\joaog\OneDrive\Área de Trabalho\Codigo Do App LifeQuest\LifeQuest"
npm install
```

Rodar o banco local:

```powershell
npm run server
```

Rodar o app:

```powershell
npx expo start
```

## Como Rodar os Testes

```powershell
npm run test:e2e
```

## Resultado Atual dos Testes

- 10 casos automatizados
- 10 evidencias com print
- execucao validada com Playwright

## Validacoes Realizadas

- `npx tsc --noEmit`
- `npm run test:e2e`

## Observacoes de Seguranca

O projeto possui relatorio OWASP com itens:

- resolvidos
- parcialmente resolvidos
- pendentes para producao

Como o foco da disciplina esta no frontend e demonstracao, alguns itens de seguranca dependem de backend real para resolucao completa, como autenticacao robusta, autorizacao de servidor e armazenamento seguro de credenciais.

## Texto Curto Para Apresentacao

O LifeQuest e um aplicativo mobile em Expo que gamifica tarefas reais por meio de missoes, progresso e recompensas. No projeto, o gestor cria missoes, o trabalhador acompanha sua jornada, evolui com XP, recebe LQ e pode usar a Arena para foco e desestresse. Alem da parte visual e funcional, o projeto tambem inclui processo SDD, 10 testes automatizados com Playwright e um relatorio de seguranca baseado em OWASP.
