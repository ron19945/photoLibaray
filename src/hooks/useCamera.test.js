import { renderHook, act } from '@testing-library/react-hooks';
import { useCamera } from './useCamera';

jest.mock('navigator.mediaDevices.getUserMedia', () => ({
  getUserMedia: jest.fn().mockResolvedValue({
    getTracks: jest.fn().mockReturnValue([{ stop: jest.fn() }]),
  }),
}));

describe('useCamera Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useCamera());

    expect(result.current.pictures).toEqual([]);
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.steps).toEqual(['front', 'back', 'side1', 'side2']);
  });

  test('should start the camera successfully', async () => {
    const { result } = renderHook(() => useCamera());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.stream).not.toBeNull();
    expect(result.current.videoRef.current.srcObject).toEqual(result.current.stream);
  });

  test('should handle camera access error', async () => {
    navigator.mediaDevices.getUserMedia.mockRejectedValueOnce(new Error('Camera access denied'));

    const { result } = renderHook(() => useCamera());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.stream).toBeNull();
  });

  test('should stop the camera successfully', async () => {
    const { result } = renderHook(() => useCamera());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.stream).not.toBeNull();

    act(() => {
      result.current.stopCamera();
    });

    expect(result.current.stream).toBeNull();
  });

  test('should take a picture and increment the step', async () => {
    const { result } = renderHook(() => useCamera());

    const imageData = 'imageData';
    act(() => {
      result.current.takePicture(imageData);
    });

    expect(result.current.pictures).toEqual([
      { step: 'front', image: imageData },
    ]);
    expect(result.current.currentStep).toBe(1);
  });

  test('should reset pictures and currentStep', async () => {
    const { result } = renderHook(() => useCamera());

    const imageData = 'imageData';
    act(() => {
      result.current.takePicture(imageData);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.pictures).toEqual([]);
    expect(result.current.currentStep).toBe(0);
  });

  test('should indicate completion when all steps are taken', async () => {
    const { result } = renderHook(() => useCamera());

    const imageData = 'imageData';

    for (let i = 0; i < result.current.steps.length; i++) {
      act(() => {
        result.current.takePicture(imageData);
      });
    }

    expect(result.current.isComplete).toBe(true);
  });

  test('should handle reset even after completing all steps', async () => {
    const { result } = renderHook(() => useCamera());

    const imageData = 'imageData';
    for (let i = 0; i < result.current.steps.length; i++) {
      act(() => {
        result.current.takePicture(imageData);
      });
    }

    expect(result.current.isComplete).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.pictures).toEqual([]);
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isComplete).toBe(false);
  });
});
