import { FC, KeyboardEvent, useState } from 'react';
import styles from './Input.module.scss';

interface InputProps {
  onEnterNewValue(value: string): void;
  autoFocus?: boolean;
  defaultValue?: string;
  onCancel?(): void;
}

export const Input: FC<InputProps> = ({
  onEnterNewValue,
  autoFocus = false,
  defaultValue = '',
  onCancel = null,
}) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const newWaypointTitle = inputValue.trim();
    //прерываем если нажат не клавиша Enter или введено пустое, или состоящее из пробелов значение
    if (e.key !== 'Enter' || !newWaypointTitle) {
      return;
    }
    onEnterNewValue(inputValue);
    setInputValue('');
  };

  return (
    <input
      type="text"
      className={styles.input}
      placeholder={'введите новую точку'}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleInputKeyDown}
      autoFocus={autoFocus}
      onBlur={() => {
        onCancel && onCancel();
      }}
    />
  );
};
