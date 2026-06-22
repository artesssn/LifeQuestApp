# Relatorio OWASP - LifeQuest

Data de referencia da analise: 21/06/2026

## Resumo executivo

O projeto atende bem a demonstracao funcional da disciplina, mas ainda possui riscos importantes de seguranca por ser uma demo frontend sem backend real.

Status geral:

- M1 Credenciais: nao resolvido
- M2 Supply chain: nao resolvido
- M3 Autenticacao e autorizacao: nao resolvido
- M4 Validacao de entrada: parcialmente resolvido
- M5 Comunicacao insegura: nao resolvido
- M6 Privacidade: nao resolvido

Risco geral atual: **alto**

## Itens analisados e status

### M1 - Improper Credential Usage

Status: **nao resolvido**

Achados:

- Senhas de usuario sao armazenadas em texto puro no estado e persistidas em `AsyncStorage`.
  Arquivos:
  - `contexts/lifequest-demo-context.tsx`
  - `app/cadastro.tsx`
  - `app/login.tsx`
- Comparacao de senha e feita apenas no cliente.
- Nao existe cofre seguro como `expo-secure-store`.

Impacto:

- quem tiver acesso ao armazenamento local do app pode recuperar contas da demo
- credenciais nao possuem protecao criptografica

Observacao positiva:

- nao foram encontrados tokens hardcoded
- nao foram encontrados certificados privados no repositorio
- os campos de senha usam `secureTextEntry` na interface

### M2 - Inadequate Supply Chain Security

Status: **nao resolvido**

Comando executado:

```powershell
npm audit --json
```

Resumo do audit:

- 2 vulnerabilidades criticas
- 36 altas
- 30 moderadas
- 94 baixas

Principais pacotes criticos/altos:

- `shell-quote`
  - severidade: critica
  - advisory: `GHSA-w7jw-789q-3m8p`
  - CVSS: 8.1
- `react-devtools-core`
  - severidade: critica
  - impacto herdado por `shell-quote` e `ws`
- `ws`
  - severidade: alta
  - advisory: `GHSA-96hv-2xvq-fx4p`
  - CVSS: 7.5
- `undici`
  - severidade: alta
  - advisory: `GHSA-vxpw-j846-p89q`
  - CVSS: 7.5
- `react-native`
  - severidade: alta por cadeia transitiva

Impacto:

- ambiente de desenvolvimento e build exposto a dependencias com falhas conhecidas
- risco maior no ecossistema de desenvolvimento do que no app final da demo

Medida aplicada nesta entrega:

- inclusao de script `security:audit`
- registro formal do risco no repositorio

### M3 - Insecure Authentication / Authorization

Status: **nao resolvido**

Achados:

- autenticacao e 100 por cento client-side
- autorizacao e baseada apenas no perfil salvo localmente
- nao existe JWT, sessao expirada, refresh token ou invalidacao remota
- nao existe rate limit ou bloqueio por tentativas invalidas

Impacto:

- qualquer manipulacao local do estado pode trocar o perfil ativo
- nao ha garantias reais de identidade ou permissao

Observacao:

- para o escopo academico da demo isso funciona
- para producao seria obrigatorio backend com sessao real

### M4 - Insufficient Input / Output Validation

Status: **parcialmente resolvido**

Achados:

- existe validacao minima por tamanho em cadastro e criacao de missao
- nao existe validacao schema-based com `Zod` ou `Yup`
- textos enviados ao JSON Server nao passam por sanitizacao adicional

Impacto:

- entrada inconsistente pode ser salva na base da demo
- aumenta risco futuro caso o app ganhe backend real ou renderizacao HTML

Observacao positiva:

- nao ha `WebView`
- nao ha leitura de `Clipboard`
- nao foram identificados `console.log` expondo senha ou token nas telas principais

### M5 - Insecure Communication

Status: **nao resolvido**

Achados:

- o app usa HTTP puro para falar com o `json-server`
- a URL e montada dinamicamente em:
  - `contexts/lifequest-demo-context.tsx`
- nao existe TLS, pinning ou assinatura de resposta

Impacto:

- em rede real, trafego pode ser interceptado
- qualquer dado da missao pode sofrer leitura ou alteracao por MITM

Observacao:

- como a base atual usa `json-server` local, isso foi mantido por causa da demo

### M6 - Inadequate Privacy Controls

Status: **nao resolvido**

Achados:

- nome, perfil, limitacao e senha ficam persistidos localmente
- nao existe politica de retencao
- nao existe tela de consentimento ou privacidade
- nao existe fluxo de exclusao de dados

Impacto:

- dados pessoais simples ficam mantidos sem governanca
- o app nao esta pronto para LGPD em cenario real

## Itens resolvidos nesta fase

- Nao foram encontrados segredos hardcoded de API no codigo do app.
- Nao foram encontrados logs de token ou senha nas telas principais.
- Nao ha uso de WebView nem de leitura de clipboard.
- Foi incluido processo SDD no repositorio.
- Foi incluido checklist de seguranca em pull request.
- Foram incluidos testes E2E com evidencias para suporte da validacao funcional.

## Itens pendentes para uma versao de producao

1. Migrar senha e dados sensiveis para `expo-secure-store`.
2. Criar backend real com autenticacao e autorizacao.
3. Remover HTTP local e adotar HTTPS.
4. Adicionar validacao de entrada com schema.
5. Tratar vulnerabilidades do `npm audit` por upgrade controlado do ecossistema Expo.
6. Criar politica de privacidade e fluxo de exclusao de dados.
