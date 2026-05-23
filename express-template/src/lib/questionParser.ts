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

  let lastIndex = 0;
  const data: Partial<ParsedBonus> = { }
  const leadinPattern = /(?<bonus_leadin>.*)/y
  const leadin = leadinPattern.exec(raw);
  if (!leadin) {
    throw new Error("Bonus leadin not found");
  }

  data['bonusLeadin'] = leadin[1];
  lastIndex = leadinPattern.lastIndex;
  const partPattern = /\n(?<part_text>\[10[emh]\] .*)/y
  const answerPattern = /\nANSWER: (?<answerline>.*)/y
  
  data['parts'] = [];
  for (let i = 1; i <= 3; i++) {
    partPattern.lastIndex = lastIndex;
    const bonusPart = partPattern.exec(raw);
    if (!bonusPart) {
      throw new Error(`Error parsing bonus: error in part ${i} text`);
    }
    answerPattern.lastIndex = partPattern.lastIndex;
    const partAnswer = answerPattern.exec(raw);
    
    if (!partAnswer) {
      throw new Error(`Error parsing bonus: error in part ${i} answer`);
    }
    lastIndex = answerPattern.lastIndex;
    data['parts'].push({ 
      partNumber: i,
      text: bonusPart[1],
      answer: partAnswer[1]
    })
  }

  return data as ParsedBonus;
}
