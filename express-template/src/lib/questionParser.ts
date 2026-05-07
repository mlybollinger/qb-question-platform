export type ParsedTossup = {
  questionText: string;
  answer: string;
};

export type ParsedBonusPart = {
  partNumber: number;
  text: string;
  answer: string;
};

export type ParsedBonus = {
  bonusLeadin: string;
  parts: ParsedBonusPart[];
};

export function parseTossup(raw: string): ParsedTossup | null {
  // question_text may span multiple lines; answer is on the last line after ANSWER:
  const regex = /^(?<question_text>[\s\S]*)\nANSWER: (?<answer>.*)$/;
  const match = raw.trim().match(regex);
  if (!match?.groups) return null;
  return {
    questionText: match.groups.question_text,
    answer: match.groups.answer,
  };
}

export function parseBonus(raw: string): ParsedBonus | null {
  let pattern = '(?<bonus_leadin>.*)\\n';
  for (let i = 1; i <= 3; i++) {
    pattern += `(?<part_${i}_text>\\[10[emh]\\] .*)\\nANSWER: (?<part_${i}_answer>.*)`;
    if (i < 3) pattern += '\\n';
  }
  const regex = new RegExp(`^${pattern}$`);
  const match = raw.trim().match(regex);
  if (!match?.groups) return null;
  const g = match.groups;
  return {
    bonusLeadin: g.bonus_leadin,
    parts: [1, 2, 3].map(i => ({
      partNumber: i,
      text: g[`part_${i}_text`],
      answer: g[`part_${i}_answer`],
    })),
  };
}
