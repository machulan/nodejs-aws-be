import { getProductsById } from '../getProductsById';

describe('handler - getProductsById', () => {
  it('should return 404 if product was not found', async () => {
    const ID = 'unknown id';
    const event = { pathParameters: { id: ID } } as any;
    const result = await getProductsById(event, null, () => null);
    const { statusCode, body } = result as any;
    const { id, message } = JSON.parse(body);

    expect(statusCode).toEqual(404);
    expect(id).toBe(ID);
    expect(message).toBe('Product not found');
  });
});
