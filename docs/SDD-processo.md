# Processo SDD - LifeQuest

## Objetivo

Padronizar o desenvolvimento do projeto LifeQuest com foco em:

- definicao clara do requisito
- implementacao controlada
- validacao funcional
- revisao basica de seguranca
- registro de evidencias

Neste projeto, SDD foi aplicado como um processo de desenvolvimento orientado por seguranca e demonstracao academica.

## Fluxo adotado

1. Levantamento do requisito
   - registrar o que a tela ou funcionalidade deve fazer
   - identificar quem usa: gestor, responsavel, funcionario ou crianca

2. Analise de impacto
   - definir arquivos afetados
   - verificar impacto em missoes, progresso, login e armazenamento local

3. Implementacao controlada
   - fazer alteracoes pequenas e rastreaveis
   - manter regras centrais no contexto `lifequest-demo-context.tsx`
   - separar narrativa, visual e regra de negocio

4. Revisao de seguranca
   - revisar armazenamento de senha
   - revisar uso de `AsyncStorage`
   - revisar URLs HTTP
   - revisar dependencias com `npm audit`
   - revisar autorizacao apenas no cliente

5. Teste automatizado
   - criar cenarios em Playwright
   - capturar prints de evidencia
   - guardar as evidencias em `tests/evidencias/`

6. Fechamento para entrega
   - atualizar documentacao
   - registrar achados OWASP como resolvidos ou pendentes
   - publicar no GitHub

## Artefatos do processo

- Configuracao E2E: `playwright.config.ts`
- Casos de teste: `tests/e2e/lifequest.spec.ts`
- Evidencias: `tests/evidencias/`
- Relatorio de testes: `docs/Testes-Playwright.md`
- Relatorio de seguranca: `docs/OWASP-relatorio.md`
- Checklist de revisao: `.github/pull_request_template.md`

## Criterios minimos antes da entrega

- Projeto abre no Expo Web
- JSON Server responde em `http://127.0.0.1:3001/missions`
- 10 casos de teste existentes
- Evidencias em PNG geradas
- Relatorio OWASP atualizado

## Como executar o processo no projeto

```powershell
cd "C:\Users\joaog\OneDrive\Área de Trabalho\Codigo Do App LifeQuest\LifeQuest"
npm install
npm run test:e2e
```

## Observacao academica

Como o projeto foi desenvolvido para demonstracao de disciplina com foco em frontend, parte dos controles de seguranca ainda depende de backend real para ser resolvida de forma definitiva. Esses pontos foram registrados no relatorio OWASP como pendentes.
