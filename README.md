# LifeQuest

## Visao geral

O LifeQuest e um aplicativo mobile em Expo com foco em frontend. O sistema transforma tarefas reais em missoes acompanhadas por um responsavel ou gestor, usando gamificacao para incentivar disciplina, produtividade e acompanhamento de resultados.

O app foi adaptado para dois contextos:

- `Empresarial`: gestor cria, distribui, acompanha e valida tarefas dos colaboradores
- `Residencial`: responsavel organiza e valida a rotina em casa

## Objetivo academico

Este projeto foi preparado para a disciplina com foco em:

- demonstracao funcional do sistema
- remodelacao visual profissional do frontend
- processo SDD
- testes automatizados com Playwright e prints de evidencia
- relatorio de seguranca baseado em OWASP

## Funcionalidades principais

### 1. Acesso e cadastro

- escolha do ambiente: `Empresarial` ou `Residencial`
- escolha do perfil do usuario
- cadastro com nome, senha, observacao e companheiro visual
- login local com recuperacao da sessao salva

### 2. Painel principal

- dashboard com resumo da operacao ou do desempenho pessoal
- cards com indicadores
- graficos de barras, linha e pizza
- leitura de produtividade para o gestor
- barra de XP, nivel e progresso para o colaborador

### 3. Missoes

- gestor cria missoes
- colaborador pega a missao
- envio de conclusao com justificativa de atraso
- envio de motivo de nao conclusao
- aprovacao final pelo superior

### 4. Validacoes

- fila de aprovacoes
- justificativas registradas
- leitura visual da carga de validacao

### 5. Recompensas

- XP calculado automaticamente
- moeda virtual `LQ`
- previsao de `LQS` como recompensa especial
- resumo visual do progresso

### 6. Perfil

- dados do usuario
- nivel, XP, LQ e desempenho geral
- resumo do papel do perfil na demonstracao

### 7. Foco

- mini modulo de concentracao
- recompensa em `LQ`
- historico de sessoes
- impacto no indicador de foco do usuario

## Tecnologias

- Expo
- React Native
- Expo Router
- AsyncStorage
- JSON Server
- Playwright
- TypeScript

## Estrutura da entrega

- Processo SDD: `docs/SDD-processo.md`
- Testes e evidencias: `docs/Testes-Playwright.md`
- Relatorio OWASP: `docs/OWASP-relatorio.md`
- Relatorio final detalhado: `docs/Relatorio-Final-LifeQuest.md`
- Resumo final: `docs/Resumo-Final-LifeQuest.md`
- Casos E2E: `tests/e2e/lifequest.spec.ts`
- Evidencias: `tests/evidencias/`

## Como rodar o projeto

```powershell
cd "C:\Users\joaog\OneDrive\Área de Trabalho\Codigo Do App LifeQuest\LifeQuest"
npm install
```

Rodar o banco local:

```powershell
npm run server
```

Rodar o app em modo mais estavel para a demo:

```powershell
npx expo start --offline -c
```

## Como rodar os testes

```powershell
npm run test:e2e
```

## Resultado atual

- 10 casos automatizados em Playwright
- 10 evidencias PNG no repositorio
- fluxo principal cobrindo cadastro, login, missoes, dashboard, foco e navegacao

## Observacoes de seguranca

O projeto inclui um relatorio OWASP com itens resolvidos, parcialmente resolvidos e pendentes. Como a proposta atual e de demonstracao frontend, alguns pontos dependem de backend real para uma resolucao completa em producao.
