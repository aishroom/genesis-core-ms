/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, Injectable } from '@nestjs/common';
import { IElementService } from './IElementService';

@Injectable()
export class ElementMockService implements IElementService {
  findAll(nameArchitec: string) {
    try {
      if (nameArchitec == 'arquitectura de referencia') {
        const services = [
          {
            name: 'S3 Bucket',
            Price: 0.023,
          },
          {
            name: 'CloudFront',
            Price: 0.085,
          },
        ];
        return services;
      }
    } catch (error) {
      const eMsg = `'Consumer fail to aws all service' Message: ${error.message}`;
      throw new HttpException(
        {
          Code: error.response.status,
          Description: eMsg,
        },
        error.response.status,
      );
    }
  }

  async searchPrice() {
    console.log('entro');
    const axios = require('axios');
    const config = {
      method: 'get',
      url: 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.json',
      headers: {},
    };
    await axios(config)
      .then(function (response: any) {
        const sku = '3KX9BJ9VKJDHBGCJ';
        const consult = 'response.data.products.';
        console.log(
          response.data.terms.OnDemand.X4CPFE6UJDYSFQJS.priceDimensions,
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} price`;
  }
}
