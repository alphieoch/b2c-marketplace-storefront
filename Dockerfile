# ---------------------------------------------------------------------------
# OpenStore Storefront — Next.js 15 Application
# Updated for Azure Container Apps deployment with env var support
# ---------------------------------------------------------------------------

FROM node:24-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY apps/storefront/package.json ./apps/storefront/
RUN cd apps/storefront && npm install --legacy-peer-deps

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/apps/storefront/node_modules ./apps/storefront/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Accept Azure-specific build args for NEXT_PUBLIC_ variables
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_AI_SEARCH_ENDPOINT
ARG NEXT_PUBLIC_BLOB_STORAGE_URL
ARG NEXT_PUBLIC_DEFAULT_REGION=ke

ENV NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION

RUN cd apps/storefront && npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/apps/storefront/public ./apps/storefront/public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/.next/static ./apps/storefront/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

WORKDIR /app/apps/storefront
CMD ["node", "server.js"]
