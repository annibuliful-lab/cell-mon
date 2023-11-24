-- CreateTable
CREATE TABLE "phone_operator" (
    "mnc" TEXT NOT NULL,
    "mcc" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "technology" TEXT[],

    CONSTRAINT "phone_operator_pkey" PRIMARY KEY ("mnc","mcc","country","countryCode","brand","operator")
);
