// Import necessary functions from the testing library and the App component to be tested
import { render, screen } from '@testing-library/react';
import App from './App';

// Define a test case using Jest's 'test' function
test('renders learn react link', () => {
  // Render the App component into the virtual DOM for testing
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  // Assert that the link element is present in the document
  expect(linkElement).toBeInTheDocument();
});
