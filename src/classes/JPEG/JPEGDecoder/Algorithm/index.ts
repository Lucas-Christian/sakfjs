import type { JFIF, Adobe } from "../Base"
import { Base } from "../Base";
import { 
  dctCos1, dctCos3, dctCos6, 
  dctSin1, dctSin3, dctSin6, 
  dctSqrt1d2, dctSqrt2, dctZigZag
} from "../constants/DCT";
import { buildHuffmanTable } from "./functions/buildHuffmanTable";
import { clampTo8bit } from "./functions/clampTo8bit";

export class Algorithm extends Base {
  constructor() {
    super();
  }
  protected resetMaxMemoryUsage = function (maxMemoryUsageBytes_) {
    this.totalBytesAllocated = 0;
    this.maxMemoryUsageBytes = maxMemoryUsageBytes_;
  }
  protected requestMemoryAllocation(increaseAmount = 0) {
    let totalMemoryImpactBytes = this.totalBytesAllocated + increaseAmount;
    if(totalMemoryImpactBytes > this.maxMemoryUsageBytes) {
      let exceededAmount = Math.ceil((totalMemoryImpactBytes - this.maxMemoryUsageBytes) / 1024 / 1024);
      throw new Error(`maxMemoryUsageInMB limit exceeded by at least ${exceededAmount}MB`);
    }

    this.totalBytesAllocated = totalMemoryImpactBytes;
  }
  protected parse(data) {
    let maxResolutionInPixels = this.options.maxResolutionInMP * 1000 * 1000;
    let offset = 0, length = data.length;



    function readUint16() {
      let value = (data[offset] << 8) | data[offset + 1];
      offset += 2;
      return value;
    }
    function readDataBlock() {
      let length = readUint16();
      let array = data.subarray(offset, offset + length - 2);
      offset += array.length;
      return array;
    }
    const prepareComponents = (frame) => {
      // According to the JPEG standard, the sampling factor must be between 1 and 4
      // See https://github.com/libjpeg-turbo/libjpeg-turbo/blob/9abeff46d87bd201a952e276f3e4339556a403a3/libjpeg.txt#L1138-L1146
      let maxH = 1, maxV = 1;
      let component, componentId;
      for(componentId in frame.components) {
        if(frame.components.hasOwnProperty(componentId)) {
          component = frame.components[componentId];
          if(maxH < component.h) maxH = component.h;
          if(maxV < component.v) maxV = component.v;
        }
      }
      let mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
      let mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
      for(componentId in frame.components) {
        if(frame.components.hasOwnProperty(componentId)) {
          component = frame.components[componentId];
          let blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
          let blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines  / 8) * component.v / maxV);
          let blocksPerLineForMcu = mcusPerLine * component.h;
          let blocksPerColumnForMcu = mcusPerColumn * component.v;
          let blocksToAllocate = blocksPerColumnForMcu * blocksPerLineForMcu;
          let blocks: Int32Array[][] = [];

          // Each block is a Int32Array of length 64 (4 x 64 = 256 bytes)
          this.requestMemoryAllocation(blocksToAllocate * 256);

          for(let i = 0; i < blocksPerColumnForMcu; i++) {
            let row: Int32Array[] = [];
            for(let j = 0; j < blocksPerLineForMcu; j++) {
              row.push(new Int32Array(64));
            }
            blocks.push(row);
          }
          component.blocksPerLine = blocksPerLine;
          component.blocksPerColumn = blocksPerColumn;
          component.blocks = blocks;
        }
      }
      frame.maxH = maxH;
      frame.maxV = maxV;
      frame.mcusPerLine = mcusPerLine;
      frame.mcusPerColumn = mcusPerColumn;
    }
    let jfif = null as unknown as JFIF;
    let adobe = null as unknown as Adobe;
    let pixels = null;
    let frame: any, resetInterval;
    let quantizationTables: Int32Array[] = [], frames: any[] = [];
    let huffmanTablesAC = [], huffmanTablesDC = [];
    let fileMarker = readUint16();
    let malformedDataOffset = -1;
    this.comments = [];
    if(fileMarker != 0xFFD8) { // SOI (Start of Image)
      throw new Error("SOI not found");
    }

    fileMarker = readUint16();
    while(fileMarker != 0xFFD9) { // EOI (End of image)
      let i, j, l;
      switch(fileMarker) {
        case 0xFF00: break;
        case 0xFFE0: // APP0 (Application Specific)
        case 0xFFE1: // APP1
        case 0xFFE2: // APP2
        case 0xFFE3: // APP3
        case 0xFFE4: // APP4
        case 0xFFE5: // APP5
        case 0xFFE6: // APP6
        case 0xFFE7: // APP7
        case 0xFFE8: // APP8
        case 0xFFE9: // APP9
        case 0xFFEA: // APP10
        case 0xFFEB: // APP11
        case 0xFFEC: // APP12
        case 0xFFED: // APP13
        case 0xFFEE: // APP14
        case 0xFFEF: // APP15
        case 0xFFFE: // COM (Comment)
          let appData = readDataBlock();

          if(fileMarker === 0xFFFE) {
            let comment = String.fromCharCode.apply(null, appData);
            this.comments.push(comment);
          }

          if(fileMarker === 0xFFE0) {
            if(appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 &&
              appData[3] === 0x46 && appData[4] === 0) { // 'JFIF\x00'
              jfif = {
                version: { major: appData[5], minor: appData[6] },
                densityUnits: appData[7],
                xDensity: (appData[8] << 8) | appData[9],
                yDensity: (appData[10] << 8) | appData[11],
                thumbWidth: appData[12],
                thumbHeight: appData[13],
                thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
              };
            }
          }
          // TODO APP1 - Exif
          if(fileMarker === 0xFFE1) {
            if(appData[0] === 0x45 &&
              appData[1] === 0x78 &&
              appData[2] === 0x69 &&
              appData[3] === 0x66 &&
              appData[4] === 0) { // 'EXIF\x00'
              this.exifBuffer = appData.subarray(5, appData.length);
            }
          }

          if(fileMarker === 0xFFEE) {
            if(appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F &&
              appData[3] === 0x62 && appData[4] === 0x65 && appData[5] === 0) { // 'Adobe\x00'
              adobe = {
                version: appData[6],
                flags0: (appData[7] << 8) | appData[8],
                flags1: (appData[9] << 8) | appData[10],
                transformCode: appData[11]
              };
            }
          }
          break;

        case 0xFFDB: // DQT (Define Quantization Tables)
          let quantizationTablesLength = readUint16();
          let quantizationTablesEnd = quantizationTablesLength + offset - 2;
          while(offset < quantizationTablesEnd) {
            let quantizationTableSpec = data[offset++];
            this.requestMemoryAllocation(64 * 4);
            let tableData = new Int32Array(64);
            if((quantizationTableSpec >> 4) === 0) { // 8 bit values
              for(j = 0; j < 64; j++) {
                let z = dctZigZag[j];
                tableData[z] = data[offset++];
              }
            } else if((quantizationTableSpec >> 4) === 1) { //16 bit
              for(j = 0; j < 64; j++) {
                let z = dctZigZag[j];
                tableData[z] = readUint16();
              }
            } else
              throw new Error("DQT: invalid table spec");
            quantizationTables[quantizationTableSpec & 15] = tableData;
          }
          break;

        case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
        case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
        case 0xFFC2: // SOF2 (Start of Frame, Progressive DCT)
          readUint16(); // skip data length
          frame = {};
          frame.extended = (fileMarker === 0xFFC1);
          frame.progressive = (fileMarker === 0xFFC2);
          frame.precision = data[offset++];
          frame.scanLines = readUint16();
          frame.samplesPerLine = readUint16();
          frame.components = {};
          frame.componentsOrder = [];

          let pixelsInFrame = frame.scanLines * frame.samplesPerLine;
          if(pixelsInFrame > maxResolutionInPixels) {
            let exceededAmount = Math.ceil((pixelsInFrame - maxResolutionInPixels) / 1e6);
            throw new Error(`maxResolutionInMP limit exceeded by ${exceededAmount}MP`);
          }

          let componentsCount = data[offset++], componentId;
          let maxH = 0, maxV = 0;
          for(i = 0; i < componentsCount; i++) {
            componentId = data[offset];
            let h = data[offset + 1] >> 4;
            let v = data[offset + 1] & 15;
            let qId = data[offset + 2];

            if( h <= 0 || v <= 0 ) {
              throw new Error('Invalid sampling factor, expected values above 0');
            }

            frame.componentsOrder.push(componentId);
            frame.components[componentId] = {
              h: h,
              v: v,
              quantizationIdx: qId
            };
            offset += 3;
          }
          prepareComponents(frame);
          frames.push(frame);
          break;

        case 0xFFC4: // DHT (Define Huffman Tables)
          let huffmanLength = readUint16();
          for(i = 2; i < huffmanLength;) {
            let huffmanTableSpec = data[offset++];
            let codeLengths = new Uint8Array(16);
            let codeLengthSum = 0;
            for(j = 0; j < 16; j++, offset++) {
              codeLengthSum += (codeLengths[j] = data[offset]);
            }
            this.requestMemoryAllocation(16 + codeLengthSum);
            let huffmanValues = new Uint8Array(codeLengthSum);
            for(j = 0; j < codeLengthSum; j++, offset++)
              huffmanValues[j] = data[offset];
            i += 17 + codeLengthSum;

            let huffmanTableToAccess = ((huffmanTableSpec >> 4) === 0 ? huffmanTablesDC : huffmanTablesAC) as any;

            huffmanTableToAccess[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
          }
          break;

        case 0xFFDD: // DRI (Define Restart Interval)
          readUint16(); // skip data length
          resetInterval = readUint16();
          break;

        case 0xFFDC: // Number of Lines marker
          readUint16() // skip data length
          readUint16() // Ignore this data since it represents the image height
          break;
          
        case 0xFFDA: // SOS (Start of Scan)
          let scanLength = readUint16();
          let selectorsCount = data[offset++];
          let components: any[] = [], component;
          for(i = 0; i < selectorsCount; i++) {
            component = frame.components[data[offset++]];
            let tableSpec = data[offset++];
            component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
            component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
            components.push(component);
          }
          let spectralStart = data[offset++];
          let spectralEnd = data[offset++];
          let successiveApproximation = data[offset++];
          let processed = this.decodeScan(data, offset,
            frame, components, resetInterval,
            spectralStart, spectralEnd,
            successiveApproximation >> 4, successiveApproximation & 15, this.options);
          offset += processed;
          break;

        case 0xFFFF: // Fill bytes
          if(data[offset] !== 0xFF) { // Avoid skipping a valid marker.
            offset--;
          }
          break;
        default:
          if(data[offset - 3] == 0xFF &&
              data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) {
            // could be incorrect encoding -- last 0xFF byte of the previous
            // block was eaten by the encoder
            offset -= 3;
            break;
          }
          else if(fileMarker === 0xE0 || fileMarker == 0xE1) {
            // Recover from malformed APP1 markers popular in some phone models.
            // See https://github.com/eugeneware/jpeg-js/issues/82
            if(malformedDataOffset !== -1) {
              throw new Error(`first unknown JPEG marker at offset ${malformedDataOffset.toString(16)}, second unknown JPEG marker ${fileMarker.toString(16)} at offset ${(offset - 1).toString(16)}`);
            }
            malformedDataOffset = offset - 1;
            const nextOffset = readUint16();
            if(data[offset + nextOffset - 2] === 0xFF) {
              offset += nextOffset - 2;
              break;
            }
          }
          throw new Error("unknown JPEG marker " + fileMarker.toString(16));
      }
      fileMarker = readUint16();
    }
    if(frames.length != 1)
      throw new Error("only single frame JPEGs supported");

    // set each frame's components quantization table
    for(let i = 0; i < frames.length; i++) {
      let cp = frames[i].components;
      for(let j in cp) {
        cp[j].quantizationTable = quantizationTables[cp[j].quantizationIdx];
        delete cp[j].quantizationIdx;
      }
    }

    this.width = frame.samplesPerLine;
    this.height = frame.scanLines;
    this.jfif = jfif;
    this.adobe = adobe;
    this.components = [];
    for(let i = 0; i < frame.componentsOrder.length; i++) {
      let component = frame.components[frame.componentsOrder[i]];
      this.components.push({
        lines: this.buildComponentData(component),
        scaleX: component.h / frame.maxH,
        scaleY: component.v / frame.maxV
      });
    }
  }
  protected copyToImageData(imageData, formatAsRGBA) {
    let width = imageData.width, height = imageData.height;
    let imageDataArray = imageData.data;
    let data = this.getData(width, height);
    let i = 0, j = 0, x, y;
    let Y, K, C, M, R, G, B;
    switch (this.components.length) {
      case 1:
        for(y = 0; y < height; y++) {
          for(x = 0; x < width; x++) {
            Y = data[i++];

            imageDataArray[j++] = Y;
            imageDataArray[j++] = Y;
            imageDataArray[j++] = Y;
            if(formatAsRGBA) {
              imageDataArray[j++] = 255;
            }
          }
        }
        break;
      case 3:
        for(y = 0; y < height; y++) {
          for(x = 0; x < width; x++) {
            R = data[i++];
            G = data[i++];
            B = data[i++];

            imageDataArray[j++] = R;
            imageDataArray[j++] = G;
            imageDataArray[j++] = B;
            if(formatAsRGBA) {
              imageDataArray[j++] = 255;
            }
          }
        }
        break;
      case 4:
        for(y = 0; y < height; y++) {
          for(x = 0; x < width; x++) {
            C = data[i++];
            M = data[i++];
            Y = data[i++];
            K = data[i++];

            R = 255 - clampTo8bit(C * (1 - K / 255) + K);
            G = 255 - clampTo8bit(M * (1 - K / 255) + K);
            B = 255 - clampTo8bit(Y * (1 - K / 255) + K);

            imageDataArray[j++] = R;
            imageDataArray[j++] = G;
            imageDataArray[j++] = B;
            if(formatAsRGBA) {
              imageDataArray[j++] = 255;
            }
          }
        }
        break;
      default:
        throw new Error('Unsupported color mode');
    }
  }
  private decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive, opts) {
    let mcusPerLine = frame.mcusPerLine;
    let progressive = frame.progressive;

    let startOffset = offset, bitsData = 0, bitsCount = 0;
    function readBit() {
      if(bitsCount > 0) {
        bitsCount--;
        return (bitsData >> bitsCount) & 1;
      }
      bitsData = data[offset++];
      if(bitsData == 0xFF) {
        let nextByte = data[offset++];
        if(nextByte) {
          throw new Error("unexpected marker: " + ((bitsData << 8) | nextByte).toString(16));
        }
        // unstuff 0
      }
      bitsCount = 7;
      return bitsData >>> 7;
    }
    function decodeHuffman(tree) {
      let node = tree, bit;
      while((bit = readBit()) !== null) {
        node = node[bit];
        if(typeof node === 'number')
          return node;
        if(typeof node !== 'object')
          throw new Error("invalid huffman sequence");
      }
      return null;
    }
    function receive(length) {
      let n = 0;
      while(length > 0) {
        let bit = readBit();
        if(bit === null) return;
        n = (n << 1) | bit;
        length--;
      }
      return n;
    }
    function receiveAndExtend(length) {
      let n = receive(length)!;
      if(n >= 1 << (length - 1))
        return n;
      return n + (-1 << length) + 1;
    }
    function decodeBaseline(component, zz) {
      let t = decodeHuffman(component.huffmanTableDC);
      let diff = t === 0 ? 0 : receiveAndExtend(t);
      zz[0]= (component.pred += diff);
      let k = 1;
      while(k < 64) {
        let rs = decodeHuffman(component.huffmanTableAC)!;
        let s = rs & 15, r = rs >> 4;
        if(s === 0) {
          if(r < 15)
            break;
          k += 16;
          continue;
        }
        k += r;
        let z = dctZigZag[k];
        zz[z] = receiveAndExtend(s);
        k++;
      }
    }
    function decodeDCFirst(component, zz) {
      let t = decodeHuffman(component.huffmanTableDC);
      let diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
      zz[0] = (component.pred += diff);
    }
    function decodeDCSuccessive(component, zz) {
      zz[0] |= readBit() << successive;
    }
    let eobrun = 0;
    function decodeACFirst(component, zz) {
      if(eobrun > 0) {
        eobrun--;
        return;
      }
      let k = spectralStart, e = spectralEnd;
      while(k <= e) {
        let rs = decodeHuffman(component.huffmanTableAC)!;
        let s = rs & 15, r = rs >> 4;
        if(s === 0) {
          if(r < 15) {
            eobrun = receive(r)! + (1 << r) - 1;
            break;
          }
          k += 16;
          continue;
        }
        k += r;
        let z = dctZigZag[k];
        zz[z] = receiveAndExtend(s) * (1 << successive);
        k++;
      }
    }
    let successiveACState = 0, successiveACNextValue;
    function decodeACSuccessive(component, zz) {
      let k = spectralStart, e = spectralEnd, r = 0;
      while(k <= e) {
        let z = dctZigZag[k];
        let direction = zz[z] < 0 ? -1 : 1;
        switch (successiveACState) {
        case 0: // initial state
          let rs = decodeHuffman(component.huffmanTableAC)!;
          let s = rs & 15, r = rs >> 4;
          if(s === 0) {
            if(r < 15) {
              eobrun = receive(r)! + (1 << r);
              successiveACState = 4;
            } else {
              r = 16;
              successiveACState = 1;
            }
          } else {
            if(s !== 1)
              throw new Error("invalid ACn encoding");
            successiveACNextValue = receiveAndExtend(s);
            successiveACState = r ? 2 : 3;
          }
          continue;
        case 1: // skipping r zero items
        case 2:
          if(zz[z])
            zz[z] += (readBit() << successive) * direction;
          else {
            r!--;
            if(r! === 0)
              successiveACState = successiveACState == 2 ? 3 : 0;
          }
          break;
        case 3: // set value for a zero item
          if(zz[z])
            zz[z] += (readBit() << successive) * direction;
          else {
            zz[z] = successiveACNextValue << successive;
            successiveACState = 0;
          }
          break;
        case 4: // eob
          if(zz[z])
            zz[z] += (readBit() << successive) * direction;
          break;
        }
        k++;
      }
      if(successiveACState === 4) {
        eobrun--;
        if(eobrun === 0)
          successiveACState = 0;
      }
    }
    function decodeMcu(component, decode, mcu, row, col) {
      let mcuRow = (mcu / mcusPerLine) | 0;
      let mcuCol = mcu % mcusPerLine;
      let blockRow = mcuRow * component.v + row;
      let blockCol = mcuCol * component.h + col;
      // If the block is missing and we're in tolerant mode, just skip it.
      if(component.blocks[blockRow] === undefined && opts.tolerantDecoding)
        return;
      decode(component, component.blocks[blockRow][blockCol]);
    }
    function decodeBlock(component, decode, mcu) {
      let blockRow = (mcu / component.blocksPerLine) | 0;
      let blockCol = mcu % component.blocksPerLine;
      // If the block is missing and we're in tolerant mode, just skip it.
      if(component.blocks[blockRow] === undefined && opts.tolerantDecoding)
        return;
      decode(component, component.blocks[blockRow][blockCol]);
    }

    let componentsLength = components.length;
    let component, i, j, k, n;
    let decodeFn;
    if(progressive) {
      if(spectralStart === 0)
        decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
      else
        decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
    } else {
      decodeFn = decodeBaseline;
    }

    let mcu = 0, marker;
    let mcuExpected;
    if(componentsLength == 1) {
      mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
    } else {
      mcuExpected = mcusPerLine * frame.mcusPerColumn;
    }
    if(!resetInterval) resetInterval = mcuExpected;

    let h, v;
    while(mcu < mcuExpected) {
      // reset interval stuff
      for(i = 0; i < componentsLength; i++)
        components[i].pred = 0;
      eobrun = 0;

      if(componentsLength == 1) {
        component = components[0];
        for(n = 0; n < resetInterval; n++) {
          decodeBlock(component, decodeFn, mcu);
          mcu++;
        }
      } else {
        for(n = 0; n < resetInterval; n++) {
          for(i = 0; i < componentsLength; i++) {
            component = components[i];
            h = component.h;
            v = component.v;
            for(j = 0; j < v; j++) {
              for(k = 0; k < h; k++) {
                decodeMcu(component, decodeFn, mcu, j, k);
              }
            }
          }
          mcu++;

          // If we've reached our expected MCU's, stop decoding
          if(mcu === mcuExpected) break;
        }
      }

      if(mcu === mcuExpected) {
        // Skip trailing bytes at the end of the scan - until we reach the next marker
        do {
          if(data[offset] === 0xFF) {
            if(data[offset + 1] !== 0x00) {
              break;
            }
          }
          offset += 1;
        } while(offset < data.length - 2);
      }

      // find marker
      bitsCount = 0;
      marker = (data[offset] << 8) | data[offset + 1];
      if(marker < 0xFF00) {
        throw new Error("marker was not found");
      }

      if(marker >= 0xFFD0 && marker <= 0xFFD7) { // RSTx
        offset += 2;
      }
      else
        break;
    }

    return offset - startOffset;
  }
  private getData(width, height) {
    let scaleX = this.width / width, scaleY = this.height / height;

    let component1, component2, component3, component4;
    let component1Line, component2Line, component3Line, component4Line;
    let x, y;
    let offset = 0;
    let Y, Cb, Cr, K, C, M, Ye, R, G, B;
    let colorTransform;
    let dataLength = width * height * this.components.length;
    this.requestMemoryAllocation(dataLength);
    let data = new Uint8Array(dataLength);
    switch (this.components.length) {
      case 1:
        component1 = this.components[0];
        for(y = 0; y < height; y++) {
          component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
          for(x = 0; x < width; x++) {
            Y = component1Line[0 | (x * component1.scaleX * scaleX)];

            data[offset++] = Y;
          }
        }
        break;
      case 2:
        // PDF might compress two component data in custom colorspace
        component1 = this.components[0];
        component2 = this.components[1];
        for(y = 0; y < height; y++) {
          component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
          component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
          for(x = 0; x < width; x++) {
            Y = component1Line[0 | (x * component1.scaleX * scaleX)];
            data[offset++] = Y;
            Y = component2Line[0 | (x * component2.scaleX * scaleX)];
            data[offset++] = Y;
          }
        }
        break;
      case 3:
        // The default transform for three components is true
        colorTransform = true;
        // The adobe transform marker overrides any previous setting
        if(this.adobe && this.adobe.transformCode)
          colorTransform = true;
        else if(typeof this.options.colorTransform !== 'undefined')
          colorTransform = !!this.options.colorTransform;

        component1 = this.components[0];
        component2 = this.components[1];
        component3 = this.components[2];
        for(y = 0; y < height; y++) {
          component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
          component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
          component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
          for(x = 0; x < width; x++) {
            if(!colorTransform) {
              R = component1Line[0 | (x * component1.scaleX * scaleX)];
              G = component2Line[0 | (x * component2.scaleX * scaleX)];
              B = component3Line[0 | (x * component3.scaleX * scaleX)];
            } else {
              Y = component1Line[0 | (x * component1.scaleX * scaleX)];
              Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
              Cr = component3Line[0 | (x * component3.scaleX * scaleX)];

              R = clampTo8bit(Y + 1.402 * (Cr - 128));
              G = clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
              B = clampTo8bit(Y + 1.772 * (Cb - 128));
            }

            data[offset++] = R;
            data[offset++] = G;
            data[offset++] = B;
          }
        }
        break;
      case 4:
        if(!this.adobe)
          throw new Error('Unsupported color mode (4 components)');
        // The default transform for four components is false
        colorTransform = false;
        // The adobe transform marker overrides any previous setting
        if(this.adobe && this.adobe.transformCode)
          colorTransform = true;
        else if(typeof this.options.colorTransform !== 'undefined')
          colorTransform = !!this.options.colorTransform;

        component1 = this.components[0];
        component2 = this.components[1];
        component3 = this.components[2];
        component4 = this.components[3];
        for(y = 0; y < height; y++) {
          component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
          component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
          component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
          component4Line = component4.lines[0 | (y * component4.scaleY * scaleY)];
          for(x = 0; x < width; x++) {
            if(!colorTransform) {
              C = component1Line[0 | (x * component1.scaleX * scaleX)];
              M = component2Line[0 | (x * component2.scaleX * scaleX)];
              Ye = component3Line[0 | (x * component3.scaleX * scaleX)];
              K = component4Line[0 | (x * component4.scaleX * scaleX)];
            } else {
              Y = component1Line[0 | (x * component1.scaleX * scaleX)];
              Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
              Cr = component3Line[0 | (x * component3.scaleX * scaleX)];
              K = component4Line[0 | (x * component4.scaleX * scaleX)];

              C = 255 - clampTo8bit(Y + 1.402 * (Cr - 128));
              M = 255 - clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
              Ye = 255 - clampTo8bit(Y + 1.772 * (Cb - 128));
            }
            data[offset++] = 255-C;
            data[offset++] = 255-M;
            data[offset++] = 255-Ye;
            data[offset++] = 255-K;
          }
        }
        break;
      default:
        throw new Error('Unsupported color mode');
    }
    return data;
  }
  private buildComponentData(component) {
    let lines: Uint8Array[] = [];
    let blocksPerLine = component.blocksPerLine;
    let blocksPerColumn = component.blocksPerColumn;
    let samplesPerLine = blocksPerLine << 3;
    // Only 1 used per invocation of this function and garbage collected after invocation, so no need to account for its memory footprint.
    let R = new Int32Array(64), r = new Uint8Array(64);
  
    // A port of poppler's IDCT method which in turn is taken from:
    //   Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
    //   "Practical Fast 1-D DCT Algorithms with 11 Multiplications",
    //   IEEE Intl. Conf. on Acoustics, Speech & Signal Processing, 1989,
    //   988-991.
    function quantizeAndInverse(zz, dataOut, dataIn) {
      let qt = component.quantizationTable;
      let v0, v1, v2, v3, v4, v5, v6, v7, t;
      let p = dataIn;
      let i;
  
      // dequant
      for(i = 0; i < 64; i++)
        p[i] = zz[i] * qt[i];
  
      // inverse DCT on rows
      for(i = 0; i < 8; ++i) {
        let row = 8 * i;
  
        // check for all-zero AC coefficients
        if(p[1 + row] == 0 && p[2 + row] == 0 && p[3 + row] == 0 &&
            p[4 + row] == 0 && p[5 + row] == 0 && p[6 + row] == 0 &&
            p[7 + row] == 0) {
          t = (dctSqrt2 * p[0 + row] + 512) >> 10;
          p[0 + row] = t;
          p[1 + row] = t;
          p[2 + row] = t;
          p[3 + row] = t;
          p[4 + row] = t;
          p[5 + row] = t;
          p[6 + row] = t;
          p[7 + row] = t;
          continue;
        }
  
        // stage 4
        v0 = (dctSqrt2 * p[0 + row] + 128) >> 8;
        v1 = (dctSqrt2 * p[4 + row] + 128) >> 8;
        v2 = p[2 + row];
        v3 = p[6 + row];
        v4 = (dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128) >> 8;
        v7 = (dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128) >> 8;
        v5 = p[3 + row] << 4;
        v6 = p[5 + row] << 4;
  
        // stage 3
        t = (v0 - v1+ 1) >> 1;
        v0 = (v0 + v1 + 1) >> 1;
        v1 = t;
        t = (v2 * dctSin6 + v3 * dctCos6 + 128) >> 8;
        v2 = (v2 * dctCos6 - v3 * dctSin6 + 128) >> 8;
        v3 = t;
        t = (v4 - v6 + 1) >> 1;
        v4 = (v4 + v6 + 1) >> 1;
        v6 = t;
        t = (v7 + v5 + 1) >> 1;
        v5 = (v7 - v5 + 1) >> 1;
        v7 = t;
  
        // stage 2
        t = (v0 - v3 + 1) >> 1;
        v0 = (v0 + v3 + 1) >> 1;
        v3 = t;
        t = (v1 - v2 + 1) >> 1;
        v1 = (v1 + v2 + 1) >> 1;
        v2 = t;
        t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
        v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
        v7 = t;
        t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
        v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
        v6 = t;
  
        // stage 1
        p[0 + row] = v0 + v7;
        p[7 + row] = v0 - v7;
        p[1 + row] = v1 + v6;
        p[6 + row] = v1 - v6;
        p[2 + row] = v2 + v5;
        p[5 + row] = v2 - v5;
        p[3 + row] = v3 + v4;
        p[4 + row] = v3 - v4;
      }
  
      // inverse DCT on columns
      for(i = 0; i < 8; ++i) {
        let col = i;
  
        // check for all-zero AC coefficients
        if(p[1*8 + col] == 0 && p[2*8 + col] == 0 && p[3*8 + col] == 0 &&
            p[4*8 + col] == 0 && p[5*8 + col] == 0 && p[6*8 + col] == 0 &&
            p[7*8 + col] == 0) {
          t = (dctSqrt2 * dataIn[i+0] + 8192) >> 14;
          p[0*8 + col] = t;
          p[1*8 + col] = t;
          p[2*8 + col] = t;
          p[3*8 + col] = t;
          p[4*8 + col] = t;
          p[5*8 + col] = t;
          p[6*8 + col] = t;
          p[7*8 + col] = t;
          continue;
        }
  
        // stage 4
        v0 = (dctSqrt2 * p[0*8 + col] + 2048) >> 12;
        v1 = (dctSqrt2 * p[4*8 + col] + 2048) >> 12;
        v2 = p[2*8 + col];
        v3 = p[6*8 + col];
        v4 = (dctSqrt1d2 * (p[1*8 + col] - p[7*8 + col]) + 2048) >> 12;
        v7 = (dctSqrt1d2 * (p[1*8 + col] + p[7*8 + col]) + 2048) >> 12;
        v5 = p[3*8 + col];
        v6 = p[5*8 + col];
  
        // stage 3
        t = (v0 - v1 + 1) >> 1;
        v0 = (v0 + v1 + 1) >> 1;
        v1 = t;
        t = (v2 * dctSin6 + v3 * dctCos6 + 2048) >> 12;
        v2 = (v2 * dctCos6 - v3 * dctSin6 + 2048) >> 12;
        v3 = t;
        t = (v4 - v6 + 1) >> 1;
        v4 = (v4 + v6 + 1) >> 1;
        v6 = t;
        t = (v7 + v5 + 1) >> 1;
        v5 = (v7 - v5 + 1) >> 1;
        v7 = t;
  
        // stage 2
        t = (v0 - v3 + 1) >> 1;
        v0 = (v0 + v3 + 1) >> 1;
        v3 = t;
        t = (v1 - v2 + 1) >> 1;
        v1 = (v1 + v2 + 1) >> 1;
        v2 = t;
        t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
        v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
        v7 = t;
        t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
        v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
        v6 = t;
  
        // stage 1
        p[0*8 + col] = v0 + v7;
        p[7*8 + col] = v0 - v7;
        p[1*8 + col] = v1 + v6;
        p[6*8 + col] = v1 - v6;
        p[2*8 + col] = v2 + v5;
        p[5*8 + col] = v2 - v5;
        p[3*8 + col] = v3 + v4;
        p[4*8 + col] = v3 - v4;
      }
  
      // convert to 8-bit integers
      for(i = 0; i < 64; ++i) {
        let sample = 128 + ((p[i] + 8) >> 4);
        dataOut[i] = sample < 0 ? 0 : sample > 0xFF ? 0xFF : sample;
      }
    }
  
    this.requestMemoryAllocation(samplesPerLine * blocksPerColumn * 8);
  
    let i, j;
    for(let blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
      let scanLine = blockRow << 3;
      for(i = 0; i < 8; i++)
        lines.push(new Uint8Array(samplesPerLine));
      for(let blockCol = 0; blockCol < blocksPerLine; blockCol++) {
        quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);
  
        let offset = 0, sample = blockCol << 3;
        for(j = 0; j < 8; j++) {
          let line = lines[scanLine + j];
          for(i = 0; i < 8; i++)
            line[sample + i] = r[offset++];
        }
      }
    }
    return lines;
  }
}