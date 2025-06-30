export function resolveAlias(raw) {
  if (!raw) return '';
  const input = raw.trim().toLowerCase();

  const ALIASES = {
    'beanx:0x5283d1e237b034c35e9ff8f586cedbe18abcccff': 'Reward Node',
    '0x5283d1e237b034c35e9ff8f586cedbe18abcccff': 'Reward Node'
  };

  return ALIASES[input] ?? raw;
}