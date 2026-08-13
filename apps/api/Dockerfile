FROM node:22-alpine AS base
WORKDIR /repo
RUN corepack enable

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile --filter @finance-tracker/api...

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /repo/apps/api/node_modules ./apps/api/node_modules
COPY packages/shared packages/shared
COPY apps/api apps/api
WORKDIR /repo/apps/api
RUN npx prisma generate
EXPOSE 3000
CMD ["pnpm", "start"]
