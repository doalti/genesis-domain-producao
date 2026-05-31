# Visão geral

## O que é

`@genesis/domain-producao` é um pacote npm **privado** que encapsula o domínio logístico no contexto do ERP Sankhya OM (Produção, OP, apontamento, PCP). Ele não executa queries, não valida SQL e não orquestra conversas — entrega **conteúdo** e **hints semânticos** para serem consumidos por um runtime externo.

## Responsabilidades

| Incluído | Descrição |
|----------|-----------|
| **Knowledge** | Playbooks e protocolos sobre WMS, expedição, formação de carga e estoque |
| **Query hints** | Tradução de pedidos em NL para sugestões de tabelas, joins, dimensões e métricas |
| **Contrato `DomainPlugin`** | Interface mínima para registro em consumidores |

## Fora de escopo

- Routing, classificação de intenção ou sticky domain
- Validators SQL ou regras de runtime
- Tools (`query_data`, `build_query_model`, `describe_table`)
- Platform, bootstrap, registry
- **RH / Departamento Pessoal** (folha, eSocial, Pessoal+) — owner `@genesis/domain-rh`
- Outros domínios (fiscal, finance, commercial, …)

## Cobertura logística

| Tema | Cobertura |
|------|-----------|
| WMS | Gerência de tarefas, picking, pulmão, reabastecimento |
| Expedição | Formação de carga, separação, corte de pedido, conferência |
| Estoque | `TGFEST`, saldo ERP vs endereço WMS |
| Cadastros | Produto WMS, endereço de armazenamento, parceiro (logística entrega) |

## Privacidade

- Repositório GitHub: **PRIVATE** (`doalti/genesis-domain-producao`)
- Pacote npm: `"private": true`
