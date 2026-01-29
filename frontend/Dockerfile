# 1. Imagen base
FROM node:20-alpine AS base

# 2. Instalar dependencias
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Construir el proyecto (Builder)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Esto generará la carpeta .next/standalone
RUN npm run build

# 4. Imagen final (Producción) - Súper ligera
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Desactivar telemetría de Next.js para ahorrar recursos
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos solo lo necesario del builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Next.js corre por defecto en el puerto 3000
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]