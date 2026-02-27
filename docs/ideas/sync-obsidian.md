# 🔄 Sincronização com Obsidian (Arquivos Locais)

> Permitir que o usuário veja e edite no Axis as notas que ele escreveu no Obsidian, e vice-versa, usando uma única fonte de verdade.

## O Problema

O BrainDump do Axis funciona como um Obsidian/Notion online. Mas o usuário pode querer escrever uma nota no Obsidian (offline, no PC) e depois continuar essa mesma nota no Axis (online, no navegador). Hoje isso não é possível porque são sistemas desconectados.

## As 3 Formas de Resolver

### Opção 1: Importação Clássica (Menos ideal)

Como o Notion faz: arrastar e fazer upload de arquivos `.md`.

- **Problema:** O Axis cria uma _cópia_ no Supabase. Se o usuário editar no Axis, o original no Obsidian **não muda**. Se ele editar no Obsidian, o Axis não sabe. A "magia" de ter uma base só é quebrada.

### Opção 2: File System Access API (Elegante, somente Desktop)

API nova dos navegadores modernos (Chrome, Edge, Opera):

1. O usuário clica: **"Abrir Pasta do Obsidian"**.
2. O navegador mostra um aviso de segurança: _"O site axis.com quer acessar a pasta MeusDocumentos/Obsidian_Vault. Você permite?"_
3. O usuário diz "Sim".
4. O Axis agora lê e **escreve diretamente nos arquivos `.md`** do computador do usuário.

**Resultado:** O usuário edita uma nota no Axis → o arquivo `.md` no PC é reescrito → o Obsidian atualiza automaticamente. A fonte de verdade é uma só!

- ✅ Zero custo de armazenamento.
- ❌ Só funciona se o usuário estiver no próprio computador. Não funciona no celular.

### Opção 3: Ponte Cloud (GitHub ou Google Drive)

Para funcionar em qualquer dispositivo (celular, tablet, PC da firma), o pessoal usa um **lugar neutro na nuvem**:

#### Via GitHub

- O usuário salva o vault do Obsidian no GitHub (usando o plugin **Obsidian Git**).
- O Axis, com autorização OAuth, lê e escreve arquivos direto no repositório.
- Ambos (Axis e Obsidian) convergem no mesmo repositório GitHub.

#### Via Google Drive / Dropbox

- O usuário guarda as notas no Google Drive (que sincroniza com o Obsidian no PC dele).
- O Axis, usando a API do Google Drive (com OAuth), lê os `.md` e, ao salvar, grava direto na nuvem.
- O app do Drive no PC do usuário puxa a nova versão da nota e o Obsidian atualiza.

## Por que Essa Ideia é Excelente (Produto/Negócio)

### 1. Reduz Custo de Banco de Dados

Você **não paga armazenamento** no Supabase para guardar gigabytes de textos e imagens. O arquivo está na nuvem/PC do usuário.

### 2. Alivia o Medo de "Vendor Lock-in"

Todo o mercado reclama: _"E se o Notion falir? Perco tudo?"_

O Axis pode dizer:

> _"Não! O Axis é só uma 'lente bonita' para os SEUS arquivos. Eles são seus. Se o Axis sumir, abra o Obsidian e está tudo na sua máquina."_

Isso é um **diferencial de vendas enorme**.

## Complexidade: 🟡🔴 Média-Alta

- File System Access API é relativamente direta no código, mas é limitada a desktop.
- A Ponte Cloud (GitHub/Drive) envolve OAuth + chamadas de API, que é mais complexo.

## Próximos Passos para Estudar

- "Como ler/escrever arquivos via File System Access API no React"
- "Obsidian Git Plugin" para entender o fluxo de sync via GitHub
- API do Google Drive: https://developers.google.com/drive/api
