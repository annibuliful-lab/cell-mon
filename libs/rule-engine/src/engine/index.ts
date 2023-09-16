import { cloneDeep, isEqual } from 'lodash';

import { API, Fact, Options, Rule } from './types';

// https://github.com/mithunsatheesh/node-rules
export class RuleEngine<T extends { matchPath?: string[] } = Fact> {
  public rules: Rule[] = [];

  public activeRules: Rule[] = [];

  private options = {
    ignoreFactChanges: false,
  };

  constructor(rules?: Rule | Rule[], options?: Options) {
    if (rules) {
      this.register(rules);
    }

    if (options) {
      this.options.ignoreFactChanges = !!options.ignoreFactChanges;
    }
  }

  init(): void {
    this.rules = [];
    this.activeRules = [];
  }

  register(rules: Rule | Rule[]): void {
    if (Array.isArray(rules)) {
      this.rules.push(...rules);
    } else if (rules !== null && typeof rules === 'object') {
      this.rules.push(rules);
    }
    this.sync();
  }

  sync(): void {
    this.activeRules = this.rules.filter((a) => {
      if (typeof a.on === 'undefined') {
        a.on = true;
      }
      if (a.on === true) {
        return a;
      }
    });
    this.activeRules.sort((a, b) => {
      if (a.priority && b.priority) {
        return b.priority - a.priority;
      }

      return 0;
    });
  }

  execute(fact: T, callback: (fact: T) => void): void {
    let complete = false;
    const session = cloneDeep(fact);
    let lastSession = cloneDeep(fact);
    let rules = this.activeRules;
    const matchPath: string[] = [];
    const ignoreFactChanges = this.options.ignoreFactChanges;

    function FnRuleLoop(x: number) {
      const API: API = {
        rule: () => rules[x],
        when: (outcome: boolean) => {
          if (outcome) {
            const _consequence = rules[x].consequence;
            _consequence.ruleRef = rules[x].id || rules[x].name || `index_${x}`;
            this.nextTick(() => {
              matchPath.push(_consequence.ruleRef as string);
              _consequence.call(session, API, session);
            });
          } else {
            this.nextTick(() => {
              API.next();
            });
          }
        },
        restart: () => FnRuleLoop(0),
        stop: () => {
          complete = true;
          return FnRuleLoop(0);
        },
        next: () => {
          if (!ignoreFactChanges && !isEqual(lastSession, session)) {
            lastSession = cloneDeep(session);
            this.nextTick(() => {
              API.restart();
            });
          } else {
            this.nextTick(() => {
              return FnRuleLoop(x + 1);
            });
          }
        },
      };

      rules = this.activeRules;
      if (x < rules.length && !complete) {
        const _rule = rules[x].condition;
        _rule.call(session, API, session);
      } else {
        this.nextTick(() => {
          session.matchPath = matchPath;
          callback(session);
        });
      }
    }
    FnRuleLoop(0);
  }

  nextTick(callback: () => void) {
    process?.nextTick ? process?.nextTick(callback) : setTimeout(callback, 0);
  }

  findRules(query?: Record<string, unknown>) {
    if (typeof query === 'undefined') {
      return this.rules;
    }

    // Clean the properties set to undefined in the search query if any to prevent miss match issues.
    Object.keys(query).forEach(
      (key) => query[key] === undefined && delete query[key]
    );

    // Return rules in the registered rules array which match partially to the query.
    return this.rules.filter((rule) => {
      return Object.keys(query).some((key) => {
        return query[key] === rule[key];
      });
    });
  }

  turn(state: string, filter?: Record<string, unknown>) {
    const rules = this.findRules(filter);
    for (let i = 0; i < rules.length; i++) {
      rules[i].on = state.toLowerCase() === 'on';
    }
    this.sync();
  }

  prioritize(priority: number, filter?: Record<string, unknown>) {
    const rules = this.findRules(filter);
    for (let i = 0; i < rules.length; i++) {
      rules[i].priority = priority;
    }
    this.sync();
  }
}
