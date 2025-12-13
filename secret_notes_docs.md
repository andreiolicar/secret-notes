# SecretNotes – Documentação Oficial

## 1. Visão Geral do Projeto

### 1.1 Nome do software
**SecretNotes – Sistema de Anotações Secretas para Windows**

### 1.2 Descrição resumida
O **SecretNotes** é um software para Windows que permite ao usuário criar, armazenar e proteger anotações de forma totalmente local, segura e discreta. Inspirado na experiência visual da Apple (tema dark + glassmorphism) e na fluidez do Notion (comandos via `/`), o software combina acessibilidade, privacidade e praticidade.

### 1.3 Propósito e motivação
O objetivo do SecretNotes é oferecer um ambiente privado para criação de anotações sensíveis, com foco em segurança, simplicidade e rapidez de acesso. Seu grande diferencial está no **acesso secreto via atalho global**, na **senha mestra** para acesso ao aplicativo e na possibilidade de **senha individual por nota**.

### 1.4 Público-alvo
Usuários que desejem proteger anotações pessoais, profissionais ou confidenciais sem depender de serviços online. Ideal para pessoas que prezam por privacidade, estudantes, profissionais liberais e qualquer pessoa que queira um bloco de notas totalmente seguro.

---

## 2. Objetivos do Software

### 2.1 Objetivo Geral
Desenvolver um software de anotações seguras, moderno e totalmente local, com experiência elegante inspirada no ecossistema Apple e fluxo fluido de edição estilo Notion.

### 2.2 Objetivos Específicos
- Permitir abertura do aplicativo via atalho global (**Ctrl + Alt + Shift + N**).
- Proteger o sistema com **senha mestra obrigatória**.
- Criar notas com **senha individual opcional**.
- Fornecer editor de texto com comandos via `/`.
- Implementar interface escura com estética **glass/líquida**.
- Armazenar todas as notas encriptadas localmente.
- Garantir que nada seja enviado para a nuvem.

---

## 3. Stack de Desenvolvimento
- **Electron** — Engine desktop para Windows.
- **React (Vite)** — Interface do usuário.
- **Tailwind CSS** — Estilização.
- **Node.js** (no processo main) — Lógica de backend local, criptografia e armazenamento.
- **Crypto (Node)** — AES-GCM para criptografia de notas.
- **argon2** — Derivação de chave e hashing seguro.
- **TipTap** — Editor com blocos e menu `/`.
- **electron-builder** — Empacotamento.

---

## 4. Arquitetura Geral

### 4.1 Estrutura em camadas
**Frontend (Renderer – React):**
- UI/UX do app.
- Modal de autenticação.
- Editor.
- Comunicação com main via IPC.

**Backend local (Electron Main):**
- Registro do atalho global.
- Criptografia/descriptografia.
- Gerenciamento de arquivos.
- IPC seguro.

**Armazenamento:**
- Diretório `%APPDATA%/SecretNotes/`.
- Arquivos encriptados `.enc`.
- Metadata: `vault.meta.json`.

---

## 5. Funcionamento do Sistema

### 5.1 Fluxo de acesso
1. Usuário pressiona **Ctrl + Alt + Shift + N**.
2. Electron ativa o modal de senha.
3. Usuário insere a **senha mestra**.
4. O sistema deriva a chave e tenta descriptografar o vault.
5. Se bem-sucedido, abre a UI principal.

### 5.2 Fluxo das notas
1. Usuário cria nova nota.
2. Escolhe definir ou não senha própria.
3. Conteúdo é criptografado com chave derivada.
4. Nota é salva como `notes/note-<id>.enc`.
5. Para abrir: pedir senha se protegida.

### 5.3 Fluxo dos comandos `/`
- Usuário digita `/` no editor.
- Menu contextual aparece com opções como:
  - Título
  - Subtítulo
  - Lista
  - Lista de tarefas
  - Código
  - Separador
  - Inserir senha da nota

---

## 6. Funcionalidades do MVP

### 6.1 Funcionalidades Principais
- Atalho global para abrir o app.
- Sistema de senha mestra.
- Criação e edição de notas.
- Proteção individual via senha.
- Editor estilo Notion.
- Armazenamento local encriptado.
- Tema dark + interface glass.

### 6.2 Funcionalidades Adicionais (Pós-MVP)
- Sistema de diário, com anotações para descrever o dia
- Separação entre notas soltas e o diário
- Templates de notas

---

## 7. Requisitos Funcionais (RF)

### RF01 — Acesso via atalho
O sistema deve ser aberto ao pressionar **Ctrl + Alt + Shift + N**.

### RF02 — Autenticação mestra
O usuário deve inserir uma **senha mestra** para acessar o aplicativo.

### RF03 — Criação de notas
O sistema deve permitir criar, editar e excluir notas.

### RF04 — Proteção por senha de nota
Ao criar ou editar uma nota, o usuário deve poder definir uma senha específica.

### RF05 — Armazenamento local
Todas as notas devem ser armazenadas localmente.

### RF06 — Criptografia
Todo conteúdo deve ser criptografado com AES-GCM.

### RF07 — Editor com comandos `/`
O editor deve suportar comandos via `/`.

### RF08 — UI escura e efeito glassmorphism
A interface deve seguir o padrão visual definido.

### RF09 — Listagem de notas
O usuário deve conseguir visualizar todas as notas criadas.

### RF10 — Busca simples
O sistema deve permitir busca por título.

---

## 8. Requisitos Não Funcionais (RNF)

### RNF01 — Segurança
- Uso de Argon2 para derivação de chaves.
- AES-256-GCM para criptografia.
- Nenhuma senha deve ser armazenada em texto plano.

### RNF02 — Desempenho
- O app deve abrir em menos de 3 segundos após senha correta.
- Criptografia não deve travar a UI.

### RNF03 — Confiabilidade
- Dados nunca devem ser corrompidos durante gravação.

### RNF04 — Usabilidade
- Interface limpa, intuitiva, com poucas distrações.
- Modal inicial minimalista.

### RNF05 — Portabilidade
- Necessário rodar apenas em Windows.

### RNF06 — Armazenamento local
- Todos os arquivos devem permanecer no diretório `%APPDATA%/SecretNotes/`.

### RNF07 — Arquitetura segura
- Comunicação via IPC isolado.
- Renderer não deve acessar Node diretamente.

---

## 9. Design de Interface e UX

### 9.1 Estética Geral
- Tema escuro.
- Estilo **liquid glass** com transparência, blur e bordas suaves.
- Tipografia: estilo Apple (Inter ou SF Pro-like).
- Botões minimalistas.

### 9.2 Componentes principais
- **Modal de senha:** centralizado, blur forte, animação suave.
- **Sidebar:** lista de notas + botão "Nova Nota".
- **Editor:** tela limpa, blocos responsivos.
- **Menu `/`:** inspirado no Notion.

### 9.3 Animações
- Fade in ao abrir o app.
- Smooth transitions.
- Feedback visual ao errar senha.

---

## 10. Estrutura de Pastas (Proposta)
```
secret-notes/
├─ src/
│  ├─ main/          # Electron main (atalho, criptografia, IPC)
│  ├─ preload/       # IPC seguro
│  ├─ renderer/      # React + Tailwind
│  │   ├─ components/
│  │   ├─ pages/
│  │   ├─ hooks/
│  │   └─ styles/
├─ public/
├─ package.json
└─ vite.config.js
```

---

## 11. Planejamento e Roadmap

### Fase 1 — Configuração do Projeto
- Configurar Electron + Vite + React.
- Criar IPC seguro.
- Criar janela com suporte a transparência.

### Fase 2 — Segurança
- Implementar sistema de senha mestra.
- Implementar derivação Argon2.
- Criar mecanismo de criptografia AES-GCM.

### Fase 3 — UI/UX
- Criar modal de autenticação.
- Criar sidebar + lista de notas.
- Criar editor base.
- Implementar comandos `/`.

### Fase 4 — CRUD e Armazenamento
- Criar notas.
- Editar notas.
- Salvar encriptado.
- Abrir notas protegidas.

### Fase 5 — Estabilidade
- Testes.
- Melhorias.
- Correções.

### Fase 6 — Build
- Empacotar com electron-builder.
- Gerar instalador para Windows.

---

## 12. Considerações Finais
O **SecretNotes** entrega privacidade, segurança e praticidade juntas em um software para Windows com design premium e moderno. A solução se baseia em princípios sólidos de criptografia, desenvolvimento local-first e uma UX elegante. Essa documentação resume toda a concepção, funcionamento e padrões do projeto, servindo como base para desenvolvimento, expansão e manutenção futura.