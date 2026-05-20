import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { parseTossup, parseBonus } from '../src/lib/questionParser';

const prisma = new PrismaClient();

// Categories assigned in seed.txt order (tossups first, then bonuses)
const tossupCategories = [
  'American History',    // Harvey Milk
  'Painting/Sculpture',  // sculptures
  'Mythology',           // Hel
  'World Literature',    // Constantine Cavafy
  'European History',    // Sardinia
  'Chemistry',           // ammonia
  'Painting/Sculpture',  // Washington D.C. memorials
  'Other Science',       // discriminant
  'World Literature',    // the moon (Li Bai)
  'Social Science',      // contraction
];

const bonusCategories = [
  'Other Science',       // hypervelocity stars
  'Religion',            // Igbo chi / ogbanje
  'Biology',             // B lymphocytes / XLA
  'Social Science',      // Habermas / public sphere
  'Social Science',      // Gabriel Almond / political culture
  'World Literature',    // Omelas (Le Guin, Jemisin, Doctorow)
  'Other Fine Arts',     // Ahmad Jamal / cool jazz
  'World Literature',    // Clarice Lispector / G.H.
  'Painting/Sculpture',  // Admonitions scroll
  'World History',       // Bogd Khan / Mongolia
];

async function main() {
  // ── Parse seed.txt ────────────────────────────────────────────────────────
  const raw = fs.readFileSync(path.join(__dirname, 'seed.txt'), 'utf-8');
  const blocks = raw.split(/\n\n+/).map(b => b.trim()).filter(Boolean);

  const tossupBlocks = blocks.filter(b => !/\n\[10[emh]\]/.test(b));
  const bonusBlocks  = blocks.filter(b =>  /\n\[10[emh]\]/.test(b));

  if (tossupBlocks.length !== tossupCategories.length) {
    throw new Error(`Expected ${tossupCategories.length} tossups, found ${tossupBlocks.length}`);
  }
  if (bonusBlocks.length !== bonusCategories.length) {
    throw new Error(`Expected ${bonusCategories.length} bonuses, found ${bonusBlocks.length}`);
  }

  const parsedTossups = tossupBlocks.map((block, i) => {
    const result = parseTossup(block);
    if (!result) throw new Error(`Failed to parse tossup ${i + 1}:\n${block}`);
    return { ...result, category: tossupCategories[i] };
  });

  const parsedBonuses = bonusBlocks.map((block, i) => {
    const result = parseBonus(block);
    if (!result) throw new Error(`Failed to parse bonus ${i + 1}:\n${block}`);
    return { ...result, category: bonusCategories[i] };
  });

  // ── Clear in dependency order ─────────────────────────────────────────────
  await prisma.packetQuestion.deleteMany();
  await prisma.packet.deleteMany();
  await prisma.bonusPart.deleteMany();
  await prisma.bonus.deleteMany();
  await prisma.tossup.deleteMany();
  await prisma.question.deleteMany();
  await prisma.$executeRaw`ALTER SEQUENCE tossup_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE question_id_seq RESTART WITH 1`;
  await prisma.tournamentRoleAssignment.deleteMany();
  await prisma.tournamentCategory.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ── User ──────────────────────────────────────────────────────────────────
  const user = await prisma.user.create({
    data: {
      id: 1,
      firstName: 'Demo',
      lastName: 'Writer',
      username: 'demo',
      email: 'demo@example.com',
      passwordHash: await bcrypt.hash('password', 10),
    },
  });

  // ── Categories ────────────────────────────────────────────────────────────
  const categoryTree: Record<string, string | null> = {
    Literature: null,
    History: null,
    Science: null,
    RMP: null,
    Arts: null,
    'Social Science': null,
    Other: null,
    'American Literature': 'Literature',
    'British Literature': 'Literature',
    'European Literature': 'Literature',
    'World Literature': 'Literature',
    'American History': 'History',
    'European History': 'History',
    'World History': 'History',
    'Other History': 'History',
    Biology: 'Science',
    Chemistry: 'Science',
    Physics: 'Science',
    'Other Science': 'Science',
    Religion: 'RMP',
    Mythology: 'RMP',
    Philosophy: 'RMP',
    'Painting/Sculpture': 'Arts',
    'Classical Music': 'Arts',
    'Other Fine Arts': 'Arts',
  };

  const cats: Record<string, number> = {};
  
  for (const [name, parent] of Object.entries(categoryTree)) {
    if (parent) {
      const cat = await prisma.category.create({
        data: { name, parentId: cats[parent] },
      });
      cats[name] = cat.id;
    } else {
      const cat = await prisma.category.create({
        data: { name },
      });
      cats[name] = cat.id;
    }
  }

  // ── Tournament ────────────────────────────────────────────────────────────
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Sample Tournament',
      numberOfPackets: 14,
      questionsPerPacket: 20,
      distribution: {
        Literature: { 'American Literature': 1, 'British Literature': 1, 'European Literature': 1, 'World Literature': 1 },
        History: {'American History': 1, 'European History': 1, 'World History': 1, 'Other History': 1 },
        Science: {'Biology': 1, 'Chemistry': 1, 'Physics': 1, 'Other Science': 1 },
        RMP: {'Religion': 1, 'Mythology': 1, 'Philosophy': 1},
        Arts: {'Painting/Sculpture': 1, 'Classical Music': 1, 'Other Fine Arts': 1},
        'Social Science': {'Social Science': 1 },
        Other: {'Other': 1 },
      },
    },
  });

  // ── Distribution constraints ──────────────────────────────────────────────
  const leafCategories = Object.entries(categoryTree)
    .filter(([, parent]) => parent !== null)
    .map(([name]) => name);
  const uniqueLeaves = [...new Set([...leafCategories, 'Social Science', 'Other'])];

const parentCategories = Object.entries(categoryTree)
    .filter(([, parent]) => parent === null)
    .map(([name]) => name);
  for (const [index, name] of uniqueLeaves.entries()) {
     {
      await prisma.tournamentCategory.create({
        data: { tournamentId: tournament.id, categoryId: cats[name], numTossups: 1, numBonuses: 1, displayOrder: index},
      });
    }
  }

  for (const [index, name] of parentCategories.entries()) {
     {
      await prisma.tournamentCategory.create({
        data: { tournamentId: tournament.id, categoryId: cats[name], displayOrder: index},
      });
    }
  } 

  

  // ── Packets ───────────────────────────────────────────────────────────────
  for (let i = 1; i <= 14; i++) {
    await prisma.packet.create({ data: { packetNumber: i, tournamentId: tournament.id } });
  }

  const categorySlot: Record<string, number> = {
    'American Literature': 1,
    'British Literature': 2,
    'European Literature': 3,
    'World Literature': 4,
    'American History': 5,
    'European History': 6,
    'World History': 7,
    'Other History': 8,
    Biology: 9,
    Chemistry: 10,
    Physics: 11,
    'Other Science': 12,
    Religion: 13,
    Mythology: 14,
    Philosophy: 15,
    'Painting/Sculpture': 16,
    'Classical Music': 17,
    'Other Fine Arts': 18,
    'Social Science': 19,
    Other: 20,
  };

  const packet1 = await prisma.packet.findFirstOrThrow({
    where: { tournamentId: tournament.id, packetNumber: 1 },
  });

  // ── Tossups ───────────────────────────────────────────────────────────────
  for (const t of parsedTossups) {
    const q = await prisma.question.create({
      data: {
        authorId: user.id ?? 1,
        categoryId: cats[t.category],
        questionType: 'tossup',
        tournamentId: tournament.id,
        tossup: { create: { questionText: t.questionText, answer: t.answer } },
      },
    });
    await prisma.packetQuestion.create({
      data: {
        packetId: packet1.id,
        questionId: q.id,
        questionType: 'tossup',
        questionNumber: categorySlot[t.category],
      },
    });
  }

  // ── Bonuses ───────────────────────────────────────────────────────────────
  for (const b of parsedBonuses) {
    const q = await prisma.question.create({
      data: {
        authorId: user.id ?? 1,
        categoryId: cats[b.category],
        questionType: 'bonus',
        tournamentId: tournament.id,
        bonus: {
          create: {
            bonusLeadin: b.bonusLeadin,
            parts: {
              create: b.parts.map(p => ({
                partNumber: p.partNumber,
                text: p.text,
                answer: p.answer,
              })),
            },
          },
        },
      },
    });
    await prisma.packetQuestion.create({
      data: {
        packetId: packet1.id,
        questionId: q.id,
        questionType: 'bonus',
        questionNumber: categorySlot[b.category],
      },
    });
  }

  console.log('Seed complete.');
  console.log(`  User: ${user.username} (id ${user.id})`);
  console.log(`  Tournament: "${tournament.name}" (id ${tournament.id})`);
  console.log(`  Categories: ${Object.keys(cats).length}`);
  console.log(`  Tossups: ${parsedTossups.length} → assigned to packet 1`);
  console.log(`  Bonuses: ${parsedBonuses.length} → assigned to packet 1`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
