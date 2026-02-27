# 💬 Chat Assistente Inteligente (Agente com Tool Calling)

> Uma caixinha de texto/voz onde o usuário comanda o Axis por linguagem natural: "Crie uma tarefa para amanhã", "Quais são minhas tarefas de hoje?".

## O Problema

O usuário quer interagir com o Axis de forma rápida e natural, sem precisar clicar por vários menus. Quer simplesmente dizer/escrever o que precisa e a plataforma executa.

## Como Funciona por Baixo dos Panos

Isso se chama **Agente com Chamada de Ferramentas (Tool Calling / Function Calling)**. Não é só um chat que "conversa", é um chat que **"age"**.

### O Fluxo Completo

```
Usuário digita: "Quais são minhas tarefas de hoje?"
        │
        ▼
[Frontend] → Envia o texto para o Backend
        │
        ▼
[Backend] → Envia para a IA (OpenAI/Gemini) junto com:
           • Um prompt do sistema ("Você é o assistente do Axis")
           • Uma lista de ferramentas disponíveis:
             - buscar_tarefas(data)
             - criar_tarefa(titulo, prioridade)
             - resumir_notas()
        │
        ▼
[IA] → Decide: "Vou usar a ferramenta buscar_tarefas('2026-02-23')"
           → Retorna JSON: { "funcao": "buscar_tarefas", "args": { "data": "2026-02-23" } }
        │
        ▼
[Backend] → Executa a função real no Supabase
           → Pega as tarefas do banco de dados
           → Devolve o resultado para a IA
        │
        ▼
[IA] → Lê as tarefas e formula uma resposta amigável:
           "Gabriel, você tem 3 tarefas hoje. A mais urgente é
            terminar a Home Page!"
        │
        ▼
[Frontend] → Mostra a resposta no chat
```

### Sobre a Voz

Para o usuário falar em vez de digitar, use a **Web Speech API** que já vem nos navegadores modernos. Ela transforma voz em texto gratuitamente, e aí você manda esse texto para o mesmo fluxo acima.

## Tecnologias Recomendadas

| Tecnologia                         | Para que serve                                                      |
| ---------------------------------- | ------------------------------------------------------------------- |
| **Vercel AI SDK**                  | Biblioteca da Vercel para Next.js com suporte nativo a Tool Calling |
| **OpenAI Function Calling**        | Método da API da OpenAI para definir ferramentas que a IA pode usar |
| **Google Gemini Function Calling** | Alternativa do Google com a mesma funcionalidade                    |
| **Web Speech API**                 | API nativa do navegador para reconhecimento de voz (grátis)         |

## Complexidade: 🔴 Alta

- Exige um backend robusto que saiba executar "ferramentas" (funções) com base no que a IA pede.
- Exige validação de segurança (o usuário não pode comandar algo que não tem permissão).
- A Vercel AI SDK facilita muito para apps Next.js.
