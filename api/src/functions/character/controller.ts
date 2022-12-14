import {CharacterService} from './service';
import {middyfy} from '@libs/lambda';
import {formatErrorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';

export const getCharacter = middyfy(async ({body}): Promise<ValidatedEventAPIGatewayProxyEvent<any>> => {
  const service = CharacterService;
  let response;
  const {region, realm, name, locale} = body;
  await service.get(region, realm, name, locale)
    .then((character) => response = formatJSONResponse(character as any))
    .catch(err => response = formatErrorResponse(err.code, err.message, err));

  return response;
});