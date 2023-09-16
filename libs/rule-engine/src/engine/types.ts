export interface Consequence {
  (API: API, fact: Fact): void;
  ruleRef?: string | undefined;
}

export type Rule = {
  id?: string;
  index?: number;
  name?: string;
  on?: boolean;
  priority?: number;
  condition: (API: API, fact: Fact) => void;
  consequence: Consequence;
};

export type Fact = {
  [key: string]: unknown;
  matchPath?: string[];
};

export type Options = {
  ignoreFactChanges?: boolean;
};

export interface API<T = unknown> {
  rule: () => Rule;
  when: (outcome: T) => void;
  restart: () => void;
  stop: () => void;
  next: () => void;
}
