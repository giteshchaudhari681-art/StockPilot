# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Project documentation suite (`00-Project-Index.md` through `17-Implementation-Order.md`) defining system requirements, architecture, database schemas, API specifications, and security rules.
- Open-source licensing specification under the Apache License 2.0 (`LICENSE` and ADR-036 in `docs/15-Architecture-Decisions.md`).
- Root and workspace configuration files (`.gitignore`, `.editorconfig`, `.env.example`, `.dockerignore`).
- Master PostgreSQL database schema and client configuration via Prisma (`prisma/schema.prisma`).
- Backend application structure and service scaffolding (`backend/` with Express, TypeScript, and Prisma client integration).
- Frontend web application scaffolding (`frontend/` with Next.js, React, Tailwind CSS, and TanStack Query).
- Machine learning service scaffolding (`ml-service/` with FastAPI and Python scientific dependencies).
