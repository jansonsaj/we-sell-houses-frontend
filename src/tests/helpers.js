import {fireEvent, screen, act} from '@testing-library/react';

/**
 * Select a value in Ant Design select
 * @param {object} selectElement HTML Select element
 * @param {string} optionText Option text
 */
export async function antdSelectOption(selectElement, optionText) {
  act(() => {
    fireEvent.mouseDown(selectElement);
  });

  const optionElement = await screen.findByText(optionText);

  act(() => {
    fireEvent.click(optionElement);
  });
}
