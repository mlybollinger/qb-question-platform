-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('tossup', 'bonus');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('written', 'edited', 'proofread');

-- CreateEnum
CREATE TYPE "TournamentRole" AS ENUM ('writer', 'editor');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_relation" (
    "id" SERIAL NOT NULL,
    "child_category_id" INTEGER NOT NULL,
    "parent_category_id" INTEGER NOT NULL,

    CONSTRAINT "category_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "metadata" JSONB,
    "due_date" TIMESTAMP(3),
    "number_of_packets" INTEGER,
    "questions_per_packet" INTEGER,
    "distribution" JSONB,

    CONSTRAINT "tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "tournament_id" INTEGER NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3) NOT NULL,
    "status" "QuestionStatus" NOT NULL DEFAULT 'written',

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tossup" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "tossup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bonus" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "part_1_text" TEXT NOT NULL,
    "part_1_answer" TEXT NOT NULL,
    "part_2_text" TEXT NOT NULL,
    "part_2_answer" TEXT NOT NULL,
    "part_3_text" TEXT NOT NULL,
    "part_3_answer" TEXT NOT NULL,

    CONSTRAINT "bonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packet_distribution_constraints" (
    "id" SERIAL NOT NULL,
    "tournament_id" INTEGER NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "num_questions" INTEGER NOT NULL,

    CONSTRAINT "packet_distribution_constraints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packet" (
    "id" SERIAL NOT NULL,
    "packet_number" INTEGER NOT NULL,
    "tournament_id" INTEGER NOT NULL,

    CONSTRAINT "packet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packet_question" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "packet_id" INTEGER NOT NULL,
    "question_number" INTEGER NOT NULL,
    "question_type" "QuestionType" NOT NULL,

    CONSTRAINT "packet_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_role" (
    "id" SERIAL NOT NULL,
    "tournament_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_name" "TournamentRole" NOT NULL,

    CONSTRAINT "tournament_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tossup_question_id_key" ON "tossup"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "bonus_question_id_key" ON "bonus"("question_id");

-- AddForeignKey
ALTER TABLE "category_relation" ADD CONSTRAINT "category_relation_child_category_id_fkey" FOREIGN KEY ("child_category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_relation" ADD CONSTRAINT "category_relation_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tossup" ADD CONSTRAINT "tossup_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonus" ADD CONSTRAINT "bonus_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packet_distribution_constraints" ADD CONSTRAINT "packet_distribution_constraints_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packet" ADD CONSTRAINT "packet_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packet_question" ADD CONSTRAINT "packet_question_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packet_question" ADD CONSTRAINT "packet_question_packet_id_fkey" FOREIGN KEY ("packet_id") REFERENCES "packet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_role" ADD CONSTRAINT "tournament_role_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_role" ADD CONSTRAINT "tournament_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
