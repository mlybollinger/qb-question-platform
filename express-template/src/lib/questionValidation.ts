const HAS_UNDERLINE = /_[^_]+_/;

function parseAnswerBrackets(answer: string): {
  main: string;
  alternates: string[];
} {
  const bracketStart = answer.indexOf('[');
  const bracketEnd = answer.lastIndexOf(']');

  if (bracketStart === -1) {
    return { main: answer.trim(), alternates: [] };
  }

  const main = answer.slice(0, bracketStart).trim();
  const inside = answer.slice(bracketStart + 1, bracketEnd === -1 ? undefined : bracketEnd);
  const alternates = inside.split(';').map((s) => s.trim()).filter(Boolean);
  return { main, alternates };
}

function isQuotedInstruction(s: string): boolean {
  return s.startsWith('"') && s.endsWith('"');
}

function instructionType(s: string): 'prompt' | 'reject' | null {
  const inner = s.slice(1, -1).trim().toLowerCase();
  if (inner.startsWith('prompt')) return 'prompt';
  if (inner.startsWith('reject')) return 'reject';
  return null;
}

export function validateAnswerLine(answer: string): string | null {
  const { main, alternates } = parseAnswerBrackets(answer);

  if (!HAS_UNDERLINE.test(main)) {
    return 'Answer line must have at least one underlined section (e.g. _Answer_)';
  }

  type Phase = 'accept' | 'prompt' | 'reject';
  let phase: Phase = 'accept';

  for (const alt of alternates) {
    if (isQuotedInstruction(alt)) {
      const type = instructionType(alt);
      if (!type) {
        return `Quoted instruction "${alt}" must start with "prompt" or "reject"`;
      }
      if (type === 'prompt') {
        if (phase === 'reject') {
          return 'Prompt instructions must come before reject instructions';
        }
        phase = 'prompt';
      } else {
        phase = 'reject';
      }
    } else {
      if (phase !== 'accept') {
        return 'Accept alternates must come before prompt and reject instructions';
      }
      if (!HAS_UNDERLINE.test(alt)) {
        return `Alternate answer "${alt}" must have at least one underlined section (e.g. _Answer_)`;
      }
    }
  }

  return null;
}

export function validateTossupText(text: string): string | null {
  const lines = text.trimEnd().split('\n');
  const lastLine = lines[lines.length - 1].trim();
  if (!lastLine.startsWith('For 10 points, ')) {
    return 'Tossup text must end with a line beginning "For 10 points, "';
  }
  return null;
}

export type ValidationErrors = Record<string, string>;

export function validateTossupFields(fields: { questionText: string; answer: string }): ValidationErrors {
  const errors: ValidationErrors = {};
  const textErr = validateTossupText(fields.questionText);
  if (textErr) errors.questionText = textErr;
  const ansErr = validateAnswerLine(fields.answer);
  if (ansErr) errors.answer = ansErr;
  return errors;
}

export function validateBonusFields(fields: {
  parts: { answer: string }[];
}): ValidationErrors {
  const errors: ValidationErrors = {};
  for (const [i, part] of fields.parts.entries()) {
    const err = validateAnswerLine(part.answer);
    if (err) errors[`parts[${i}].answer`] = err;
  }
  return errors;
}
