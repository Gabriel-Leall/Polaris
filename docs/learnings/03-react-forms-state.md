# 03. Formulários em React: A Ilusão do Estado Imediato

No widget do **Zen Timer**, ao configurar os números (ex: 25 minutos), tivemos um bug interessante: o usuário não conseguia apagar o número digitado e escrever outro.

## 1. Como o React funciona

No React, campos de formulário (inputs) são _Controlados_ pelo estado (`useState`).

\`\`\`tsx
<input
value={timerConfig.work}
onChange={(e) => setTimerConfig({ work: e.target.value })}
/>
\`\`\`
Cada tecla que você aperta, o React pega, salva no estado interno e devolve para o `value`. Ele faz isso tão rápido que parece natural.

## 2. A Armadilha da Sanitização Imediata

O desenvolvedor anterior queria garantir que o tempo de trabalho nunca fosse menor que 1. Então ele fez:

\`\`\`tsx
// O Bug habitava aqui
onChange={(e) => setTimerConfig({
work: Math.max(1, Number(e.target.value))
})}
\`\`\`

**A Análise do Sênior:**
O que acontece quando o usuário tem "25", e aperta _Backspace_ para apagar o "5"? A string vira `"2"`. Tudo bem, porque 2 é maior que 1.
Mas o que acontece se o usuário selecionar o número todo e apertar _Backspace_? O campo fica vazio `""`.

1. O evento `onChange` dispara com o valor `""`.
2. O código roda `Number("")`, que no JavaScript (por regras idiotas da linguagem) vira `0`.
3. O código roda `Math.max(1, 0)`. O resultado é `1`.
4. O React altera o estado para `1` e atualiza a caixinha em menos de 10 milissegundos.

O usuário se sente ignorado. "Eu apaguei essa porcaria, por que apareceu o número 1 do nada?".

## 3. A Solução: Delayed Validation

Existem dois momentos na interface do usuário: **O que o usuário vê (Digitação)** e o **O que o sistema aceita (Submissão)**.

A interface deve ser burra e permissiva durante a digitação:
\`\`\`tsx
// 1. Durante a Digitação: Permita o erro (ou campo vazio)
onChange={(e) => {
const val = e.target.value;
setTimerConfig(c => ({
...c,
// Se estiver vazio salva vazio. Senão salva o número.
work: val === "" ? "" : Number(val)
}));
}}
\`\`\`

A interface deve ser rígida no momento do Apply (clique no botão) onde o dado vai pro estado global:
\`\`\`tsx
// 2. Durante a Ação (Apply / Submit)
onClick={() => {
// Agora sim garantimos uma "verdade" pro sistema
const workDuration = Math.max(1, Number(timerConfig.work) || 25);
dispatch({ type: "SET_CONFIG", payload: { work: workDuration } })
}}
\`\`\`

Sempre confie no usuário até ele apertar o botão de enviar. Restringir digitação frustra a experiência.
