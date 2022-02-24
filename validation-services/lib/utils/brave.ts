import { FILTERS } from 'lib/data/blacklist';

export class BraveUtil {
  constructor() {}

  static isEmailValid(email: string): boolean {
    const metrics = {
      pluses: 0,
      dots: 0,
      tmps: 0,
      filters: 0,
    };
    email
      .toLowerCase()
      .split('')
      .forEach((l, i, a) => {
        let tmp3 = '';
        let tmp4 = '';
        if ((a[i - 2] && a[i - 1], a[i])) {
          tmp3 = `${a[i - 2]}${a[i - 1]}${a[i]}`.toLowerCase();
          tmp4 = `${a[i - 3]}${a[i - 2]}${a[i - 1]}${a[i]}`.toLowerCase();
          if (tmp3 === 'tmp' || tmp4 === 't.mp' || tmp4 === '.tmp' || tmp4 === 'tm.p') {
            metrics.tmps++;
          }
        }
        switch (l) {
          case '+':
            metrics.pluses++;
            break;
          case '.':
            metrics.dots++;
            break;
          default:
            break;
        }
      });
    for (let key in FILTERS) {
      if (email.indexOf(`${key}`) >= 0) {
        metrics.filters++;
      }
    }
    return metrics.pluses < 1 && metrics.dots < 3 && metrics.tmps < 1 && metrics.filters < 1;
  }
}
