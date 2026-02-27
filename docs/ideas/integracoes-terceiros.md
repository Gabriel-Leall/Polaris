# 🔗 Integrações com Terceiros (GitHub, Slack, etc.)

> Permitir que o usuário conecte suas contas do GitHub, Slack e outras plataformas para ver dados (como issues, mensagens) diretamente nos widgets do Axis.

## O Problema

O Axis hoje é um sistema fechado. O usuário não consegue puxar informações das ferramentas que ele já usa no dia a dia (GitHub, Slack, Google Calendar, etc.).

## Como Funciona por Baixo dos Panos

### 1. Autenticação via OAuth 2.0

Você **nunca** pede a senha do GitHub, Slack, etc. do usuário. Usa-se um protocolo chamado **OAuth 2.0**:

1. O usuário clica em **"Conectar com o GitHub"** no Axis.
2. O Axis redireciona para uma página **oficial do GitHub**.
3. O GitHub pergunta: _"O aplicativo Axis quer ler suas issues e repositórios. Você autoriza?"_
4. Se o usuário clicar em "Sim", o GitHub devolve o usuário pro Axis com um **Access Token** (Token de Acesso) secreto.
5. O Axis guarda esse token no banco de dados (Supabase), associado à conta do usuário.

### 2. Consumindo a API

Com o token salvo no backend, o servidor pode conversar com o GitHub em nome do usuário:

1. O widget de "Issues do GitHub" no Axis pede ao servidor: _"Pega as issues mais recentes desse usuário."_
2. O servidor usa o token e consulta a API do GitHub.
3. O GitHub reconhece o token, valida a permissão e devolve um JSON com títulos, links, autores e status das issues.

### 3. Mantendo Atualizado

Se alguém cria uma issue nova no GitHub, como o Axis fica sabendo?

| Método       | Descrição                                                                              |                Prós/Contras                 |
| ------------ | -------------------------------------------------------------------------------------- | :-----------------------------------------: |
| **Polling**  | O widget pergunta ao servidor a cada X minutos: "Tem issue nova?"                      |  Fácil de implementar, mas menos eficiente  |
| **Webhooks** | O GitHub manda uma notificação (POST) direto pro servidor do Axis sempre que algo muda | Tempo real, mas mais complexo de configurar |

## Complexidade: 🔴 Alta

### Desafios Técnicos

- **Gerenciamento de Tokens:** Tokens expiram. Precisa gerenciar renovação automática (Refresh Tokens) sem que o usuário precise logar de novo.
- **Backend Necessário:** O Token de Acesso **não pode** ficar exposto no frontend. Precisa estar escondido no backend (Supabase).
- **Aprovação das Plataformas:** Para liberar para o público, algumas plataformas (como Slack) exigem que você preencha formulários explicando o que seu app faz e por que precisa desses dados.

## Próximos Passos para Estudar

- "Como implementar OAuth com GitHub no Next.js"
- "Como implementar OAuth com Slack no Next.js"
- Documentação oficial da API do GitHub: https://docs.github.com/en/rest
