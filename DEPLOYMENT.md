# 📱 Como usar o Gym Assist no Celular

Você tem duas opções principais para usar o app no seu smartphone. Escolha a que achar mais fácil!

---

## Opção 1: Publicar na Internet (Recomendado/Mais Fácil) 🌍
Essa opção gera um link (ex: `meus-treinos.netlify.app`) que você pode acessar de qualquer lugar.

1. Acesse o site [Netlify Drop](https://app.netlify.com/drop).
2. Abra a pasta onde estão os arquivos do seu projeto no computador (`C:\Users\Wallison\Desktop\Sistemas\Antigravity\V1`).
3. **Arraste a pasta inteira** para a área indicada no site do Netlify.
4. O site vai carregar e te dar um **Link Verde**.
5. Mande esse link para o seu celular (WhatsApp, e-mail, etc).
6. Abra no celular e pronto!

**✨ Dica Pro (Instalar App):**
No Android (Chrome) ou iPhone (Safari), abra o menu e clique em **"Adicionar à Tela Inicial"**. O app vai virar um ícone no seu celular como se fosse nativo!

---

## Opção 2: Rede Local (Sem Internet) 🏠
Use o Wi-Fi da sua casa. O computador e o celular precisam estar no **mesmo Wi-Fi**.

### Passo 1: Descobrir o IP do seu computador
1. Abra o prompt de comando (cmd) no Windows.
2. Digite `ipconfig` e aperte Enter.
3. Procure por **Endereço IPv4**. Geralmente é algo como `192.168.0.X` ou `192.168.1.X`. Anote esse número.

### Passo 2: Iniciar um Servidor
Você precisa "servir" os arquivos.
* **Se tiver Python instalado:**
  1. Abra o cmd dentro da pasta do projeto.
  2. Digite `python -m http.server`.
* **Se usar o VS Code:**
  1. Instale a extensão "Live Server".
  2. Clique em "Go Live" no canto inferior direito.

### Passo 3: Acessar no Celular
1. Abra o navegador do celular.
2. Digite o IP que você anotou, seguido da porta (geralmente `:5500` para Live Server ou `:8000` para Python).
   * Exemplo: `http://192.168.0.15:5500`
3. Pronto!

---

## ⚠️ Importante
Como este sistema usa `localStorage` (memória do navegador), **os dados do computador NÃO aparecem no celular automaticamente**. Eles são salvos separadamente em cada dispositivo.

Se quiser sincronizar, precisaríamos criar uma conta/login no futuro (banco de dados real). Por enquanto, o celular terá seu próprio histórico separado do PC.

---

## 🤖 Opção 3: Transformar em APK (Android)

Se você quer um arquivo `.apk` para instalar:

1. Acesse o site **[WebIntoApp](https://www.webintoapp.com)** (ou pesquise "HTML to APK").
2. Clique em **"App contents"** e escolha a pasta do projeto.
3. Preencha o nome (Gym Assist) e clique em **Build**.
4. Baixe o APK e instale.

---

## 🐱 Opção 4: GitHub Pages (Para Desenvolvedores)

Se você tem conta no GitHub:

1.  Crie um **Novo Repositório** no GitHub.
2.  Envie os arquivos (Upload files ou `git push`).
3.  Vá em **Settings > Pages**.
4.  Em **Build and deployment**, selecione a branch `main`.
5.  O GitHub vai gerar um link (ex: `seu-usuario.github.io`).

Esse link funciona em qualquer lugar e pode ser instalado como App!
