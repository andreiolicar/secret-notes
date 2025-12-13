# 🔐 SecretNotes

## 📖 Sobre

O **SecretNotes** é um aplicativo desktop para Windows que permite criar, armazenar e proteger anotações de forma totalmente local e segura. Inspirado na experiência visual da Apple e na fluidez do Notion, combina uma interface elegante com criptografia de nível militar.

### ✨ Diferenciais

- 🔒 **100% Local** — Nenhum dado é enviado para nuvem
- 🔐 **Criptografia Forte** — AES-256-GCM + Argon2
- ⚡ **Acesso Rápido** — Atalho global `Ctrl + Alt + Shift + N`
- 🎨 **Design Premium** — Interface dark com glassmorphism
- ✍️ **Editor Rico** — Comandos estilo Notion via `/`
- 🔑 **Proteção em Camadas** — Senha mestra + senha por nota

---

## 🚀 Recursos

### Segurança

- ✅ **Senha Mestra Obrigatória** — Protege todo o vault
- ✅ **Senha Individual por Nota** — Camada extra de segurança
- ✅ **Criptografia AES-256-GCM** — Padrão militar
- ✅ **Derivação Argon2** — Proteção contra ataques de força bruta
- ✅ **Armazenamento Local Criptografado** — Dados seguros em disco

### Interface

- 🎨 **Tema Dark Premium** — Estética inspirada na Apple
- 💎 **Glassmorphism** — Efeitos de vidro e transparência
- 📱 **Responsivo** — Adapta-se a diferentes tamanhos de janela
- ⌨️ **Atalhos de Teclado** — Produtividade máxima
- 🔍 **Busca em Tempo Real** — Encontre suas notas rapidamente

### Editor

- ✍️ **Comandos com `/`** — Formatação intuitiva
- 📝 **Formatação Rica** — Títulos, listas, código, citações
- ✅ **Lista de Tarefas** — Checkboxes interativos
- 🔗 **Links e Código** — Suporte completo
- 💾 **Auto-salvamento** — Suas alterações são salvas automaticamente

### Produtividade

- ⚡ **Atalho Global** — Abra instantaneamente com `Ctrl + Alt + Shift + N`
- 📌 **System Tray** — Execução em segundo plano
- 🔎 **Busca Avançada** — Pesquisa por título e conteúdo
- 📊 **Organização** — Notas ordenadas por data de modificação

---

## 📦 Instalação

### Pré-requisitos

- **Windows 10/11**
- **Node.js 18+** — [Download aqui](https://nodejs.org/)

### Instalação para Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/andreiolicar/secret-notes.git
cd secret-notes

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

### Build para Produção

```bash
# Gere o executável do Windows
npm run build
npm run package

# O instalador estará em dist/
```

---

## 🎯 Uso

### Primeiro Acesso

1. **Pressione** `Ctrl + Alt + Shift + N` ou abra o aplicativo
2. **Crie** sua senha mestra (mínimo 8 caracteres)
3. **Comece** a escrever suas notas secretas!

### Criando Notas

1. Clique em **"Nova Nota"** ou pressione `Ctrl + N`
2. Escolha se deseja proteger com senha adicional
3. Digite o título e comece a escrever

### Comandos do Editor

Digite `/` no editor para acessar comandos rápidos:

| Comando     | Descrição         |
| ----------- | ----------------- |
| `/titulo1`  | Título grande     |
| `/titulo2`  | Título médio      |
| `/titulo3`  | Título pequeno    |
| `/lista`    | Lista com bullets |
| `/numerada` | Lista numerada    |
| `/tarefas`  | Lista de tarefas  |
| `/codigo`   | Bloco de código   |
| `/citacao`  | Citação           |
| `/divisor`  | Linha horizontal  |
| `/senha`    | Campo de senha    |

### Atalhos de Teclado

| Atalho                   | Ação                   |
| ------------------------ | ---------------------- |
| `Ctrl + Alt + Shift + N` | Abrir/Focar aplicativo |
| `Ctrl + N`               | Nova nota              |
| `Ctrl + F`               | Buscar notas           |
| `Ctrl + B`               | Negrito                |
| `Ctrl + I`               | Itálico                |
| `Ctrl + K`               | Inserir link           |
| `Esc`                    | Fechar modal/menu      |

---

## 🔐 Segurança

### Arquitetura de Segurança

O SecretNotes implementa múltiplas camadas de proteção:

```
┌─────────────────────────────────────┐
│   Senha Mestra (Argon2id)          │
│   ↓                                 │
│   Vault Criptografado               │
│   ↓                                 │
│   Notas (AES-256-GCM)              │
│   ↓                                 │
│   [Opcional] Senha Individual       │
│   ↓                                 │
│   Nota Duplamente Criptografada    │
└─────────────────────────────────────┘
```

### Especificações Técnicas

- **Algoritmo**: AES-256-GCM (Galois/Counter Mode)
- **Derivação de Chave**: Argon2id
  - Memory Cost: 64 MB
  - Time Cost: 3 iterações
  - Parallelism: 4 threads
- **IV**: 128 bits aleatórios por operação
- **Salt**: 256 bits aleatórios por senha
- **Tag de Autenticação**: 128 bits

### Armazenamento

```
%APPDATA%/SecretNotes/
├── vault.meta.json      # Metadata do vault (hash da senha)
└── notes/
    ├── note-<id>.enc    # Conteúdo criptografado
    └── note-<id>.meta.json  # Metadata da nota
```

### Boas Práticas

- ✅ Use uma senha mestra forte e única
- ✅ Não compartilhe sua senha mestra
- ✅ Faça backup do diretório `%APPDATA%/SecretNotes/`
- ⚠️ **Não há recuperação de senha** — se esquecer, não poderá acessar suas notas

---

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
secret-notes/
├── src/
│   ├── main/                 # Electron Main Process
│   │   ├── crypto/          # Sistema de criptografia
│   │   ├── storage/         # Gerenciamento de arquivos
│   │   ├── main.js          # Ponto de entrada
│   │   └── ipcHandlers.js   # Handlers IPC
│   ├── preload/             # Preload script (IPC seguro)
│   └── renderer/            # React App
│       ├── components/      # Componentes React
│       ├── pages/          # Páginas principais
│       ├── styles/         # CSS e tema
│       ├── hooks/          # Custom hooks
│       └── extensions/     # Extensões do editor
├── public/                  # Assets estáticos
├── package.json
└── vite.config.js
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia app em modo dev
npm run dev:renderer     # Apenas frontend (Vite)

# Build
npm run build           # Build do renderer
npm run build:electron  # Build completo (renderer + electron)

# Produção
npm run package         # Gera executável do Windows
npm start              # Executa build de produção

# Linting
npm run lint           # Verifica código
```

### Tecnologias Utilizadas

#### Frontend
- **React 18** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Utility-first CSS
- **TipTap** — Editor de texto rico
- **Lucide React** — Ícones

#### Backend
- **Electron** — Desktop framework
- **Node.js crypto** — Criptografia nativa
- **Argon2** — Key derivation
- **fs-extra** — Sistema de arquivos

#### Build & Dev Tools
- **electron-builder** — Empacotamento
- **concurrently** — Scripts paralelos

---

## 🎨 Tema e Estilização

O SecretNotes utiliza um sistema de design consistente:

### Paleta de Cores

```css
/* Backgrounds */
--background-primary: #0a0a0a
--background-secondary: #121212
--background-tertiary: #1a1a1a

/* Glass Effects */
--glass-bg: rgba(255, 255, 255, 0.03)
--glass-border: rgba(255, 255, 255, 0.08)

/* Text */
--text-primary: #ffffff
--text-secondary: rgba(255, 255, 255, 0.7)
--text-tertiary: rgba(255, 255, 255, 0.5)
```
---

## 🗺️ Roadmap

### Versão 1.0 (MVP)
- [x] Sistema de autenticação
- [x] CRUD de notas
- [x] Editor rico com comandos
- [x] Criptografia completa
- [x] Interface glassmorphism
- [x] Atalho global
- [x] System tray

### Versão 2.0 (Futuro)
- [ ] Sistema de diário com entradas diárias
- [ ] Separação entre notas soltas e diário
- [ ] Categorias e tags
- [ ] Exportação de notas (PDF, Markdown)
- [ ] Aplicativo para macOS e Linux
- [ ] Banco de dados em cloud, com sincronização por sessão