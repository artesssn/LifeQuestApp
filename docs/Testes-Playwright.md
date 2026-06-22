# Casos de Teste Playwright - LifeQuest

## Evidencias

As evidencias em imagem sao salvas em:

- `tests/evidencias/01-tela-inicial.png`
- `tests/evidencias/02-escolha-classe-empresarial.png`
- `tests/evidencias/03-dashboard-representante.png`
- `tests/evidencias/04-login-invalido.png`
- `tests/evidencias/05-criacao-missao.png`
- `tests/evidencias/06-dashboard-funcionario.png`
- `tests/evidencias/07-missoes-funcionario.png`
- `tests/evidencias/08-formulario-criacao.png`
- `tests/evidencias/09-arena-recompensa.png`
- `tests/evidencias/10-navegacao-abas.png`

## Casos implementados

1. Exibir a tela inicial com escolha de ambiente.
2. Navegar para a tela de escolha de classe empresarial.
3. Cadastrar um representante e abrir o dashboard.
4. Bloquear login com senha incorreta.
5. Criar uma missao empresarial como gestor.
6. Cadastrar um funcionario e abrir o dashboard pessoal.
7. Abrir a tela de missoes do funcionario com progresso de XP.
8. Abrir a tela de missoes do gestor com formulario de criacao.
9. Validar o mini game Arena e a geracao de recompensa.
10. Navegar entre Painel, Missoes e Arena.

## Observacao

Os testes usam:

- `Expo Web` para a interface
- `json-server` para compartilhamento de missoes
- `Playwright Chromium` para automacao e captura dos prints
