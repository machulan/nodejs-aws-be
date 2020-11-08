import { Book } from '../../models';
import { getProductsList } from '../getProductsList';

describe('handler - getProductsList', () => {
  it('should get products', async () => {
    const result = await getProductsList(null, null, () => null);
    const { statusCode, body } = result as any;
    const products: Book[] = JSON.parse(body);

    expect(statusCode).toEqual(200);
    expect(products.length).toBeGreaterThan(0);
  });
});
