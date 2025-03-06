-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isPicture" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "pictureUrl" SET DEFAULT '/avatar.svg';

-- CreateTable
CREATE TABLE "Picture" (
    "hash" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "InterestSubject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "group" TEXT NOT NULL,

    CONSTRAINT "InterestSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "userId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "InterestSubject_name_group_key" ON "InterestSubject"("name", "group");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_userId_subjectId_key" ON "Interest"("userId", "subjectId");

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "InterestSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

