import { Injectable } from '@nestjs/common';
import * as hclParser from 'js-hcl-parser';

@Injectable()
export class HclService {
  isHcl(cadena: string): boolean {
    const patronHCL = /\${.*}/;
    return patronHCL.test(cadena);
  }

  hclToJSon(hcl: string): any {
    const parsed = hclParser.parse(hcl);
    return parsed;
  }

  jsonToHcl(jsonObject: any): string {
    const hcl = hclParser.stringify(JSON.stringify(jsonObject));
    return hcl;
  }
}
