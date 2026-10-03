stockpilot/
│
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── .gitignore
├── .editorconfig
├── .env.example
├── .dockerignore
│
├── docs/
│ │
│ ├── 00-Project-Index.md
│ ├── 01-PRD.md
│ ├── 02-Features.md
│ ├── 03-Roadmap.md
│ ├── 04-Architecture.md
│ ├── 05-Database.md
│ ├── 06-API.md
│ ├── 07-Security.md
│ ├── 08-AI.md
│ ├── 09-Rules.md
│ ├── 10-Phases.md
│ ├── 11-Design.md
│ ├── 12-Testing.md
│ ├── 13-Deployment.md
│ ├── 14-File-Architecture.md
│ ├── 15-Architecture-Decisions.md
│ ├── 16-RFC.md
│ └── 17-Implementation-Order.md
│
├── frontend/
│ │
│ ├── package.json
│ ├── next.config.ts
│ ├── tsconfig.json
│ ├── postcss.config.mjs
│ ├── eslint.config.mjs
│ ├── Dockerfile
│ ├── .env.example
│ │
│ ├── public/
│ │ ├── favicon.ico
│ │ ├── images/
│ │ │ ├── logo.svg
│ │ │ └── empty-state.svg
│ │ └── icons/
│ │ ├── dashboard.svg
│ │ ├── inventory.svg

│ │ ├── products.svg

│ │ ├── warehouse.svg

│ │ ├── suppliers.svg

│ │ ├── orders.svg

│ │ ├── forecasting.svg

│ │ ├── anomalies.svg

│ │ ├── risks.svg

│ │ ├── recommendations.svg

│ │ ├── simulations.svg

│ │ ├── analytics.svg

│ │ ├── notifications.svg

│ │ ├── search.svg

│ │ ├── filter.svg

│ │ ├── sort.svg

│ │ ├── add.svg

│ │ ├── edit.svg

│ │ ├── delete.svg

│ │ ├── refresh.svg

│ │ ├── download.svg

│ │ ├── upload.svg

│ │ ├── settings.svg

│ │ ├── user.svg

│ │ ├── logout.svg

│ │ ├── warning.svg

│ │ ├── error.svg

│ │ ├── success.svg

│ │ ├── success.svg

│ │ ├── trend-up.svg

│ │ ├── trend-down.svg

│ │ ├── stockout.svg

│ │ ├── overstock.svg

│ │ ├── transfer.svg

│ │ ├── reservation.svg

│ │ ├── supplier-risk.svg

│ │ └── ai-insight.svg

│ │  
│ └── src/
│ │
│ ├── app/
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ ├── globals.css
│ │ │
│ │ ├── login/
│ │ │ └── page.tsx
│ │ │
│ │ ├── dashboard/
│ │ │ └── page.tsx
│ │ │
│ │ ├── products/
│ │ │ ├── page.tsx
│ │ │ ├── new/
│ │ │ │ └── page.tsx
│ │ │ └── \[productId]/
│ │ │ └── page.tsx
│ │ │
│ │ ├── warehouses/
│ │ │ ├── page.tsx
│ │ │ ├── new/
│ │ │ │ └── page.tsx
│ │ │ └── \[warehouseId]/
│ │ │ └── page.tsx
│ │ │
│ │ ├── inventory/
│ │ │ ├── page.tsx
│ │ │ ├── movements/
│ │ │ │ └── page.tsx
│ │ │ ├── transfers/
│ │ │ │ └── page.tsx
│ │ │ └── reservations/
│ │ │ └── page.tsx
│ │ │
│ │ ├── suppliers/
│ │ │ ├── page.tsx
│ │ │ └── \[supplierId]/
│ │ │ └── page.tsx
│ │ │
│ │ ├── orders/
│ │ │ ├── page.tsx
│ │ │ ├── new/
│ │ │ │ └── page.tsx
│ │ │ └── \[orderId]/
│ │ │ └── page.tsx
│ │ │
│ │ ├── forecasting/
│ │ │ └── page.tsx
│ │ ├── anomalies/
│ │ │ └── page.tsx
│ │ ├── risks/
│ │ │ └── page.tsx
│ │ ├── recommendations/
│ │ │ └── page.tsx
│ │ ├── simulations/
│ │ │ └── page.tsx
│ │ ├── settings/
│ │ │ └── page.tsx
│ │ └── error.tsx
│ │
│ ├── components/
│ │ │
│ │ ├── ui/
│ │ │ ├── Button.tsx
│ │ │ ├── Input.tsx
│ │ │ ├── Select.tsx
│ │ │ ├── Checkbox.tsx
│ │ │ ├── Dialog.tsx
│ │ │ ├── DropdownMenu.tsx
│ │ │ ├── Tabs.tsx
│ │ │ ├── Badge.tsx
│ │ │ ├── Card.tsx
│ │ │ ├── Tooltip.tsx
│ │ │ ├── Table.tsx
│ │ │ ├── Pagination.tsx
│ │ │ └── Skeleton.tsx
│ │ │
│ │ ├── layout/
│ │ │ ├── AppSidebar.tsx
│ │ │ ├── AppHeader.tsx
│ │ │ ├── Navigation.tsx
│ │ │ ├── Breadcrumbs.tsx
│ │ │ └── PageContainer.tsx
│ │ │
│ │ ├── forms/
│ │ │ ├── FormField.tsx
│ │ │ ├── FormError.tsx
│ │ │ ├── FormActions.tsx
│ │ │ └── FormSection.tsx
│ │ │
│ │ ├── tables/
│ │ │ ├── DataTable.tsx
│ │ │ ├── TableToolbar.tsx
│ │ │ ├── TablePagination.tsx
│ │ │ └── TableEmptyState.tsx
│ │ │
│ │ ├── charts/
│ │ │ ├── InventoryChart.tsx
│ │ │ ├── DemandChart.tsx
│ │ │ ├── ForecastChart.tsx
│ │ │ ├── RiskChart.tsx
│ │ │ └── TrendChart.tsx
│ │ │
│ │ ├── feedback/
│ │ │ ├── LoadingState.tsx
│ │ │ ├── ErrorState.tsx
│ │ │ ├── EmptyState.tsx
│ │ │ ├── SuccessMessage.tsx
│ │ │ └── ErrorBoundary.tsx
│ │ │
│ │ └── intelligence/
│ │ ├── InsightCard.tsx
│ │ ├── ForecastCard.tsx
│ │ ├── RiskCard.tsx
│ │ ├── RecommendationCard.tsx
│ │ ├── ConfidenceIndicator.tsx
│ │ ├── EvidencePanel.tsx
│ │ └── ScenarioResultCard.tsx
│ │
│ ├── features/
│ │ │
│ │ ├── authentication/
│ │ │ ├── components/
│ │ │ │ ├── LoginForm.tsx
│ │ │ │ ├── LogoutButton.tsx
│ │ │ │ └── SessionGuard.tsx
│ │ │ ├── hooks/
│ │ │ │ └── useAuth.ts
│ │ │ ├── services/
│ │ │ │ └── auth.service.ts
│ │ │ ├── schemas/
│ │ │ │ └── auth.schema.ts
│ │ │ └── types/
│ │ │ └── auth.types.ts
│ │ │
│ │ ├── dashboard/
│ │ │ ├── components/
│ │ │ │ ├── DashboardHeader.tsx
│ │ │ │ ├── InventoryOverview.tsx
│ │ │ │ ├── StockoutOverview.tsx
│ │ │ │ ├── OverstockOverview.tsx
│ │ │ │ ├── RiskOverview.tsx
│ │ │ │ ├── ForecastOverview.tsx
│ │ │ │ └── RecommendationOverview.tsx
│ │ │ ├── hooks/
│ │ │ │ └── useDashboard.ts
│ │ │ ├── services/
│ │ │ │ └── dashboard.service.ts
│ │ │ └── types/
│ │ │ └── dashboard.types.ts
│ │ │
│ │ ├── products/
│ │ │ ├── components/
│ │ │ │ ├── ProductTable.tsx
│ │ │ │ ├── ProductForm.tsx
│ │ │ │ ├── ProductDetails.tsx
│ │ │ │ ├── ProductFilters.tsx
│ │ │ │ └── ProductSearch.tsx
│ │ │ ├── hooks/
│ │ │ │ └── useProducts.ts
│ │ │ ├── services/
│ │ │ │ └── product.service.ts
│ │ │ ├── schemas/
│ │ │ │ └── product.schema.ts
│ │ │ └── types/
│ │ │ └── product.types.ts
│ │ │
│ │ ├── warehouses/
│ │ │ ├── components/
│ │ │ │ ├── WarehouseTable.tsx
│ │ │ │ ├── WarehouseForm.tsx
│ │ │ │ ├── WarehouseDetails.tsx
│ │ │ │ ├── WarehouseCapacity.tsx
│ │ │ │ └── WarehouseInventory.tsx
│ │ │ ├── hooks/
│ │ │ │ └── useWarehouses.ts
│ │ │ ├── services/
│ │ │ │ └── warehouse.service.ts
│ │ │ ├── schemas/
│ │ │ │ └── warehouse.schema.ts
│ │ │ └── types/
│ │ │ └── warehouse.types.ts
│ │ │
│ │ ├── inventory/
│ │ │ ├── components/
│ │ │ │ ├── InventoryTable.tsx
│ │ │ │ ├── InventoryDetails.tsx
│ │ │ │ ├── InventoryStatus.tsx
│ │ │ │ ├── InventoryMovementForm.tsx
│ │ │ │ ├── InventoryAdjustmentForm.tsx
│ │ │ │ ├── InventoryTransferForm.tsx
│ │ │ │ ├── InventoryReservationForm.tsx
│ │ │ │ ├── InventoryHistory.tsx
│ │ │ │ └── InventoryFilters.tsx
│ │ │ ├── hooks/
│ │ │ │ ├── useInventory.ts
│ │ │ │ ├── useInventoryMovements.ts
│ │ │ │ ├── useInventoryTransfers.ts
│ │ │ │ └── useInventoryReservations.ts
│ │ │ ├── services/
│ │ │ │ └── inventory.service.ts
│ │ │ ├── schemas/
│ │ │ │ └── inventory.schema.ts
│ │ │ └── types/
│ │ │ └── inventory.types.ts
│ │ │
│ │ ├── suppliers/
│ │ │ ├── components/
│ │ │ │ ├── SupplierTable.tsx
│ │ │ │ ├── SupplierForm.tsx
│ │ │ │ ├── SupplierDetails.tsx
│ │ │ │ ├── SupplierPerformance.tsx
│ │ │ │ └── SupplierRisk.tsx
│ │ │ ├── hooks/
│ │ │ │ └── useSuppliers.ts
│ │ │ ├── services/
│ │ │ │ └── supplier.service.ts
│ │ │ └── types/
│ │ │ └── supplier.types.ts
│ │ │
│ │ ├── orders/
│ │ │ ├── components/
│ │ │ │ ├── OrderTable.tsx
│ │ │ │ ├── OrderForm.tsx
│ │ │ │ ├── OrderDetails.tsx
│ │ │ │ ├── OrderStatus.tsx
│ │ │ │ ├── OrderItems.tsx
│ │ │ │ └── OrderTimeline.tsx
│ │ │ ├── hooks/
│ │ │ │ └── useOrders.ts
│ │ │ ├── services/
│ │ │ │ └── order.service.ts
│ │ │ ├── schemas/
│ │ │ │ └── order.schema.ts
│ │ │ └── types/
│ │ │ └── order.types.ts
│ │ │
│ │ ├── forecasting/
│ │ │ ├── components/
│ │ │ │ ├── ForecastDashboard.tsx
│ │ │ │ ├── ForecastChart.tsx
│ │ │ │ ├── ForecastSummary.tsx
│ │ │ │ ├── ForecastConfidence.tsx
│ │ │ │ └── ForecastComparison.tsx
│ │ │ ├── hooks/
│ │ │ │ └── useForecasts.ts
│ │ │ ├── services/
│ │ │ │ └── forecasting.service.ts
│ │ │ └── types/
│ │ │ └── forecasting.types.ts
│ │ │
│ │ ├── anomalies/
│ │ │ ├── components/
│ │ │ │ ├── AnomalyDashboard.tsx
│ │ │ │ ├── AnomalyTable.tsx
│ │ │ │ ├── AnomalyDetails.tsx
│ │ │ │ ├── AnomalySeverity.tsx
│ │ │ │ └── AnomalyEvidence.tsx
│ │ │ ├── hooks/
│ │ │ │ └── useAnomalies.ts
│ │ │ ├── services/
│ │ │ │ └── anomaly.service.ts
│ │ │ └── types/
│ │ │ └── anomaly.types.ts
│ │ │
│ │ ├── risks/
│ │ │ ├── components/
│ │ │ │ ├── RiskDashboard.tsx
│ │ │ │ ├── RiskTable.tsx
│ │ │ │ ├── RiskDetails.tsx
│ │ │ │ ├── RiskSeverity.tsx
│ │ │ │ └── RiskEvidence.tsx
│ │ │ ├── hooks/
│ │ │ │ └── useRisks.ts
│ │ │ ├── services/
│ │ │ │ └── risk.service.ts
│ │ │ └── types/
│ │ │ └── risk.types.ts
│ │ │
│ │ ├── recommendations/
│ │ │ ├── components/
│ │ │ │ ├── RecommendationDashboard.tsx
│ │ │ │ ├── RecommendationTable.tsx
│ │ │ │ ├── RecommendationDetails.tsx
│ │ │ │ ├── RecommendationEvidence.tsx
│ │ │ │ ├── RecommendationAction.tsx
│ │ │ │ └── RecommendationHistory.tsx
│ │ │ ├── hooks/
│ │ │ │ └── useRecommendations.ts
│ │ │ ├── services/
│ │ │ │ └── recommendation.service.ts
│ │ │ └── types/
│ │ │ └── recommendation.types.ts
│ │ │
│ │ └── simulations/
│ │ ├── components/
│ │ │ ├── SimulationDashboard.tsx
│ │ │ ├── ScenarioBuilder.tsx
│ │ │ ├── ScenarioInputs.tsx
│ │ │ ├── SimulationResults.tsx
│ │ │ ├── ScenarioComparison.tsx
│ │ │ └── SimulationChart.tsx
│ │ ├── hooks/
│ │ │ └── useSimulations.ts
│ │ ├── services/
│ │ │ └── simulation.service.ts
│ │ └── types/
│ │ └── simulation.types.ts
│ │
│ ├── lib/
│ │ ├── api-client.ts
│ │ ├── query-client.ts
│ │ ├── socket-client.ts
│ │ └── utils.ts
│ │
│ ├── providers/
│ │ ├── QueryProvider.tsx
│ │ ├── AuthProvider.tsx
│ │ └── SocketProvider.tsx
│ │
│ ├── types/
│ │ ├── api.types.ts
│ │ ├── common.types.ts
│ │ └── user.types.ts
│ │
│ └── utils/
│ ├── formatCurrency.ts
│ ├── formatNumber.ts
│ ├── formatPercentage.ts
│ ├── formatDate.ts
│ └── error.ts
│
├── backend/
│ │
│ ├── package.json
│ ├── tsconfig.json
│ ├── eslint.config.mjs
│ ├── Dockerfile
│ ├── .env.example
│ │
│ └── src/
│ │
│ ├── server.ts
│ ├── app.ts
│ │
│ ├── config/
│ │ ├── env.ts
│ │ ├── database.ts
│ │ ├── redis.ts
│ │ └── application.ts
│ │
│ ├── common/
│ │ ├── errors/
│ │ │ ├── AppError.ts
│ │ │ ├── NotFoundError.ts
│ │ │ ├── UnauthorizedError.ts
│ │ │ └── ForbiddenError.ts
│ │ ├── middleware/
│ │ │ ├── error.middleware.ts
│ │ │ ├── request-id.middleware.ts
│ │ │ └── validation.middleware.ts
│ │ ├── types/
│ │ │ ├── express.d.ts
│ │ │ └── common.types.ts
│ │ └── utils/
│ │ ├── pagination.ts
│ │ ├── dates.ts
│ │ └── numbers.ts
│ │
│ ├── auth/
│ │ ├── auth.controller.ts
│ │ ├── auth.service.ts
│ │ ├── auth.repository.ts
│ │ ├── auth.schema.ts
│ │ ├── auth.types.ts
│ │ ├── password.service.ts
│ │ └── token.service.ts
│ │
│ ├── products/
│ │ ├── product.controller.ts
│ │ ├── product.service.ts
│ │ ├── product.repository.ts
│ │ ├── product.schema.ts
│ │ ├── product.types.ts
│ │ └── product.mapper.ts
│ │
│ ├── warehouses/
│ │ ├── warehouse.controller.ts
│ │ ├── warehouse.service.ts
│ │ ├── warehouse.repository.ts
│ │ ├── warehouse.schema.ts
│ │ ├── warehouse.types.ts
│ │ └── warehouse.mapper.ts
│ │
│ ├── inventory/
│ │ ├── inventory.controller.ts
│ │ ├── inventory.service.ts
│ │ ├── inventory.repository.ts
│ │ ├── inventory.schema.ts
│ │ ├── inventory.types.ts
│ │ ├── inventory.mapper.ts
│ │ │
│ │ ├── movements/
│ │ │ ├── movement.controller.ts
│ │ │ ├── movement.service.ts
│ │ │ ├── movement.repository.ts
│ │ │ └── movement.types.ts
│ │ │
│ │ ├── transfers/
│ │ │ ├── transfer.controller.ts
│ │ │ ├── transfer.service.ts
│ │ │ ├── transfer.repository.ts
│ │ │ └── transfer.types.ts
│ │ │
│ │ └── reservations/
│ │ ├── reservation.controller.ts
│ │ ├── reservation.service.ts
│ │ ├── reservation.repository.ts
│ │ └── reservation.types.ts
│ │
│ ├── suppliers/
│ │ ├── supplier.controller.ts
│ │ ├── supplier.service.ts
│ │ ├── supplier.repository.ts
│ │ ├── supplier.schema.ts
│ │ ├── supplier.types.ts
│ │ └── supplier.mapper.ts
│ │
│ ├── orders/
│ │ ├── order.controller.ts
│ │ ├── order.service.ts
│ │ ├── order.repository.ts
│ │ ├── order.schema.ts
│ │ ├── order.types.ts
│ │ └── order.mapper.ts
│ │
│ ├── forecasting/
│ │ ├── forecasting.controller.ts
│ │ ├── forecasting.service.ts
│ │ ├── forecasting.client.ts
│ │ ├── forecasting.types.ts
│ │ └── forecasting.mapper.ts
│ │
│ ├── anomalies/
│ │ ├── anomaly.controller.ts
│ │ ├── anomaly.service.ts
│ │ ├── anomaly.repository.ts
│ │ ├── anomaly.types.ts
│ │ └── anomaly.mapper.ts
│ │
│ ├── risks/
│ │ ├── risk.controller.ts
│ │ ├── risk.service.ts
│ │ ├── risk.repository.ts
│ │ ├── risk.types.ts
│ │ └── risk.mapper.ts
│ │
│ ├── recommendations/
│ │ ├── recommendation.controller.ts
│ │ ├── recommendation.service.ts
│ │ ├── recommendation.repository.ts
│ │ ├── recommendation.schema.ts
│ │ ├── recommendation.types.ts
│ │ └── recommendation.mapper.ts
│ │
│ ├── simulations/
│ │ ├── simulation.controller.ts
│ │ ├── simulation.service.ts
│ │ ├── simulation.client.ts
│ │ ├── simulation.types.ts
│ │ └── simulation.mapper.ts
│ │
│ ├── dashboard/
│ │ ├── dashboard.controller.ts
│ │ ├── dashboard.service.ts
│ │ ├── dashboard.repository.ts
│ │ └── dashboard.types.ts
│ │
│ ├── jobs/
│ │ ├── queues.ts
│ │ ├── workers.ts
│ │ ├── inventory/
│ │ │ └── inventory-sync.worker.ts
│ │ ├── forecasting/
│ │ │ └── forecasting.worker.ts
│ │ ├── recommendations/
│ │ │ └── recommendation.worker.ts
│ │ └── notifications/
│ │ └── notification.worker.ts
│ │
│ ├── realtime/
│ │ ├── socket.ts
│ │ ├── socket-auth.ts
│ │ └── inventory-events.ts
│ │
│ ├── middleware/
│ │ ├── auth.middleware.ts
│ │ ├── role.middleware.ts
│ │ └── rate-limit.middleware.ts
│ │
│ └── routes/
│ ├── index.ts
│ ├── auth.routes.ts
│ ├── product.routes.ts
│ ├── warehouse.routes.ts
│ ├── inventory.routes.ts
│ ├── supplier.routes.ts
│ ├── order.routes.ts
│ ├── forecasting.routes.ts
│ ├── anomaly.routes.ts
│ ├── risk.routes.ts
│ ├── recommendation.routes.ts
│ ├── simulation.routes.ts
│ └── dashboard.routes.ts
│
├── ml-service/
│ │
│ ├── requirements.txt
│ ├── requirements-dev.txt
│ ├── Dockerfile
│ ├── .env.example
│ │
│ ├── app/
│ │ ├── main.py
│ │ ├── config.py
│ │ ├── dependencies.py
│ │ │
│ │ ├── api/
│ │ │ ├── routes/
│ │ │ │ ├── health.py
│ │ │ │ ├── forecasting.py
│ │ │ │ ├── anomaly.py
│ │ │ │ ├── risk.py
│ │ │ │ ├── recommendation.py
│ │ │ │ └── simulation.py
│ │ │ └── schemas/
│ │ │ ├── forecasting.py
│ │ │ ├── anomaly.py
│ │ │ ├── risk.py
│ │ │ ├── recommendation.py
│ │ │ └── simulation.py
│ │ │
│ │ ├── forecasting/
│ │ │ ├── data/
│ │ │ │ ├── loader.py
│ │ │ │ ├── cleaner.py
│ │ │ │ └── validator.py
│ │ │ ├── preprocessing/
│ │ │ │ ├── scaler.py
│ │ │ │ ├── transformer.py
│ │ │ │ └── pipeline.py
│ │ │ ├── features/
│ │ │ │ ├── demand\_features.py
│ │ │ │ ├── inventory\_features.py
│ │ │ │ ├── seasonal\_features.py
│ │ │ │ └── feature\_pipeline.py
│ │ │ ├── models/
│ │ │ │ ├── baseline.py
│ │ │ │ ├── statistical.py
│ │ │ │ ├── machine\_learning.py
│ │ │ │ └── model\_registry.py
│ │ │ ├── inference/
│ │ │ │ ├── predictor.py
│ │ │ │ ├── forecast\_engine.py
│ │ │ │ └── confidence.py
│ │ │ ├── evaluation/
│ │ │ │ ├── metrics.py
│ │ │ │ ├── evaluator.py
│ │ │ │ └── backtesting.py
│ │ │ └── configuration/
│ │ │ ├── model\_config.py
│ │ │ └── forecast\_config.py
│ │ │
│ │ ├── anomaly\_detection/
│ │ │ ├── data/
│ │ │ │ ├── loader.py
│ │ │ │ └── validator.py
│ │ │ ├── preprocessing/
│ │ │ │ ├── cleaner.py
│ │ │ │ └── transformer.py
│ │ │ ├── features/
│ │ │ │ ├── inventory\_features.py
│ │ │ │ └── demand\_features.py
│ │ │ ├── models/
│ │ │ │ ├── statistical\_detector.py
│ │ │ │ ├── machine\_learning\_detector.py
│ │ │ │ └── detector\_registry.py
│ │ │ ├── inference/
│ │ │ │ ├── detector.py
│ │ │ │ └── scorer.py
│ │ │ └── evaluation/
│ │ │ ├── metrics.py
│ │ │ └── evaluator.py
│ │ │
│ │ ├── supplier\_risk/
│ │ │ ├── data/
│ │ │ │ ├── loader.py
│ │ │ │ └── validator.py
│ │ │ ├── preprocessing/
│ │ │ │ └── transformer.py
│ │ │ ├── features/
│ │ │ │ ├── supplier\_features.py
│ │ │ │ ├── delivery\_features.py
│ │ │ │ └── quality\_features.py
│ │ │ ├── models/
│ │ │ │ ├── risk\_model.py
│ │ │ │ └── model\_registry.py
│ │ │ ├── inference/
│ │ │ │ ├── scorer.py
│ │ │ │ └── risk\_engine.py
│ │ │ └── evaluation/
│ │ │ ├── metrics.py
│ │ │ └── evaluator.py
│ │ │
│ │ ├── recommendations/
│ │ │ ├── signals/
│ │ │ │ ├── inventory\_signals.py
│ │ │ │ ├── demand\_signals.py
│ │ │ │ └── risk\_signals.py
│ │ │ ├── rules/
│ │ │ │ ├── stockout\_rules.py
│ │ │ │ ├── overstock\_rules.py
│ │ │ │ └── reorder\_rules.py
│ │ │ ├── ranking/
│ │ │ │ ├── recommendation\_ranker.py
│ │ │ │ └── priority\_scorer.py
│ │ │ ├── generation/
│ │ │ │ └── recommendation\_engine.py
│ │ │ └── validation/
│ │ │ └── recommendation\_validator.py
│ │ │
│ │ ├── simulation/
│ │ │ ├── scenario.py
│ │ │ ├── state.py
│ │ │ ├── engine.py
│ │ │ ├── result.py
│ │ │ └── validator.py
│ │ │
│ │ └── common/
│ │ ├── data/
│ │ │ ├── database.py
│ │ │ └── repository.py
│ │ ├── features/
│ │ │ └── feature\_utils.py
│ │ ├── evaluation/
│ │ │ └── metrics.py
│ │ └── utilities/
│ │ ├── logging.py
│ │ └── validation.py
│ │
│ └── tests/
│ ├── test\_health.py
│ ├── forecasting/
│ │ ├── test\_data.py
│ │ ├── test\_preprocessing.py
│ │ ├── test\_features.py
│ │ ├── test\_models.py
│ │ ├── test\_inference.py
│ │ └── test\_evaluation.py
│ ├── anomaly\_detection/
│ │ ├── test\_data.py
│ │ ├── test\_preprocessing.py
│ │ ├── test\_features.py
│ │ ├── test\_models.py
│ │ └── test\_inference.py
│ ├── supplier\_risk/
│ │ ├── test\_data.py
│ │ ├── test\_features.py
│ │ ├── test\_models.py
│ │ └── test\_inference.py
│ ├── recommendations/
│ │ ├── test\_signals.py
│ │ ├── test\_rules.py
│ │ ├── test\_ranking.py
│ │ └── test\_generation.py
│ └── simulation/
│ ├── test\_scenario.py
│ ├── test\_engine.py
│ ├── test\_result.py
│ └── test\_validation.py
│
├── prisma/
│ ├── schema.prisma
│ └── migrations/
│ ├── ...
│ └── migration\_lock.toml
│
├── database/
│ ├── seeds/
│ │ ├── seed.ts
│ │ ├── users.seed.ts
│ │ ├── products.seed.ts
│ │ ├── warehouses.seed.ts
│ │ ├── suppliers.seed.ts
│ │ └── inventory.seed.ts
│ │
│ └── scripts/
│ ├── reset.ts
│ ├── backup.ts
│ └── validate.ts
│
├── tests/
│ │
│ ├── e2e/
│ │ │
│ │ ├── authentication/
│ │ │ ├── login.spec.ts
│ │ │ ├── logout.spec.ts
│ │ │ └── session-expiry.spec.ts
│ │ │
│ │ ├── products/
│ │ │ ├── create-product.spec.ts
│ │ │ ├── update-product.spec.ts
│ │ │ ├── delete-product.spec.ts
│ │ │ └── product-search.spec.ts
│ │ │
│ │ ├── inventory/
│ │ │ ├── inventory-overview.spec.ts
│ │ │ ├── inventory-adjustment.spec.ts
│ │ │ ├── inventory-movement.spec.ts
│ │ │ ├── inventory-transfer.spec.ts
│ │ │ └── inventory-reservation.spec.ts
│ │ │
│ │ ├── warehouses/
│ │ │ ├── create-warehouse.spec.ts
│ │ │ ├── update-warehouse.spec.ts
│ │ │ └── warehouse-inventory.spec.ts
│ │ │
│ │ ├── suppliers/
│ │ │ ├── create-supplier.spec.ts
│ │ │ ├── update-supplier.spec.ts
│ │ │ └── supplier-risk.spec.ts
│ │ │
│ │ ├── orders/
│ │ │ ├── create-order.spec.ts
│ │ │ ├── update-order.spec.ts
│ │ │ ├── fulfill-order.spec.ts
│ │ │ └── cancel-order.spec.ts
│ │ │
│ │ ├── forecasting/
│ │ │ ├── forecast-dashboard.spec.ts
│ │ │ ├── forecast-generation.spec.ts
│ │ │ └── forecast-results.spec.ts
│ │ │
│ │ ├── risks/
│ │ │ ├── risk-dashboard.spec.ts
│ │ │ ├── risk-details.spec.ts
│ │ │ └── risk-evidence.spec.ts
│ │ │
│ │ ├── recommendations/
│ │ │ ├── recommendation-dashboard.spec.ts
│ │ │ ├── recommendation-details.spec.ts
│ │ │ ├── recommendation-action.spec.ts
│ │ │ └── recommendation-history.spec.ts
│ │ │
│ │ └── simulations/
│ │ ├── scenario-builder.spec.ts
│ │ ├── simulation-execution.spec.ts
│ │ └── scenario-comparison.spec.ts
│ │
│ ├── integration/
│ │ │
│ │ ├── api/
│ │ │ ├── auth.integration.test.ts
│ │ │ ├── products.integration.test.ts
│ │ │ ├── warehouses.integration.test.ts
│ │ │ ├── inventory.integration.test.ts
│ │ │ ├── suppliers.integration.test.ts
│ │ │ ├── orders.integration.test.ts
│ │ │ ├── forecasting.integration.test.ts
│ │ │ ├── risks.integration.test.ts
│ │ │ ├── recommendations.integration.test.ts
│ │ │ └── simulations.integration.test.ts
│ │ │
│ │ ├── database/
│ │ │ ├── product.repository.test.ts
│ │ │ ├── warehouse.repository.test.ts
│ │ │ ├── inventory.repository.test.ts
│ │ │ ├── supplier.repository.test.ts
│ │ │ ├── order.repository.test.ts
│ │ │ └── transaction.integrity.test.ts
│ │ │
│ │ ├── redis/
│ │ │ ├── cache.integration.test.ts
│ │ │ ├── queue.integration.test.ts
│ │ │ └── invalidation.integration.test.ts
│ │ │
│ │ └── ml-service/
│ │ ├── forecasting-client.integration.test.ts
│ │ ├── anomaly-client.integration.test.ts
│ │ ├── risk-client.integration.test.ts
│ │ ├── recommendation-client.integration.test.ts
│ │ └── simulation-client.integration.test.ts
│ │
│ ├── security/
│ │ │
│ │ ├── authentication/
│ │ │ ├── invalid-login.test.ts
│ │ │ ├── expired-token.test.ts
│ │ │ └── invalid-token.test.ts
│ │ │
│ │ ├── authorization/
│ │ │ ├── role-access.test.ts
│ │ │ ├── protected-endpoints.test.ts
│ │ │ └── privilege-escalation.test.ts
│ │ │
│ │ ├── ownership/
│ │ │ ├── inventory-ownership.test.ts
│ │ │ ├── warehouse-ownership.test.ts
│ │ │ ├── order-ownership.test.ts
│ │ │ └── supplier-ownership.test.ts
│ │ │
│ │ └── validation/
│ │ ├── input-validation.test.ts
│ │ ├── injection-protection.test.ts
│ │ └── malformed-request.test.ts
│ │
│ └── performance/
│ │
│ ├── api/
│ │ ├── inventory.load.test.ts
│ │ ├── orders.load.test.ts
│ │ ├── products.load.test.ts
│ │ └── dashboard.load.test.ts
│ │
│ ├── database/
│ │ ├── inventory.query.test.ts
│ │ ├── order.query.test.ts
│ │ ├── analytics.query.test.ts
│ │ └── concurrent-update.test.ts
│ │
│ ├── inventory/
│ │ ├── concurrent-transfer.test.ts
│ │ ├── concurrent-reservation.test.ts
│ │ └── high-volume-movement.test.ts
│ │
│ └── forecasting/
│ ├── inference-latency.test.ts
│ ├── batch-forecast.test.ts
│ └── concurrent-forecast.test.ts
│
├── scripts/
│ ├── setup.ts
│ ├── dev.ts
│ ├── build.ts
│ ├── test.ts
│ ├── lint.ts
│ ├── format.ts
│ ├── migrate.ts
│ ├── seed.ts
│ └── cleanup.ts
│
├── infrastructure/
│ │
│ └── docker/
│ ├── Dockerfile.frontend
│ ├── Dockerfile.backend
│ ├── Dockerfile.ml-service
│ └── docker-compose.yml
│
└── tools/
├── development/
│ ├── check-environment.ts
│ └── validate-config.ts
│
├── database/
│ ├── inspect-schema.ts
│ └── validate-schema.ts
│
└── testing/
├── test-data.ts
└── test-helpers.ts
