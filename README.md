# PriceRadar Kenya 🇰🇪

> **"Find the product. Compare the market. Buy from the seller you trust."**

PriceRadar Kenya is a production-grade Kenya-first product discovery, price comparison, market intelligence, AI shopping assistant, and merchant platform.

---

## 🌟 Key Features

### Consumer Platform
1. **Multi-Seller Price Comparison**: Compare live product prices, delivery fees, total costs, stock availability, and warranties across top Kenyan merchants (Jumia, PhonePlace, Avechi, Hotpoint, Salim Hub, Kilimall, Anker).
2. **Instant Search & Autocomplete**: Fast, keyboard-navigable autocomplete with dynamic category-specific attribute filtering (Price Range KSh, RAM, Storage, Brand, 5G, Condition).
3. **5-Level Product Matching Engine**: Resolves raw merchant listings to canonical product variants via exact GTIN/MPN identifiers, deterministic attribute matching, string trigram similarity, and an Admin Review Queue.
4. **Transparent Seller Trust Engine**: Computes 0–100 trust scores based on verified business registration, physical store address in Kenya, return policy, warranty terms, and customer ratings.
5. **Interactive 90-Day Price History**: Visual price trend charts displaying 30-day and 90-day price changes, min/max prices, and market evaluation (e.g. *"Excellent Price Today"*).
6. **Price Alerts**: Set target price drop alerts in KSh with anti-spam lifecycle tracking (`ACTIVE`, `TRIGGERED`, `PAUSED`).
7. **Side-by-Side Product Comparison**: Mobile-first matrix comparing up to 4 products on specs, RAM, Battery, Camera, Processor, and price.
8. **DB-Grounded AI Shopping Assistant**: Natural language prompt processing ("Best phone under KSh 30,000" or "Programming laptop under KSh 100,000") using live platform database records without hallucination.

### Merchant Platform
1. **Merchant Portal**: Dashboard for managing listed offers and business profile verification.
2. **CSV / Feed Ingestion Pipeline**: Upload raw product feeds with validation preview distinguishing valid vs invalid rows before publication.
3. **Market Pricing Intelligence**: Compares merchant prices against market average prices, lowest competitor prices, rank positioning, and price gap %.

### Admin & Operations
1. **Product Matching Moderation**: Admin interface to approve product merges or split distinct variants.
2. **Audit Logging**: Structured audit records for administrative actions.

---

## 🚀 Tech Stack

- **Frontend & App Shell**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & APIs**: Next.js API Route Handlers with modular service wrappers.
- **Database & ORM**: PostgreSQL with Prisma ORM.
- **Cache & Queue**: Redis + BullMQ.
- **Containerization**: Docker Compose (`docker-compose.yml`).

---

## 🛠️ Quick Start & Setup

### Prerequisites
- Node.js 18+ & npm
- PostgreSQL database (or Docker Compose)

### 1. Environment Setup
```bash
cp .env.example .env
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Generation & Seeding
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to PostgreSQL
npm run db:push

# Seed database with Kenya electronics canonical dataset
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📄 Documentation

- [ARCHITECTURE.md](file:///c:/Users/RK/Documents/GitHub/productdiscovery/ARCHITECTURE.md) — Technical architecture design document.
- [IMPLEMENTATION_STATUS.md](file:///c:/Users/RK/Documents/GitHub/productdiscovery/IMPLEMENTATION_STATUS.md) — Progress matrix.
- [Implementation Plan](file:///C:/Users/RK/.gemini/antigravity-ide/brain/ec16c770-15cb-4d06-936e-06a9f9915362/implementation_plan.md) — Master build plan.
- [Walkthrough](file:///C:/Users/RK/.gemini/antigravity-ide/brain/ec16c770-15cb-4d06-936e-06a9f9915362/walkthrough.md) — Detailed implementation walkthrough.
