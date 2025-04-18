import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../scripts/nx.js';

describe('Basic Config', () => {
  // it('Sets empty config', () => {
  //   const config = setConfig({});
  //   expect(config.codeBase).to.equal('http://localhost:2000');
  // });
});

describe('Locale Configs', () => {
  it('Sets empty locale', () => {
    const config = setConfig({});
    expect(config.locale.prefix).to.equal('');
  });

  it('Sets base en locale', () => {
    const config = setConfig({ '': { ietf: 'en' } });
    expect(config.locale.ietf).to.be.undefined;
  });

  it('Sets base de locale', () => {
    const meta = document.createElement('meta');
    meta.name = 'locale';
    meta.content = 'de';

    document.head.append(meta);
    const config = setConfig({ locales: { de: { ietf: 'de' } } });
    expect(config.locale.ietf).to.equal('de');
  });
});
