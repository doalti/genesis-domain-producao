# Knowledge

Base de conhecimento logístico derivada da documentação oficial [Sankhya Ajuda](https://ajuda.sankhya.com.br/hc/pt-br) — módulo Logística / WMS.

## Estrutura de arquivos

```
src/core/knowledge/
├── producao-wms-expedicao-playbook.ts
├── sankhya-producao-pcp-protocol.ts
└── index.ts                    # compõe PRODUCAO_DOMAIN_KNOWLEDGE
```

## Fontes Sankhya Ajuda (referência)

| Tema | URL |
|------|-----|
| Expedição de Mercadorias | https://ajuda.sankhya.com.br/hc/pt-br/articles/360044611474 |
| Formação de Carga | https://ajuda.sankhya.com.br/hc/pt-br/articles/360044612274 |
| Gerência do WMS | https://ajuda.sankhya.com.br/hc/pt-br/articles/360045120453 |
| Cadastro produto WMS | https://ajuda.sankhya.com.br/hc/pt-br/articles/4403024825623 |

## `PRODUCAO_DOMAIN_KNOWLEDGE`

Documento consolidado para injeção em prompt — agrega playbooks WMS/expedição e orientações QueryModel.

## Playbook expedição — `PRODUCAO_WMS_EXPEDICAO_PLAYBOOK`

**Quando aplicar:** expedição, WMS, separação, picking, ordem de carga, endereço de armazenamento.

### Fluxo operacional

1. Formação de Carga → enviar para expedição
2. Tratar corte de pedido se estoque insuficiente
3. Monitorar tarefas na Gerência do WMS
4. Conferência → faturamento

## Protocolo WMS — `SANKHYA_PRODUCAO_PCP_PROTOCOL`

**Quando aplicar:** tarefas WMS, reabastecimento, inventário, dependências entre tarefas.

### Tipos de tarefa

Expedição, Reabastecimento, Recebimento, Transferência, Inventário, Recontagem.
