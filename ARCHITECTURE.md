# PriceRadar Kenya — Technical Architecture Specification

## 1. System Overview

PriceRadar Kenya is a production-grade Kenya-first product discovery, price comparison, product intelligence, AI shopping assistant, and merchant infrastructure platform.

The system is architected as a **modular monolith** built with Next.js 14+ (App Router, TypeScript), PostgreSQL, Prisma ORM, and Redis, designed for high performance, accessibility, SEO superiority, and seamless scaling across East Africa.

```text
                                +---------------------------+
                                |      Web Client & PWA     |
                                |  (Next.js App Router UI)  |
                                +-------------+-------------+
                                              |
                                              v
                                +-------------+-------------+
                                |      Next.js Server       |
                                | (API Routes & Middleware) |
                                +------+------+------+------+
                                       |      |      |
           +---------------------------+      |      +---------------------------+
           |                                  v                                  |
+----------v----------+            +----------+----------+            +----------v----------+
|  Canonical Catalog  |            |     Search &         |            |  Product Matching   |
|   & Offer Engine    |            |   Filtering Engine   |            |  Data Ingestion     |
+----------+----------+            +----------+----------+            +----------+----------+
           |                                  |                                  |
           +---------------------------+      |      +---------------------------+
                                       v      v      v
                                +-------------+-------------+
                                |      PostgreSQL DB        |
                                | (Prisma Schema Models)    |
                                +---------------------------+
```

---

## 2. Core Architectural Principles

1. **Strict Separation of Product vs Variant vs Offer**:
   - **Product**: Canonical product concept (e.g. *Samsung Galaxy S25 Ultra*).
   - **Variant**: Specific SKU configuration (e.g. *256GB / 12GB RAM / Titanium Black*).
   - **Offer**: A merchant's active listing for a variant (e.g. *Merchant A -> KSh 124,999, In Stock*).
   - **Price**: Immutable point-in-time pricing record associated with an offer.

2. **Category-Specific Dynamic Attribute Engine**:
   - Specifications are not hardcoded into flat database columns.
   - Dynamic typed attributes per category (e.g., `RAM`, `Storage`, `CPU`, `Display Size`, `Battery`, `5G`, `Camera`).

3. **5-Level Product Matching Pipeline**:
   - Level 1: Exact Identifier (GTIN / EAN / UPC / MPN).
   - Level 2: Deterministic Attribute Comparison.
   - Level 3: Normalized String Trigram Similarity.
   - Level 4: Semantic Extraction.
   - Level 5: AI & Admin Review Queue (<0.75 confidence threshold).

4. **Transparent Seller Trust Engine**:
   - Trust scores (0–100) computed deterministically based on business verification, physical location in Kenya, warranty policies, return policies, data freshness, and user reviews.

5. **AI Shopping Assistant Grounding**:
   - Contextual RAG / direct database query engine ensuring the AI shopping assistant answers budget and comparison queries strictly using active platform product records without hallucinating prices or products.

---

## 3. Database Schema Overview (PostgreSQL + Prisma)

Key Entities:
- `User`, `Role`, `Session`, `Permission`
- `Merchant`, `MerchantVerification`
- `Category`, `Attribute`, `CategoryAttribute`, `Brand`
- `Product`, `Variant`, `ProductIdentifier`, `ProductAttributeValue`
- `Offer`, `PriceHistory`, `PriceAlert`, `OutboundClick`
- `ImportJob`, `ProductMatchQueue`, `Review`, `AdCampaign`, `AuditLog`

---

## 4. Module Structure

```text
src/
├── app/                  # Next.js App Router (Pages, API Routes)
│   ├── (consumer)/       # Consumer discovery, search, compare, product details
│   ├── merchant/         # Merchant dashboard, onboarding, imports, intelligence
│   ├── admin/            # Platform administration, match review, verification
│   └── api/              # Public & Internal API endpoints
├── components/           # UI Design System & Component Library
│   ├── ui/               # Base primitives (Button, Input, Badge, Card, Modal, etc.)
│   ├── consumer/         # Product cards, compare matrix, price chart, AI chat drawer
│   ├── merchant/         # Import table, offer editor, market position charts
│   └── admin/            # Matching review tools, audit logs
└── lib/                  # Shared core services & domain logic
    ├── db/               # Prisma client & database utilities
    ├── services/         # Domain services (Product, Offer, Matching, Search, AI, etc.)
    └── utils/            # Formatting (KSh currency), validation, algorithms
```
