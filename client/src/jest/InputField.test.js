import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputField from '../reactComponents/common/inputField';

describe('InputField', () => {
  test('renderar med korrekt placeholder', () => {
    render(<InputField placeholder="Skriv ditt namn" value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Skriv ditt namn');
    expect(input).toBeInTheDocument();
  });

  test('visar korrekt värde', () => {
    render(<InputField value="Alice" onChange={() => {}} />);
    const input = screen.getByDisplayValue('Alice');
    expect(input).toBeInTheDocument();
  });

  test('anropar onChange vid inmatning', () => {
    const handleChange = jest.fn();
    render(<InputField value="" onChange={handleChange} />);

    const input = screen.getByRole('textbox'); // input med type="text"
    fireEvent.change(input, { target: { value: 'Bob' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});