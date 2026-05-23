import { createContext, useContext } from 'react';

export const QuestionContext = createContext(null);

export function useQuestion() {
  return useContext(QuestionContext);
}
