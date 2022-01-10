'use strict';
import 'reflect-metadata';
import { getCarouselAds } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CarouselAd } from 'lib/models/carouselAds.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const carouselAds: CarouselAd[] = await getCarouselAds();
    return carouselAds ? response(200, carouselAds) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
