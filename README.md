# 🍊 Orange Finance

Dashboard interativo de gestão financeira para a **Orange Viagens**.

## 🌐 Live

**[orange-finance-dashboard.netlify.app](https://orange-finance-dashboard.netlify.app)**

## Stack

- **Frontend:** React 18 + Tailwind CSS + Recharts
- **Backend:** Supabase (PostgreSQL)
- **Deploy:** Netlify (static site)

## Funcionalidades

- **Dashboard com cards resumo** — Total disponível, Bancos Brasil, Adquirentes, Bancos USA, Crédito Cartões
- **Tabelas editáveis** — Clique em qualquer saldo para editar inline, salva direto no Supabase
- **Gráficos interativos** — Pizza (distribuição por categoria) + Barras (top 10 bancos)
- **Câmbio em tempo real** — Cotação USD/EUR editável
- **Créditos especiais** — Saldo projetado com linhas de crédito
- **A Receber** — Controle de recebíveis de adquirentes
- **Limites de cartão** — Controle de limites disponíveis

## Banco de Dados (Supabase)

| Tabela | Descrição |
|--------|-----------|
| `bank_accounts` | Contas bancárias (BR, adquirentes, USA) |
| `credit_limits` | Limites de cartão de crédito |
| `receivables` | Valores a receber |
| `exchange_rates` | Cotações USD/EUR |
| `special_credits` | Cheque especial e linhas de crédito |

## Deploy

O `index.html` é um arquivo autocontido — basta servir como site estático.

```bash
# Via Netlify CLI
netlify deploy --prod --dir .
```

---

**Orange Viagens** · Gestão Financeira
