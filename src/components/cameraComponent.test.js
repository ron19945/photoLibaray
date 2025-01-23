import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CameraComponent from './cameraComponent'; 

global.navigator.mediaDevices.getUserMedia = jest.fn();

test('renders CameraComponent without crashing', () => {
  render(<CameraComponent />);
  const cameraElement = screen.getByText(/Camera is ready/i);
  expect(cameraElement).toBeInTheDocument();
});


test('clicking capture button triggers camera capture', () => {
  render(<CameraComponent />);
  const captureButton = screen.getByRole('button', { name: /Capture/i });
  fireEvent.click(captureButton);
  const captureMessage = screen.getByText(/Capture complete/i);
  expect(captureMessage).toBeInTheDocument();
});

test('updates state when a picture is captured', async () => {
  render(<CameraComponent />);
  const captureButton = screen.getByRole('button', { name: /Capture/i });
  fireEvent.click(captureButton);
  await waitFor(() => expect(screen.getByText(/Captured photo/i)).toBeInTheDocument());
});

test('displays error message if camera is not accessible', async () => {
  global.navigator.mediaDevices.getUserMedia.mockRejectedValue(new Error('Camera not accessible'));
  render(<CameraComponent />);
  const errorMessage = await screen.findByText(/Camera not accessible/i);
  expect(errorMessage).toBeInTheDocument();
});

test('increments photo count after multiple captures', () => {
  render(<CameraComponent />);
  const captureButton = screen.getByRole('button', { name: /Capture/i });
  
  fireEvent.click(captureButton);
  fireEvent.click(captureButton);

  const photoCount = screen.getByText(/Photos taken: 2/i);
  expect(photoCount).toBeInTheDocument();
});

test('resets photos array when reset is clicked', () => {
  render(<CameraComponent />);
  const captureButton = screen.getByRole('button', { name: /Capture/i });
  const resetButton = screen.getByRole('button', { name: /Reset/i });
  
  fireEvent.click(captureButton);
  fireEvent.click(resetButton);
  
  const photoCount = screen.getByText(/Photos taken: 0/i);
  expect(photoCount).toBeInTheDocument();
});
