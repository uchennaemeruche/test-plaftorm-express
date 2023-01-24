import { LocalNodeCache } from "./node.cache";

describe('CacheService', () => {
    let cacheMock: any;
    let service: LocalNodeCache;

    beforeEach(() => {
        cacheMock = {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
        };

        service = new LocalNodeCache();
        //@ts-ignore
        service.client = cacheMock;
    });

    const key = 'test_key',
        value = 'test_value',
        ttl = '60'

    it('should set a value with expiration', async () => {
        await service.setWithExpiration(key, value, ttl);
        expect(cacheMock.set).toHaveBeenCalledWith(key, value, ttl);
    });

    it('should set a value without expiration', async () => {
        await service.setWithExpiration(key, value);
        expect(cacheMock.set).toHaveBeenCalledWith(key, value);
    });

    it('should get a value from cache', async () => {
        cacheMock.get.mockResolvedValue(value);
        const result = await service.getValue(key);
        expect(result).toEqual(value);
        expect(cacheMock.get).toHaveBeenCalledWith(key);
    });

    it('should delete a value from cache', async() => {
        service.deleteValue(key);
        expect(cacheMock.del).toHaveBeenCalledWith(key);
       
        const result = await service.getValue(key);
        expect(result).toBe(undefined);
    });

    it('should return success and no error when value is not in cache and is added to cache', async () => {
        cacheMock.get.mockResolvedValue(null);
        cacheMock.set.mockResolvedValue(true);

        const result = await service.checkForMissAndCache(key, value);

        expect(result).toEqual({
            success: true,
        });
        expect(cacheMock.get).toHaveBeenCalledWith(key);
        expect(cacheMock.set).toHaveBeenCalledWith(key, value, '60');
    });

    it('should return Duplicate Error when value is already in cache', async () => {
        cacheMock.get.mockResolvedValue('saved_hash');
        const result = await service.checkForMissAndCache(key, value);

        expect(result).toEqual({
            success: false,
            error: { type: 'DuplicateErr', context: 'Transaction Cache' },
        });
        expect(cacheMock.get).toHaveBeenCalledWith(key);
        expect(cacheMock.set).not.toHaveBeenCalled();
    });

    it('should return error when set method fails', async () => {
        cacheMock.get.mockResolvedValue(null);
        cacheMock.set.mockResolvedValue(false);

        const result = await service.checkForMissAndCache(key, value);

        expect(result).toEqual({
            success: false,
            error: { type: 'OtherErrs', context: 'Transaction Cache', error: new Error('Something went wrong') },
        });
        expect(cacheMock.get).toHaveBeenCalledWith(key);
        expect(cacheMock.set).toHaveBeenCalledWith(key, value, '60');
    });
});    
