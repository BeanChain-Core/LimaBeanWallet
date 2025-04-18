import fs from 'fs';
const FILE_PATH = './data/beanmojiCollection.json';

export function readCollection() {
  const raw = fs.readFileSync(FILE_PATH);
  return JSON.parse(raw);
}

export function writeCollection(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

export function getUserBeans(address) {
  const data = readCollection();
  return data[address] || [];
}

export function addUserBean(address, beanName) {
  const data = readCollection();
  if (!data[address]) data[address] = [];
  if (!data[address].includes(beanName)) {
    data[address].push(beanName);
    writeCollection(data);
  }
}
