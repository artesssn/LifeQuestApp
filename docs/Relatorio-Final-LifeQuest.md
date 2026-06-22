# Relatorio Final - LifeQuest

Data de atualizacao: 22/06/2026

## 1. Objetivo do projeto

O LifeQuest e um aplicativo mobile desenvolvido em Expo com foco em frontend para demonstrar um sistema de gestao de tarefas com gamificacao. A proposta central e transformar tarefas reais em missoes controladas por um superior, permitindo acompanhar produtividade, disciplina, foco e recompensas.

O projeto atende dois contextos:

- ambiente empresarial, com gestor e colaborador
- ambiente residencial, com responsavel e usuario

## 2. Arquitetura funcional da demo

Na versao entregue, o sistema foi estruturado para funcionar como demonstracao completa no frontend.

### Componentes principais

- `app/`: telas e fluxo de navegacao com Expo Router
- `contexts/lifequest-demo-context.tsx`: regra central de autenticacao local, missoes, XP, LQ, foco e dados da demonstracao
- `db.json`: base local usada com `json-server` para compartilhamento das missoes
- `components/`: elementos visuais reutilizaveis como fundo, menu, graficos e cards
- `docs/`: documentacao da entrega, testes, SDD e seguranca
- `tests/e2e/`: automacao E2E com Playwright

## 3. Especificacao das paginas

### 3.1 Tela inicial

Arquivo principal:

- `app/index.tsx`

Objetivo:

- apresentar o conceito do sistema
- permitir a escolha entre ambiente empresarial e residencial
- iniciar a jornada de cadastro

Melhorias aplicadas:

- reorganizacao completa do layout
- uso de shell visual mais profissional
- cards de ambiente mais claros
- textos institucionais mais alinhados ao contexto da disciplina
- destaque para fluxo supervisionado, XP, LQ e aprovacao

### 3.2 Escolha de perfil

Arquivo principal:

- `app/escolha-classe/[tipo].tsx`

Objetivo:

- selecionar o tipo de usuario de acordo com o ambiente escolhido

Perfis contemplados:

- empresarial: gestor e colaborador
- residencial: responsavel e usuario

Melhorias aplicadas:

- renomeacao visual dos perfis para linguagem mais profissional
- continuidade visual com a tela inicial
- melhor distribuicao de espacamento e hierarquia de texto

### 3.3 Cadastro

Arquivo principal:

- `app/cadastro.tsx`

Objetivo:

- cadastrar usuario com nome, senha, observacao e companheiro visual

Melhorias aplicadas:

- adicao de senha no fluxo
- persistencia local do usuario criado
- retorno consistente ao fluxo certo do ambiente escolhido
- formulario mais organizado visualmente

### 3.4 Login

Arquivo principal:

- `app/login.tsx`

Objetivo:

- permitir retorno ao app usando usuario e senha ja cadastrados

Melhorias aplicadas:

- tela de login separada e clara
- validacao de senha incorreta
- acesso ao fluxo salvo do usuario
- visual padronizado com o onboarding

### 3.5 Painel principal

Arquivo principal:

- `app/(tabs)/index.tsx`

Objetivo:

- mostrar resumo da operacao para gestor
- mostrar progresso pessoal para colaborador

Melhorias aplicadas:

- cards com leitura rapida de status
- indicadores visuais de produtividade
- novos graficos para apresentacao
- unificacao entre leitura operacional e desempenho individual
- barra de XP para perfis que executam as missoes
- correcao de navegacao do menu para a rota correta do painel

### 3.6 Missoes

Arquivo principal:

- `app/(tabs)/explore.tsx`

Objetivo:

- gestor cria missoes
- colaborador visualiza, pega e conclui missoes

Fluxo funcional entregue:

- criacao de missao pelo gestor
- salvamento em `db.json` por meio do `json-server`
- exibicao para o colaborador
- botao para pegar missao
- envio de conclusao com resumo e motivo de atraso
- envio de motivo de nao conclusao
- aprovacao posterior do gestor

Melhorias aplicadas:

- separacao correta entre quem cria e quem executa
- criacao restrita ao superior
- calculo automatico de XP por dificuldade e duracao
- manutencao do LQ definido na missao
- cards mais claros e fluxo mais facil de explicar em sala

### 3.7 Validacoes

Arquivo principal:

- `app/(tabs)/validations.tsx`

Objetivo:

- acompanhar pendencias de aprovacao, justificativas e conclucoes

Melhorias aplicadas:

- nova tela dedicada para o papel do gestor
- grafico de barras
- grafico de linha
- grafico de pizza
- leitura da fila de validacao
- resumo mais adequado para explicacao em sala

### 3.8 Recompensas

Arquivo principal:

- `app/(tabs)/rewards.tsx`

Objetivo:

- mostrar como o sistema trabalha com XP, LQ e previsao de LQS

Melhorias aplicadas:

- nova tela dedicada a progresso e recompensas
- graficos de comparacao
- separacao entre moeda virtual e recompensa especial
- resumo explicando o calculo automatico de XP

### 3.9 Perfil

Arquivo principal:

- `app/(tabs)/profile.tsx`

Objetivo:

- apresentar dados do usuario da demonstracao

Melhorias aplicadas:

- nova tela de perfil
- indicadores de nivel, XP e LQ
- resumo do papel do usuario no sistema
- integracao com logout

### 3.10 Foco

Arquivo principal:

- `app/(tabs)/arena.tsx`

Objetivo:

- oferecer um modulo curto de foco e descompressao com recompensa em `LQ`

Melhorias aplicadas:

- troca do jogo improvisado por um modulo mais limpo de concentracao
- integracao com historico de foco
- recompensa em `LQ`
- impacto no indicador de foco do usuario

## 4. Melhorias estruturais realizadas

### 4.1 Visual e experiencia

- criacao de tema central em `constants/lifequest-theme.ts`
- criacao de tipografia padronizada em `constants/lifequest-typography.ts`
- carregamento de fontes com Expo em `app/_layout.tsx`
- fundo visual mais refinado em `components/lifequest-background.tsx`
- menu hamburguer com navegacao interna em `components/lifequest-menu.tsx`
- shell reutilizavel de acesso em `components/lifequest-auth-shell.tsx`

### 4.2 Graficos e leitura de dados

- criacao de `components/lifequest-charts.tsx`
- uso de grafico de barras
- uso de grafico de linha
- uso de grafico de pizza
- uso de indicadores segmentados

### 4.3 Regras de negocio

- separacao clara entre quem cria e quem executa missoes
- aprovacao final sempre feita pelo superior
- registro de justificativa de atraso
- registro de justificativa de nao conclusao
- calculo automatico de XP
- manutencao do LQ como moeda virtual

### 4.4 Persistencia e funcionamento da demo

- login salvo localmente
- reentrada do usuario no fluxo usando nome e senha
- suporte a `json-server` para compartilhar missoes
- fallback local de carregamento para manter a demo utilizavel

## 5. Base de dados da demonstracao

Arquivo principal:

- `db.json`

Estado da base:

- 35 missoes de exemplo
- combinacao entre abertas, em andamento, em aprovacao, com justificativa e aprovadas

Objetivo da base:

- facilitar a demonstracao sem depender de criar tudo manualmente em sala
- alimentar os graficos e os paineis com volume visual adequado

## 6. Testes e evidencias

Arquivos principais:

- `tests/e2e/lifequest.spec.ts`
- `docs/Testes-Playwright.md`
- `tests/evidencias/`

Status:

- 10 casos de teste automatizados
- 10 prints de evidencia no repositorio

Casos cobertos:

1. tela inicial
2. escolha de classe empresarial
3. cadastro de gestor
4. login invalido
5. criacao de missao
6. dashboard de colaborador
7. tela de missoes do colaborador
8. formulario de criacao do gestor
9. modulo de foco
10. navegacao principal

## 7. SDD

Arquivo principal:

- `docs/SDD-processo.md`

O processo foi incluido na entrega para demonstrar:

- levantamento do requisito
- analise de impacto
- implementacao controlada
- revisao de seguranca
- teste automatizado
- fechamento para entrega

## 8. Seguranca

Arquivo principal:

- `docs/OWASP-relatorio.md`

Foi incluido um relatorio baseado em OWASP para registrar o estado atual da demo.

Pontos relevantes:

- a demo funciona bem para apresentacao
- ainda existem riscos esperados por ser um sistema sem backend real
- o relatorio separa itens resolvidos, parciais e pendentes

## 9. O que foi adicionado

- tela de login persistente
- senha no cadastro
- tela de validacoes
- tela de recompensas
- tela de perfil
- modulo de foco com historico
- menu hamburguer
- graficos
- fontes customizadas
- shell visual de onboarding
- relatorios e documentacao complementar

## 10. O que foi melhorado

- visual do app
- consistencia entre telas
- navegacao
- leitura de produtividade
- demonstracao de missoes
- organizacao da entrega da disciplina

## 11. O que foi corrigido

- rota quebrada do painel no navegador
- fluxo de retorno por login
- exibicao das missoes entre gestor e colaborador
- distribuicao de missoes no banco local
- erros de navegacao entre telas internas

## 12. Conclusao

O LifeQuest foi consolidado como uma demo academica funcional, visualmente mais profissional e melhor estruturada para apresentacao. A versao final entregue mostra um fluxo coerente de acesso, criacao de missoes, execucao, aprovacao, progresso, recompensas, foco, testes automatizados, evidencias em print e documentacao de seguranca.
