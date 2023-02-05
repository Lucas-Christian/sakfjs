export function computeHuffmanTbl(nrcodes, std_table){
  let codevalue = 0;
  let pos_in_table = 0;
  let HT = new Array();
  
  for(let k = 1; k <= 16; k++) {
    for(let j = 1; j <= nrcodes[k]; j++) {
      HT[std_table[pos_in_table]] = [];
      HT[std_table[pos_in_table]][0] = codevalue;
      HT[std_table[pos_in_table]][1] = k;
      pos_in_table++;
      codevalue++;
    }
    codevalue*=2;
  }
  return HT;
}