<h1 align="center">VIPocket — Digital Loyalty Card</h1>

<p align="center">
  <em>Replacing paper loyalty cards with a smart, QR-code-driven mobile experience for small businesses</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-20+-DD0031?style=for-the-badge&logo=angular&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/QR%20Code-Integrated-27AE60?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Active-27AE60?style=for-the-badge"/>
</p>

---

## The Problem It Solves

Small businesses lose loyal customers because paper loyalty cards get lost, forgotten, or damaged. The check-in process is slow and error-prone, and there is no data to measure whether a loyalty programme actually works.

VIPocket replaces the paper card entirely with a digital-first experience: one QR Code per customer, automatic 7-day cycle tracking, and two flexible discount modes — no dedicated hardware required.

---

## How It Works

```
Customer registers → Receives personal QR Code → Visits the store → Store scans QR Code
        ↓                                                                   ↓
Discount applied automatically                            7-day cycle tracked & renewed
```

At the end of each cycle, the card resets automatically and the customer selects their preferred discount mode for the next round.

---

## Core Features

| Feature | Description |
|---------|-------------|
| **Digital Loyalty Card** | Virtual card with visual 7-day cycle progress tracking |
| **QR Code Check-in** | Unique QR code per user — fast and secure store validation |
| **Two Discount Modes** | Immediate daily discount or end-of-cycle accumulated reward |
| **Secure Authentication** | Email/password login with full account recovery flow |
| **Advantage Dashboard** | Real-time view of total spent, available discount, and usage history |
| **Step-by-step Registration** | Guided onboarding collecting only essential data |

---

## Discount Modes

### Mode 1 — Daily Discount
Each visit unlocks a percentage discount (e.g. 10%) valid the following day. Incentivises rapid return. Not cumulative.

### Mode 2 — Accumulated Reward
Discounts accumulate across the full 7-day cycle. The customer redeems the total at cycle end — ideal for higher-value reward goals.

At the start of each new cycle, the customer freely chooses which mode applies.

---

## Business Value

**For the customer:**
- All loyalty programmes in one place, on mobile
- No paper cards to carry, lose, or forget
- Full transparency on discounts earned and available
- Flexible reward strategy per cycle

**For the business:**
- Measurable customer return rate — see companion app [VIPpocket_adm](https://github.com/wesleyzilva/VIPpocket_adm)
- Zero printing or card management costs
- Strategic consumption data: frequency, average ticket, discount impact
- Modern brand experience aligned with digital-first consumers

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 20+ |
| Language | TypeScript 5+ |
| Styling | SCSS |
| QR Code | qrcode.js |
| Authentication | Email + password |
| Build | Angular CLI |
| Deploy | GitHub Pages / static host |

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm start
# → http://localhost:4200/VIPocket/

# Run unit tests
ng test

# Production build
ng build
```

---

## Related Project

[**VIPpocket_adm**](https://github.com/wesleyzilva/VIPpocket_adm) — the companion admin dashboard for the business owner. Answers critical questions: how often does each customer return? What is the ROI of the discount programme? What is the annual value of a retained customer?

---

## Author

**Wesley Gomes da Silva** · IT Manager · Agile Coach · Full-Stack Developer

[GitHub](https://github.com/wesleyzilva) · [LinkedIn](https://www.linkedin.com/in/wesleyzilva/) · [Portfolio](https://wesleyzilva.github.io/portfolioNearshoreWesIA/#hero) O objetivo é oferecer uma solução moderna e prática para que clientes possam gerenciar seus programas de fidelidade em um único lugar, substituindo os tradicionais cartões de papel.

Através de um sistema de cartão com ciclo de 7 dias e identificação por QR Code, os usuários podem se cadastrar, acumular benefícios e resgatar descontos de forma simples e intuitiva, incentivando o consumo recorrente nos estabelecimentos parceiros.


No VIPpocket_adm você encontrará respostas para uma analise de viabilidade financeira para aderir a esta aplicação.
Quantas vezes este cliente vem a sua loja?

Quanto o cliente gasta por ano?

Qual o valor que o cliente gasta a cada reingresso?

Qual o valor que o cliente teve de desconto?

Qual o valor que deixou de ganhar?

Qual a taxa de retorno do cliente?

E outras.


## Funcionalidades Principais

*   **Cadastro Simplificado:** Processo de registro rápido e em etapas, coletando apenas as informações essenciais para criar uma experiência personalizada.
*   **Autenticação Segura:** Login com e-mail e senha para acesso rápido e seguro à conta do usuário.
*   **Recuperação de Conta:** Mecanismo para redefinir a senha via e-mail, garantindo que o usuário nunca perca o acesso aos seus benefícios.
*   **Cartão de Fidelidade Digital:** Um cartão virtual que substitui o de papel, com marcação visual de um ciclo de 7 dias de consumo.
*   **Identificação por QR Code:** Geração de um QR Code único e pessoal para que o estabelecimento valide o cliente e registre o consumo de forma ágil.
*   **Acompanhamento de Vantagens:** Visualização clara do valor total gasto, do desconto disponível e do histórico de uso do cartão.

## Regras de Negócio

O programa de fidelidade foi desenhado para ser flexível e vantajoso, adaptando-se às preferências do cliente.

*   **Ciclo de Fidelidade:** O programa é baseado em um ciclo de 7 dias de consumo. Ao final de cada ciclo, um novo cartão é gerado automaticamente.
*   **Modalidades de Desconto:** Ao iniciar um novo ciclo, o cliente pode escolher entre duas opções de benefício:
    1.  **Desconto Imediato (Diário):** A cada compra, o cliente ganha um percentual de desconto (ex: 10%) para ser utilizado no dia seguinte. Este benefício incentiva o retorno rápido, mas não é cumulativo.
    2.  **Desconto Acumulativo:** O cliente acumula os descontos gerados ao longo dos 7 dias e pode resgatar o valor total ao final do ciclo, ideal para quem busca uma recompensa maior.

## Benefícios

### Para o Cliente

*   **Conveniência:** Todos os cartões de fidelidade em um só lugar, diretamente no celular. Adeus, cartões de papel perdidos ou esquecidos.
*   **Transparência:** Acompanhamento em tempo real dos gastos, pontos e descontos disponíveis.
*   **Flexibilidade:** Escolha da modalidade de desconto que melhor se adapta ao seu perfil de consumo.
*   **Agilidade:** Check-in rápido e seguro nos estabelecimentos usando apenas o QR Code.

### Para o Parceiro (Estabelecimento)

*   **Fidelização de Clientes:** Incentiva o retorno do cliente através de um programa de recompensas claro e atrativo.
*   **Redução de Custos:** Elimina a necessidade de impressão e gerenciamento de cartões de fidelidade físicos.
*   **Coleta de Dados Estratégicos:** O sistema permite a análise de dados de consumo (de forma anônima e agregada), como frequência de visitas e valor médio de compra, fornecendo insights valiosos para o negócio.
*   **Modernização da Experiência:** Oferece uma solução tecnológica e alinhada às expectativas dos consumidores modernos, melhorando a imagem da marca.

## Como Executar o Projeto

Este projeto foi gerado com o Angular CLI.

### Pré-requisitos

*   Node.js (versão LTS recomendada)
*   Angular CLI

### Servidor de Desenvolvimento

Execute o comando abaixo para iniciar o servidor de desenvolvimento:

```bash
npm start
```

Acesse a aplicação em `http://localhost:4200/VIPocket/`. A aplicação recarregará automaticamente se você alterar qualquer um dos arquivos de origem.

### Build

Para compilar o projeto para produção, execute:

```bash
ng build
```

Os artefatos da compilação serão armazenados no diretório `dist/`.

### Testes Unitários

Para executar os testes unitários via Karma, use o comando:

```bash
ng test
```
