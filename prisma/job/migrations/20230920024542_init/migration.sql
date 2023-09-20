-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('IDLE', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "job" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "referenceId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "input" JSONB,
    "result" JSONB,
    "status" "JobStatus" NOT NULL DEFAULT 'IDLE',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL,
    "errorMessage" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nextRunAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_referenceId_idx" ON "job"("referenceId");

-- CreateIndex
CREATE INDEX "job_workspaceId_idx" ON "job"("workspaceId");

-- CreateIndex
CREATE INDEX "schedule_workspaceId_idx" ON "schedule"("workspaceId");
