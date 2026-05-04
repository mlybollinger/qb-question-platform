export type ParsedTossup = {
  questionText: string;
  answer: string;
};

export type ParsedBonus = {
  bonusLeadin: string;
  part1Text: string;
  part1Answer: string;
  part2Text: string;
  part2Answer: string;
  part3Text: string;
  part3Answer: string;
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
    part1Text: g.part_1_text,
    part1Answer: g.part_1_answer,
    part2Text: g.part_2_text,
    part2Answer: g.part_2_answer,
    part3Text: g.part_3_text,
    part3Answer: g.part_3_answer,
  };
}
