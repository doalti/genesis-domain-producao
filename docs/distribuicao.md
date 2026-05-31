# Distribuição e consumo

Modelo recomendado para projetos consumidores (ex.: `genesis-platform`): **Git como fonte de versão**, referência `github:doalti/…` **sem sufixo de branch**, reprodutibilidade via **`package-lock.json`**.

## Modelo recomendado

Formato **obrigatório** no `package.json` do consumidor — sem `#main`, `#v1.0.0` nem `#abc1234`:

```json
"@genesis/domain-producao": "github:doalti/genesis-domain-producao"
```

O npm resolve a **branch default** do repositório (normalmente `main`); o lockfile grava o commit SHA instalado.

```bash
npm install
npm update @genesis/domain-producao
```

Requer autenticação GitHub com acesso ao repositório privado `doalti/genesis-domain-producao`.

## Reprodutibilidade: `package-lock.json`

- `npm install` → usa o commit já fixado no lockfile (build reproduzível)
- `npm update @genesis/domain-producao` → puxa o último commit da branch default e atualiza o lockfile

**Regra para consumidores:** commitar sempre o `package-lock.json`.

## Publicar neste repositório

Quando pedir **publique**, seguir `.cursor/rules/publish-github.mdc`:

```bash
npm run publish:github -- "fix: motivo da alteração"
```

## Fluxo no `genesis-domain-producao`

1. Alterar código em `src/`
2. `npm test && npm run build`
3. Commit + push para `main` (ou `npm run publish:github`)

## Privacidade

- Repositório **PRIVATE**
- `"private": true` no `package.json`
- **Sem** publicação no npmjs.com

## Resumo

```
genesis-domain-producao     push → main (privado)
        ↓
genesis-platform          "@genesis/domain-producao": "github:doalti/genesis-domain-producao"
                            + package-lock.json commitado
                            + npm update / sync:functions-vendors quando integrar
```
