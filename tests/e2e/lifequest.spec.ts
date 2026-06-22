import { expect, test, type Page } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const EVIDENCE_DIR = path.resolve(process.cwd(), 'tests', 'evidencias');
const API_BASE_URL = 'http://127.0.0.1:3001';
const DB_PATH = path.resolve(process.cwd(), 'db.json');

type Environment = 'empresarial' | 'residencial';
type Role = 'representante' | 'profissionais' | 'guardiao' | 'heroi';

type MissionRecord = {
  id: string;
  title: string;
  state: 'available' | 'awaiting_approval' | 'approved' | 'reported_issue';
  assigneeName?: string;
  completionRequest?: { summary: string; delayReason: string };
  issueReport?: { reason: string };
};

async function saveEvidence(page: Page, fileName: string) {
  await mkdir(EVIDENCE_DIR, { recursive: true });
  await page.screenshot({
    fullPage: true,
    path: path.join(EVIDENCE_DIR, fileName),
  });
}

async function api<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, init);

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status} em ${endpoint}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function resetMissionBank() {
  const missions = await api<MissionRecord[]>('/missions');

  for (const mission of missions) {
    await api(`/missions/${mission.id}`, { method: 'DELETE' });
  }
}

async function getMissionByTitle(title: string) {
  const raw = await readFile(DB_PATH, 'utf-8');
  const parsed = JSON.parse(raw) as { missions?: MissionRecord[] };
  const missions = parsed.missions ?? [];

  const mission = missions.find((item) => item.title === title);

  if (!mission) {
    throw new Error(`Missao "${title}" nao encontrada no json-server.`);
  }

  return mission;
}

async function beginRegistration(page: Page) {
  await page.goto('/');

  if (await page.getByTestId('login-title').isVisible().catch(() => false)) {
    await page.getByTestId('login-create-user-button').click();
  }

  await expect(page.getByTestId('welcome-title')).toBeVisible();
}

async function registerUser(
  page: Page,
  {
    environment,
    role,
    name,
    password,
    limitation = '',
  }: {
    environment: Environment;
    role: Role;
    name: string;
    password: string;
    limitation?: string;
  },
) {
  await beginRegistration(page);
  await page.getByTestId(`environment-${environment}`).click();
  await expect(page.getByTestId('class-title')).toBeVisible();
  await page.getByTestId(`role-${role}`).click();
  await expect(page.getByTestId('register-title')).toBeVisible();
  await page.getByTestId('register-name-input').fill(name);
  await page.getByTestId('register-password-input').fill(password);

  if (limitation) {
    await page.getByTestId('register-limitation-input').fill(limitation);
  }

  await page.getByTestId('register-submit-button').click();
  await expect(page.getByTestId('dashboard-title')).toContainText(name);
}

async function loginUser(page: Page, name: string, password: string) {
  await page.goto('/login');
  await expect(page.getByTestId('login-title')).toBeVisible();
  await page.getByTestId('login-name-input').fill(name);
  await page.getByTestId('login-password-input').fill(password);
  await page.getByTestId('login-submit-button').click();
  await expect(page.getByTestId('dashboard-title')).toContainText(name);
}

async function logoutUser(page: Page) {
  if (!(await page.getByTestId('dashboard-title').isVisible().catch(() => false))) {
    await page.getByText(/^Painel$/).click();
    await expect(page.getByTestId('dashboard-title')).toBeVisible();
  }

  await page.getByTestId('logout-button').click({ force: true });
  await expect(page.getByTestId('login-title')).toBeVisible();
}

async function openMissions(page: Page) {
  if (await page.getByTestId('missions-title').isVisible().catch(() => false)) {
    return;
  }

  await page.getByText(/^Missoes$/).click();
  await expect(page.getByTestId('missions-title')).toBeVisible();
}

async function openArena(page: Page) {
  if (await page.getByTestId('arena-title').isVisible().catch(() => false)) {
    return;
  }

  await page.getByText(/^Arena$/).click();
  await expect(page.getByTestId('arena-title')).toBeVisible();
}

async function createMission(page: Page, title: string) {
  await openMissions(page);
  await page.getByTestId('mission-title-input').fill(title);
  await page.getByTestId('mission-description-input').fill(
    'Executar a entrega da atividade e registrar no sistema.',
  );
  await page.getByTestId('mission-category-desafio').click();
  await page.getByTestId('mission-difficulty-media').click();
  await page.getByTestId('mission-duration-media').click();
  await page.getByTestId('mission-due-input').fill('Ate sexta, 18:00');
  await page.getByTestId('mission-lq-input').fill('45');
  await page.getByTestId('mission-create-button').click();
  await expect
    .poll(async () => {
      const mission = await getMissionByTitle(title).catch(() => null);
      return mission?.title ?? null;
    }, { timeout: 15000 })
    .toBe(title);
}

async function claimMission(page: Page, title: string) {
  await openMissions(page);
  await expect(page.getByText(title)).toBeVisible({ timeout: 15000 });
  const mission = await getMissionByTitle(title);
  await page.getByTestId(`claim-mission-${mission.id}`).click();
  await expect(page.getByTestId(`completion-note-${mission.id}`)).toBeVisible();
}

async function submitMissionForApproval(page: Page, title: string) {
  await openMissions(page);
  const mission = await getMissionByTitle(title);
  await page.getByTestId(`completion-note-${mission.id}`).fill(
    'Atividade finalizada e validada no fluxo interno.',
  );
  await page.getByTestId(`delay-note-${mission.id}`).fill('Demorou por ajuste de prioridade.');
  await page.getByTestId(`submit-approval-${mission.id}`).click();
  await expect(page.getByText('Em analise do superior')).toBeVisible();
}

async function reportMissionIssue(page: Page, title: string) {
  await openMissions(page);
  const mission = await getMissionByTitle(title);
  await page.getByTestId(`issue-note-${mission.id}`).fill(
    'Nao foi possivel concluir porque faltou retorno do cliente.',
  );
  await page.getByTestId(`report-issue-${mission.id}`).click();
  await expect(page.getByText('Nao concluidas')).toBeVisible();
}

async function playPerfectArena(page: Page) {
  await openArena(page);
  await page.getByTestId('arena-start-button').click();

  const runeMap: Record<string, string> = {
    'Sol de foco': 'sol',
    'Lua calma': 'luna',
    'Folha vital': 'folha',
  };

  for (let round = 0; round < 8; round += 1) {
    const targetTitle = (await page.getByTestId('arena-target-title').textContent())?.trim() ?? '';
    const runeId = runeMap[targetTitle];

    if (!runeId) {
      throw new Error(`Runa alvo desconhecida: ${targetTitle}`);
    }

    await page.getByTestId(`rune-${runeId}`).click();
    await page.waitForTimeout(450);
  }

  await expect(page.getByText('Resultado da ultima sessao')).toBeVisible({ timeout: 10000 });
}

test.describe('LifeQuest demo e evidencias', () => {
  test.beforeEach(async () => {
    await resetMissionBank();
  });

  test('01 - exibe a tela inicial com ambientes', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('welcome-title')).toBeVisible();
    await expect(page.getByTestId('environment-empresarial')).toBeVisible();
    await expect(page.getByTestId('environment-residencial')).toBeVisible();
    await saveEvidence(page, '01-tela-inicial.png');
  });

  test('02 - navega para a escolha de classe empresarial', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('environment-empresarial').click();
    await expect(page.getByTestId('class-title')).toBeVisible();
    await expect(page.getByTestId('role-representante')).toBeVisible();
    await expect(page.getByTestId('role-profissionais')).toBeVisible();
    await saveEvidence(page, '02-escolha-classe-empresarial.png');
  });

  test('03 - cadastra representante e acessa o dashboard', async ({ page }) => {
    await registerUser(page, {
      environment: 'empresarial',
      role: 'representante',
      name: 'Gestor Demo 03',
      password: '1234',
    });
    await expect(page.getByTestId('dashboard-story-card')).toBeVisible();
    await saveEvidence(page, '03-dashboard-representante.png');
  });

  test('04 - bloqueia login com senha incorreta', async ({ page }) => {
    await registerUser(page, {
      environment: 'empresarial',
      role: 'representante',
      name: 'Gestor Demo 04',
      password: '1234',
    });
    await logoutUser(page);
    await page.getByTestId('login-name-input').fill('Gestor Demo 04');
    await page.getByTestId('login-password-input').fill('9999');
    await page.getByTestId('login-submit-button').click();
    await expect(page.getByText('Usuario ou senha invalidos.')).toBeVisible();
    await saveEvidence(page, '04-login-invalido.png');
  });

  test('05 - gestor cria uma missao empresarial', async ({ page }) => {
    const missionTitle = `Entrega PW 05 ${Date.now()}`;

    await registerUser(page, {
      environment: 'empresarial',
      role: 'representante',
      name: 'Gestor Demo 05',
      password: '1234',
    });
    await createMission(page, missionTitle);
    await expect
      .poll(async () => {
        const mission = await getMissionByTitle(missionTitle).catch(() => null);
        return mission?.state ?? null;
      }, { timeout: 15000 })
      .toBe('available');
    await saveEvidence(page, '05-criacao-missao.png');
  });

  test('06 - cadastra funcionario e abre dashboard pessoal', async ({ page }) => {
    await registerUser(page, {
      environment: 'empresarial',
      role: 'profissionais',
      name: 'Funcionario Demo 06',
      password: '1234',
    });
    await expect(page.getByTestId('dashboard-title')).toContainText('Funcionario Demo 06');
    await saveEvidence(page, '06-dashboard-funcionario.png');
  });

  test('07 - funcionario abre a tela de missoes e ve progresso de xp', async ({ page }) => {
    await registerUser(page, {
      environment: 'empresarial',
      role: 'profissionais',
      name: 'Funcionario Demo 07',
      password: '1234',
    });
    await openMissions(page);
    await expect(page.getByText('Nivel 1').first()).toBeVisible();
    await expect(page.getByText('Sua campanha atual')).toBeVisible();
    await saveEvidence(page, '07-missoes-funcionario.png');
  });

  test('08 - gestor abre a tela de missoes e ve o formulario de criacao', async ({ page }) => {
    await registerUser(page, {
      environment: 'empresarial',
      role: 'representante',
      name: 'Gestor Demo 08',
      password: '1234',
    });
    await openMissions(page);
    await expect(page.getByText('Nova missao')).toBeVisible();
    await expect(page.getByTestId('mission-create-button')).toBeVisible();
    await saveEvidence(page, '08-formulario-criacao.png');
  });

  test('09 - arena gera resultado e recompensa de foco', async ({ page }) => {
    await registerUser(page, {
      environment: 'empresarial',
      role: 'profissionais',
      name: 'Funcionario Demo 09',
      password: '1234',
    });
    await playPerfectArena(page);
    await expect(page.getByText(/recebeu/i)).toBeVisible();
    await saveEvidence(page, '09-arena-recompensa.png');
  });

  test('10 - funcionario navega entre painel, missoes e arena', async ({ page }) => {
    await registerUser(page, {
      environment: 'empresarial',
      role: 'profissionais',
      name: 'Funcionario Demo 10',
      password: '1234',
    });
    await openMissions(page);
    await expect(page.getByTestId('missions-title')).toBeVisible();
    await openArena(page);
    await expect(page.getByTestId('arena-title')).toBeVisible();
    await page.getByText(/^Painel$/).click();
    await expect(page.getByTestId('dashboard-title')).toContainText('Funcionario Demo 10');
    await saveEvidence(page, '10-navegacao-abas.png');
  });
});
