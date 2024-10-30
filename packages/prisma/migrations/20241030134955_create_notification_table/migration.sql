-- CreateEnum
CREATE TYPE "NotificationTriggerEvents" AS ENUM ('NO_SLOTS_FOR_TEAM');

-- CreateEnum
CREATE TYPE "NotificationDeliveryMethod" AS ENUM ('EMAIL', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "NotificationBelongsToEntity" AS ENUM ('USER', 'TEAM', 'ORGANIZATION');

-- CreateTable
CREATE TABLE "NotificationTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "triggerEvent" "NotificationTriggerEvents" NOT NULL,
    "belongsTo" "NotificationBelongsToEntity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSetting" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER,
    "userId" INTEGER,
    "templateId" TEXT NOT NULL,
    "methods" "NotificationDeliveryMethod"[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "minTeamRoleRequired" "MembershipRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationTemplate_triggerEvent_idx" ON "NotificationTemplate"("triggerEvent");

-- CreateIndex
CREATE INDEX "NotificationSetting_teamId_idx" ON "NotificationSetting"("teamId");

-- CreateIndex
CREATE INDEX "NotificationSetting_userId_idx" ON "NotificationSetting"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSetting_teamId_templateId_methods_key" ON "NotificationSetting"("teamId", "templateId", "methods");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSetting_userId_templateId_methods_key" ON "NotificationSetting"("userId", "templateId", "methods");

-- AddForeignKey
ALTER TABLE "NotificationSetting" ADD CONSTRAINT "NotificationSetting_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSetting" ADD CONSTRAINT "NotificationSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSetting" ADD CONSTRAINT "NotificationSetting_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "NotificationTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
