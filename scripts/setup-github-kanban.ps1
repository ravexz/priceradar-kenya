# Setup GitHub Kanban Issues & Project Tasks for PriceRadar Kenya

$issues = @(
  @{ title = "EPIC: Core PostgreSQL Canonical Data Model & Schema"; body = "Define Product, Variant, Offer, PriceHistory, Merchant, Category, Attribute, ProductIdentifier schema in Prisma." },
  @{ title = "EPIC: 5-Level Product Matching Engine"; body = "Implement Level 1 (GTIN/MPN) to Level 5 (Admin Review Queue) matching pipeline with confidence scoring." },
  @{ title = "EPIC: Transparent Seller Trust Engine"; body = "Calculate 0-100 trust scores based on verification status, store address, warranty policy, return terms, and rating." },
  @{ title = "EPIC: Search Engine & Instant Autocomplete"; body = "Fast autocomplete, dynamic category-specific attribute filters (Price KSh, RAM, Storage, Brand) and sorting." },
  @{ title = "EPIC: Consumer Product Discovery & Seller Price Comparison"; body = "Product detail view, multi-seller offer ranking by total cost (price + delivery), 90-day price history chart, and price alerts." },
  @{ title = "EPIC: Grounded AI Shopping Assistant"; body = "Natural language prompt assistant querying live canonical database records without hallucinating specs or prices." },
  @{ title = "EPIC: Merchant Ingestion & Market Pricing Intelligence"; body = "CSV/JSON feed upload validator, preview table, and market position vs average price analytics." },
  @{ title = "EPIC: Admin Matching Review & Split/Merge Moderation"; body = "Admin interface to approve canonical product merges or split distinct variants." },
  @{ title = "EPIC: Standalone BullMQ Worker Queue System"; body = "Asynchronous queue workers for merchant CSV imports, price alert notifications, and price anomaly detection." },
  @{ title = "EPIC: Production Docker Compose Stack"; body = "Orchestrate postgres, redis, backend, worker, and frontend containers with automated health checks." }
)

foreach ($issue in $issues) {
  Write-Host "Creating GitHub Issue: $($issue.title)..."
  gh issue create --title "$($issue.title)" --body "$($issue.body)"
}
