type SlateNode = {
  type?: string;
  text?: string;
  children?: SlateNode[];
};

function collectLeafText(node: SlateNode): string {
  if (typeof node.text === 'string') return node.text;
  return (node.children ?? []).map(collectLeafText).join('');
}

function directChildren(node: SlateNode, type: string): SlateNode[] {
  return (node.children ?? []).filter((c) => c.type === type);
}

export function validateTossupBlob(blob: unknown): string | null {
  if (!Array.isArray(blob)) {
    return 'questionBlob must be an array of Slate nodes';
  }

  const nodes = blob as SlateNode[];

  const paragraphs = nodes.filter((n) => n.type === 'paragraph');
  if (paragraphs.length !== 1) {
    return 'questionBlob must contain one paragraph node';
  }
  if (!paragraphs.map(collectLeafText).join('').trim()) {
    return 'Question body must not be empty';
  }

  const answerlines = nodes.filter((n) => n.type === 'answerline');
  if (answerlines.length !== 1) {
    return 'questionBlob must contain exactly one answerline node';
  }

  const answerline = answerlines[0];

  if (directChildren(answerline, 'answer-label').length === 0) {
    return 'Answerline must contain an answer-label node';
  }

  const mainAnswers = directChildren(answerline, 'main-answer');
  if (mainAnswers.length === 0) {
    return 'Answerline must contain a main-answer node';
  }

  if (!mainAnswers.map(collectLeafText).join('').trim()) {
    return 'Answer must not be empty';
  }

  return null;
}

export function extractTossupText(blob: SlateNode[]): { questionText: string; answer: string } {
  const paragraphs = blob.filter((n) => n.type === 'paragraph');
  const questionText = paragraphs.map(collectLeafText).join('\n');

  const answerline = blob.find((n) => n.type === 'answerline')!;
  const answer = directChildren(answerline, 'main-answer').map(collectLeafText).join('');

  return { questionText, answer };
}

function extractAnswerlineText(answerline: SlateNode): string {
  return directChildren(answerline, 'main-answer').map(collectLeafText).join('');
}

function collectPartBodyText(partBody: SlateNode): string {
  return (partBody.children ?? [])
    .filter((c) => c.type !== 'point-marker')
    .map(collectLeafText)
    .join('');
}

function validateAnswerline(answerline: SlateNode, label: string): string | null {
  if (directChildren(answerline, 'answer-label').length === 0) {
    return `${label} answerline must contain an answer-label node`;
  }
  const mainAnswers = directChildren(answerline, 'main-answer');
  if (mainAnswers.length === 0) {
    return `${label} answerline must contain a main-answer node`;
  }
  if (!mainAnswers.map(collectLeafText).join('').trim()) {
    return `${label} answer must not be empty`;
  }
  return null;
}

export function validateBonusBlob(blob: unknown): string | null {
  if (!Array.isArray(blob)) {
    return 'questionBlob must be an array of Slate nodes';
  }

  const nodes = blob as SlateNode[];

  const leadins = nodes.filter((n) => n.type === 'bonus_leadin');
  if (leadins.length !== 1) {
    return 'questionBlob must contain exactly one bonus_leadin node';
  }
  if (!collectLeafText(leadins[0]).trim()) {
    return 'Bonus leadin must not be empty';
  }

  const parts = nodes.filter((n) => n.type === 'bonus_part');
  if (parts.length !== 3) {
    return 'questionBlob must contain exactly three bonus_part nodes';
  }

  for (let i = 0; i < 3; i++) {
    const part = parts[i];
    const label = `Part ${i + 1}`;

    const partBodies = directChildren(part, 'bonus-part-body');
    if (partBodies.length !== 1) {
      return `${label} must contain exactly one bonus-part-body node`;
    }
    const partBody = partBodies[0];

    if (directChildren(partBody, 'point-marker').length === 0) {
      return `${label} bonus-part-body must contain a point-marker node`;
    }
    if (!collectPartBodyText(partBody).trim()) {
      return `${label} body text must not be empty`;
    }

    const answerlines = directChildren(part, 'answerline');
    if (answerlines.length !== 1) {
      return `${label} must contain exactly one answerline node`;
    }
    const err = validateAnswerline(answerlines[0], label);
    if (err) return err;
  }

  return null;
}

export function extractBonusText(blob: SlateNode[]): {
  leadin: string;
  part1Text: string; part1Answer: string;
  part2Text: string; part2Answer: string;
  part3Text: string; part3Answer: string;
} {
  const leadin = collectLeafText(blob.find((n) => n.type === 'bonus_leadin')!);
  const parts = blob.filter((n) => n.type === 'bonus_part');

  const extract = (part: SlateNode) => ({
    text: collectPartBodyText(directChildren(part, 'bonus-part-body')[0]),
    answer: extractAnswerlineText(directChildren(part, 'answerline')[0]),
  });

  const [p1, p2, p3] = parts.map(extract);
  return {
    leadin,
    part1Text: p1.text, part1Answer: p1.answer,
    part2Text: p2.text, part2Answer: p2.answer,
    part3Text: p3.text, part3Answer: p3.answer,
  };
}
