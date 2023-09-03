import fs from 'node:fs';

export function csvToJson(path: string) {
  try {
    const content = fs.readFileSync(path, 'utf-8');
    const lines = content.split('\n') || [];
    const headers = lines.shift()?.toLocaleLowerCase().split(',');
    const bottles: any[] = [];
    lines.forEach((line) => {
      const rawBottle = line.split(',');
      const bottle = rawBottle.reduce((acc, value, index) => {
        const prop = headers ? headers[index] : 'default';
        return Object.assign({
          ...acc,
          [prop]: value,
        });
      }, {} as any);
      bottle.name = bottle.name || 'unknown';
      bottles.push(bottle);
    });
    console.log(`Read file ${path} done!`);
    return bottles;
  } catch (error) {
    console.log(`Oups error reading file ${path}`, error);
    return [];
  }
};