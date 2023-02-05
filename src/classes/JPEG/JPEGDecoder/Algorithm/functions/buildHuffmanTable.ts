export function buildHuffmanTable(codeLengths, values) {
  let k = 0, code: { children: any[]; index: number; }[] = [], length = 16;
  while(length > 0 && !codeLengths[length - 1])
    length--;
  code.push({children: [], index: 0});
  let p: any = code[0], q;
  for(let i = 0; i < length; i++) {
    for(let j = 0; j < codeLengths[i]; j++) {
      p = code.pop();
      p.children[p.index] = values[k];
      while (p.index > 0) {
        if (code.length === 0)
          throw new Error('Could not recreate Huffman Table');
        p = code.pop();
      }
      p.index++;
      code.push(p);
      while (code.length <= i) {
        code.push(q = {children: [], index: 0});
        p.children[p.index] = q.children;
        p = q;
      }
      k++;
    }
    if (i + 1 < length) {
      // p here points to last code
      code.push(q = {children: [], index: 0});
      p.children[p.index] = q.children;
      p = q;
    }
  }
  return code[0].children;
}