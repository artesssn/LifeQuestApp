# Roteiro de apresentacao - LifeQuest

## Abertura

O LifeQuest e um aplicativo mobile desenvolvido em Expo com foco em frontend. A ideia principal do sistema e transformar tarefas da vida real em missoes de um universo gamificado, misturando produtividade, organizacao e motivacao.

## Problema que o app resolve

Muitas vezes tarefas do dia a dia ou atividades de trabalho sao vistas como algo cansativo e sem incentivo. O LifeQuest propõe uma camada de jogo para tornar esse acompanhamento mais claro, visual e estimulante.

## Como o sistema funciona

Existem dois perfis principais:

- gestor ou responsavel
- trabalhador ou usuario que recebe a missao

O gestor cria a missao, define prazo e recompensa em LQ. O usuario acompanha a jornada dele no painel, ve o progresso e navega ate a tela de missoes.

## Parte gamificada

O usuario ganha:

- XP, calculado automaticamente pelo sistema
- niveis, que ficam progressivamente mais dificeis
- LQ, moeda virtual do app

Tambem existe a Arena, que e um mini game de foco e desestresse, usado para complementar a experiencia e gerar mais LQ.

## Parte de produtividade

No painel do gestor existe um radar de produtividade para acompanhar a equipe.

No painel do trabalhador existe uma leitura do desempenho pessoal, mostrando evolucao, foco e ritmo.

## Engenharia do projeto

O projeto foi estruturado em Expo com React Native e Expo Router. Para simular o backend na demonstracao foi usado JSON Server. Alem disso, o projeto inclui:

- processo SDD documentado
- 10 testes automatizados com Playwright
- evidencias em print
- relatorio de seguranca baseado em OWASP

## Encerramento

Entao o LifeQuest nao e apenas uma interface visual. Ele demonstra fluxo funcional, organizacao do projeto, validacao por testes e preocupacao com seguranca, mesmo sendo uma entrega academica com foco principal em frontend.
