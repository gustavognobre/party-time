# API PartyTime 🎉

**Desenvolvida por Gustavo Gomes Nobre**, inspirada no projeto de Matheus Batisti (@matheusbattisti), esta API foi criada para gerenciar festas de maneira prática e eficiente, oferecendo funcionalidades como a criação, atualização, listagem e exclusão de festas, com foco na integração de serviços e controle de orçamento.

---

## 💡 O que é o PartyTime?

O PartyTime é uma API pensada para facilitar a gestão de festas, permitindo ao usuário criar eventos com serviços associados, como catering, decoração, entre outros. Com a funcionalidade de orçamento, garantimos que os custos das festas estejam sempre dentro do limite, evitando surpresas no final.

---

## ⚙️ Funcionalidades

### 1. **Criação de festas (POST /parties)**
- Crie novas festas com título, descrição, orçamento, imagem e serviços.
- Valida se o nome da festa já existe para evitar duplicidade.
- Verifica se os serviços associados existem e se o orçamento é suficiente para cobri-los.

### 2. **Atualização de festas (PATCH /parties/:id)**
- Atualize os detalhes de uma festa existente.
- Revalida serviços e orçamento após alteração.

### 3. **Listagem de festas (GET /parties)**
- Recupere todas as festas cadastradas.

### 4. **Detalhamento de uma festa (GET /parties/:id)**
- Visualize os detalhes de uma festa específica.

### 5. **Exclusão de festas (DELETE /parties/:id)**
- Apague uma festa existente do banco de dados.

---

## 🚀 Como usar

1. Clone este repositório:
   ```bash
   git clone https://github.com/gnobre/partytime-api.git
   cd partytime-api
   ```

2. Instale as dependências:
   ```bash
   npm i
   ```

3. Configure as variáveis de ambiente (`.env`):
   ```env
   MONGO_URI=mongodb://localhost:27017/partytime
   PORT=3000
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

---

## 💻 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no backend.
- **Express.js**: Framework para construção de APIs RESTful.
- **MongoDB & Mongoose**: Banco de dados NoSQL para armazenar informações das festas e serviços.
- **JavaScript Assíncrono (Async/Await)**: Para chamadas não bloqueantes ao banco de dados.

---

## 🛠️ Como foi feito?

O desenvolvimento da API foi inspirado no projeto de Matheus Batisti, onde foram abordados conceitos de criação de sistemas para eventos, com integração de serviços e controle de orçamento.

As funções de verificação de existência de serviços e validade de orçamento foram implementadas de maneira modular para garantir a flexibilidade do sistema, permitindo que novas validações possam ser adicionadas facilmente.

---

## 🎯 Contribuições

Contribua para este projeto criando issues ou realizando pull requests. Toda contribuição é bem-vinda!

---

## 💬 Feedback

Se você tem sugestões ou encontrou algum bug, não hesite em abrir uma issue. Fique à vontade para compartilhar suas ideias! 🚀

---


Inspirado por Matheus Batisti 
