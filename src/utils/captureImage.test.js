import { captureImage } from './captureImage';

describe('captureImage', () => {
  let videoElement;

  beforeEach(() => {
    videoElement = {
      videoWidth: 640,
      videoHeight: 480,
      getContext: jest.fn().mockReturnValue({
        drawImage: jest.fn(),
      }),
    };
  });

  test('should throw an error if video element is not provided', () => {
    expect(() => captureImage(null)).toThrowError('Video element not found.');
  });

  test('should capture an image from the video element', () => {
    const mockCanvas = { toDataURL: jest.fn().mockReturnValue('data:image/png;base64,...') };
    document.createElement = jest.fn().mockReturnValue(mockCanvas);
    
    const result = captureImage(videoElement);

    expect(document.createElement).toHaveBeenCalledWith('canvas');
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
    expect(result).toBe('data:image/png;base64,...');
  });

  test('should set canvas width and height to video element size', () => {
    const mockCanvas = { toDataURL: jest.fn().mockReturnValue('data:image/png;base64,...') };
    document.createElement = jest.fn().mockReturnValue(mockCanvas);
    
    captureImage(videoElement);

    expect(mockCanvas.width).toBe(640);
    expect(mockCanvas.height).toBe(480);
  });

  test('should call drawImage on the canvas context', () => {
    const mockContext = { drawImage: jest.fn() };
    videoElement.getContext = jest.fn().mockReturnValue(mockContext);

    captureImage(videoElement);

    expect(mockContext.drawImage).toHaveBeenCalledWith(videoElement, 0, 0, 640, 480);
  });
});
