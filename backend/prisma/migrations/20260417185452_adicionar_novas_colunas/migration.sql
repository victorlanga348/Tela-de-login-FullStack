/*
  Warnings:

  - You are about to drop the column `texto` on the `Tarefa` table. All the data in the column will be lost.
  - Added the required column `description` to the `Tarefa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task` to the `Tarefa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tarefa" DROP COLUMN "texto",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "task" TEXT NOT NULL;
