import { sendPhotosToAPI } from './sendPhotosToAPI';

global.fetch = jest.fn();

describe('sendPhotosToAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully send photos to API', async () => {
    const mockResponse = { success: true };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const endpoint = 'https://example.com/upload';
    const photos = [{ image: 'photo1' }, { image: 'photo2' }];

    const result = await sendPhotosToAPI(endpoint, photos);

    expect(fetch).toHaveBeenCalledWith(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos }),
    });
    expect(result).toEqual(mockResponse);
  });

  test('should throw error if response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Failed',
    });

    const endpoint = 'https://example.com/upload';
    const photos = [{ image: 'photo1' }];

    await expect(sendPhotosToAPI(endpoint, photos)).rejects.toThrow('Failed to upload photos: Failed');
  });

  test('should throw error if there is a fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const endpoint = 'https://example.com/upload';
    const photos = [{ image: 'photo1' }];

    await expect(sendPhotosToAPI(endpoint, photos)).rejects.toThrow('Network error');
  });

  test('should call console.error when there is an error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    fetch.mockRejectedValueOnce(new Error('API error'));

    const endpoint = 'https://example.com/upload';
    const photos = [{ image: 'photo1' }];

    await expect(sendPhotosToAPI(endpoint, photos)).rejects.toThrow('API error');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending photos to API:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
