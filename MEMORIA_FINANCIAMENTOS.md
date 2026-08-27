# MEMÓRIA DE SESSÃO - MÓDULO FINANCIAMENTOS
**Data:** 2026-08-26  
**Status:** Análise completa concluída - Pronto para implementação (Fase 1)  
**Próxima ação:** Iniciar Fase 1 (Migração SQL + Types + Store + Server Functions)

---

## CONTEXTO ATUAL DO PROJETO

### Stack
- **Runtime:** Bun
- **Framework:** TanStack Start (React 19) + SSR
- **Routing:** TanStack Router (file-based)
- **Database:** Supabase (PostgreSQL) com RLS
- **Auth:** Supabase Auth + `user_roles` (admin/user) + RPC `has_role`
- **State:** TanStack Query + cache reativo em `store.ts`
- **UI:** TailwindCSS v4 + Radix UI (shadcn/ui)
- **Build:** Vite + Nitro (Cloudflare) via `@lovable.dev/vite-tanstack-config`

### Estrutura Existente Relevante
```
src/
├── lib/db/
│   ├── types.ts      # Tipos TypeScript (single source of truth)
│   └── store.ts      # Cache reativo + CRUD Supabase
├── integrations/supabase/
│   ├── client.ts          # Cliente browser (anon key)
│   ├── client.server.ts   # Cliente server (service role)
│   └── types.ts           # Tipos gerados do Supabase
├── lib/auth/
│   ├── auth-service.ts          # Auth client-side
│   └── admin-bootstrap.functions.ts # Server functions
└── routes/admin/financeiro/     # Rotas financeiras existentes
```

---

## ARQUITETURA DO MÓDULO FINANCIAMENTOS - DECISÕES TOMADAS

### Princípios Arquiteturais
1. **Abstração total** - Frontend NÃO conhece bancos específicos
2. **Server-side only** - Integrações bancárias só no backend (Server Functions)
3. **Concorrência controlada** - `Promise.allSettled` para 5 instituições simultâneas
4. **Persistência total** - Histórico completo de simulações e resultados
5. **LGPD by design** - Criptografia AES-256-GCM, consentimento, retenção automática

### Limites Definidos
- **Máx 5 instituições por simulação** (hard limit)
- **Timeout individual:** 30s por banco
- **Timeout total:** 60s
- **Status flow:** rascunho → enviada → processando → com_resultados/erro_parcial/erro_total → convertida

---

## ENTIDADES/TABELAS (Migração SQL Preparada)

### 4 Novas Tabelas
1. **`financing_simulations`** - Simulação principal (veículo, cliente, parâmetros, LGPD)
2. **`financing_providers`** - Catálogo de bancos (configuração, regras, credenciais_ref)
3. **`financing_simulation_results`** - Resultado por instituição (status, taxas, valores, raw response)
4. **`financing_simulation_logs`** - Auditoria completa (eventos, timestamps, user/IP)

### Enums
- `financing_simulation_status`: rascunho, enviada, processando, com_resultados, erro_parcial, erro_total, expirada, convertida
- `financing_provider_status`: pendente, enviada, processando, aprovada, aprovada_com_restricao, reprovada, erro, timeout, nao_consultada

### Relacionamentos
```
vehicles (1) ←→ (N) financing_simulations
leads (1) ←→ (N) financing_simulations (opcional)
sales (1) ←→ (N) financing_simulations (quando convertida)
financing_simulations (1) ←→ (N) financing_simulation_results
financing_providers (1) ←→ (N) financing_simulation_results
financing_simulations (1) ←→ (N) financing_simulation_logs
```

---

## CAMADA DE ABSTRAÇÃO - PROVIDER PATTERN

### Interface Base (`FinancingProviderAdapter`)
```typescript
abstract class FinancingProviderAdapter {
  abstract readonly code: string;
  abstract readonly name: string;
  abstract readonly minInstallments: number;
  abstract readonly maxInstallments: number;
  abstract readonly minDownPaymentPercent: number;
  abstract readonly maxDownPaymentPercent: number;
  abstract readonly maxVehicleAgeYears: number;
  abstract readonly supportedVehicleCategories: string[];
  
  validateInput(input): { valid, errors }  // Validação local rápida
  abstract simulate(input): Promise<FinancingSimulationOutput>;
  abstract testConnection(): Promise<{ success, message }>;
}
```

### Factory
```typescript
FinancingProviderFactory.register("itau", ItauAdapter);
FinancingProviderFactory.register("bradesco", BradescoAdapter);
// ... etc
```

### 5 Bancos Iniciais (Configuração Only - Sem Integração Real)
| Código | Nome | Status |
|--------|------|--------|
| `itau` | Itaú Unibanco | Config only |
| `bradesco` | Banco Bradesco | Config only |
| `santander` | Banco Santander | Config only |
| `bb` | Banco do Brasil | Config only |
| `caixa` | Caixa Econômica Federal | Config only |

**IMPORTANTE:** Adapters reais SÓ serão implementados na Fase 4 com credenciais reais de homologação.

---

## FLUXO DE DADOS

```
Frontend (Wizard Multi-step)
    │
    ▼
Server Function: createFinancingSimulation (status: rascunho)
    │
    ▼
Usuário clica "Enviar para Análise"
    │
    ▼
Server Function: submitFinancingSimulation
    │
    ▼
SimulationOrchestrator.runSimulation()
    │
    ├──► Promise.allSettled([provider1.simulate(), provider2.simulate(), ...])
    │       │
    │       ├── Timeout individual (30s) por provider
    │       ├── Validação local prévia (rápida)
    │       └── Atualiza financing_simulation_results em tempo real
    │
    ▼
Consolidação → Status final (com_resultados | erro_parcial | erro_total)
    │
    ▼
Frontend exibe tabela comparativa → Usuário escolhe → Converte em venda
```

---

## SEGURANÇA E LGPD

### Criptografia (Obrigatória)
- **CPF/CNPJ** criptografados em repouso (AES-256-GCM)
- Chave: `FINANCING_ENCRYPTION_KEY` (32 bytes base64) em `.env`

### Variáveis de Ambiente Necessárias
```env
FINANCING_ENCRYPTION_KEY="..."
FINANCING_SIMULATION_EXPIRY_DAYS="7"
FINANCING_DATA_RETENTION_DAYS="180"
FINANCING_MAX_PROVIDERS_PER_SIMULATION="5"
FINANCING_PROVIDER_TIMEOUT_MS="30000"

# Credenciais por banco (Fase 4 - homologação)
FINANCING_ITAU_CLIENT_ID=""
FINANCING_ITAU_CLIENT_SECRET=""
FINANCING_BRADESCO_API_KEY=""
FINANCING_SANTANDER_CLIENT_ID=""
FINANCING_SANTANDER_CLIENT_SECRET=""
FINANCING_BB_CLIENT_ID=""
FINANCING_BB_CLIENT_SECRET=""
FINANCING_CAIXA_API_KEY=""
```

### Dados do Cliente (Para Simulação Real)
| Obrigatório | Sensível (LGPD) |
|-------------|-----------------|
| Nome, CPF/CNPJ, Telefone | ✅ |
| Data nascimento, Estado civil, Dependentes | ✅ |
| CEP, Endereço completo | ✅ |
| Ocupação, Empregador, Renda bruta, Tipo renda, Tempo emprego | ✅ |
| Email | ✅ |

### Job LGPD (pg_cron)
```sql
DELETE FROM financing_simulations 
WHERE data_retention_until < now() 
AND status NOT IN ('convertida');
```

---

## PLANO DE IMPLEMENTAÇÃO - 5 FASES

### FASE 1 - Fundação (Semana 1-2) **PRÓXIMA**
- [ ] Migração SQL completa (tabelas, enums, índices, RLS, triggers, seeds)
- [ ] Types TypeScript em `src/lib/db/types.ts`
- [ ] Store functions em `src/lib/db/store.ts` (CRUD + listeners)
- [ ] Server Functions base em `src/lib/financing/server-functions.ts`
- [ ] Provider Factory + Interface base em `src/lib/financing/providers/base.ts`
- [ ] Seed dos 5 bancos em `financing_providers`

### FASE 2 - UI Rascunho (Semana 2-3)
- [ ] Rota `/admin/financeiro/financiamentos` (lista + filtros)
- [ ] Wizard `/admin/financeiro/financiamentos/novo` (5 steps)
- [ ] Detalhe `/admin/financeiro/financiamentos/:id`
- [ ] Store reativo + subscribe

### FASE 3 - Processamento (Semana 3-4)
- [ ] SimulationOrchestrator com `Promise.allSettled`
- [ ] Server Function `submitFinancingSimulation`
- [ ] **Mock Adapters** para teste local (taxas fixas)
- [ ] Polling/Real-time no frontend
- [ ] Tabela comparativa de resultados

### FASE 4 - Integração Real (Semana 4-6) **REQUER CREDENCIAIS**
- [ ] Credenciais de homologação dos 5 bancos
- [ ] Adapters reais (mTLS, certificados, OAuth, etc.)
- [ ] Testes em sandbox
- [ ] Monitoramento (alertas, latency, success rate)

### FASE 5 - Recursos Avançados (Semana 6+)
- [ ] Conversão em venda (cria Sale + FinancialTransactions)
- [ ] Dashboard métricas financiamentos
- [ ] Relatórios CSV/PDF
- [ ] LGPD automation (job cron + API solicitação dados)
- [ ] Notificações email/WhatsApp
- [ ] Simulador público (embed no site)

---

## ARQUIVOS A CRIAR/MODIFICAR NA FASE 1

### Novos Arquivos
```
supabase/migrations/20260826_financing_module.sql
src/lib/financing/
├── types.ts                    # Tipos adicionais (ou em db/types.ts)
├── providers/
│   ├── base.ts                 # Interface + Factory
│   └── index.ts                # Registro dos providers
├── server-functions.ts         # Server Functions TanStack Start
├── simulation-orchestrator.ts  # Orquestrador concorrente
└── encryption.ts               # Criptografia LGPD
```

### Arquivos Existentes a Modificar
```
src/lib/db/types.ts             # + novos types
src/lib/db/store.ts             # + CRUD financing
src/routes/admin/financeiro.tsx # + link no sidebar
```

---

## COMANDOS ÚTEIS

```bash
# Desenvolvimento
bun dev

# Build
bun run build

# Lint/Format
bun lint
bun format

# Aplicar migração no Supabase (via Dashboard SQL Editor)
# Copiar conteúdo de supabase/migrations/20260826_financing_module.sql
```

---

## PENDÊNCIAS / DECISÕES NECESSÁRIAS

1. **Confirmação dos 5 bancos iniciais** - Itaú, Bradesco, Santander, BB, Caixa estão corretos?
2. **Campos extras** - Algum campo específico do fluxo comercial não coberto?
3. **Role "vendedor"** - Futuro: vendedores poderão criar simulações próprias?
4. **Simulador público** - Fase 5: embed no site para captura de leads?

---

## COMO RETOMAR NA PRÓXIMA SESSÃO

1. Ler este arquivo: `MEMORIA_FINANCIAMENTOS.md`
2. Executar: `bun dev` para confirmar ambiente
3. Iniciar **FASE 1** - Criar migração SQL e types
4. Aplicar migração no Supabase Dashboard
5. Implementar store functions e server functions base

---

**Último commit:** `689f6d4` (v7) - Zerar vendas + modais entradas/saídas/despesas  
**Branch:** `main` (sincronizado com origin/main)