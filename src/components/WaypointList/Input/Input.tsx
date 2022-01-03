import { FC, KeyboardEvent, useState } from 'react';

interface InputProps {
  onEnterNewValue(value: string): void;
  autoFocus?: boolean;
  defaultValue?: string;
  onCancel?(): void;
  className?: string;
  dataTestId?: string;
}
interface DynamicProps {
  ['data-testid']?: string;
}

export const Input: FC<InputProps> = ({
  onEnterNewValue,
  autoFocus = false,
  defaultValue = '',
  onCancel = null,
  className = '',
  dataTestId = '',
}) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue);

  //добавляем пропсы которые должны существовать только при некоторых условиях
  const conditionalProps: DynamicProps = {};
  if (dataTestId) {
    conditionalProps['data-testid'] = dataTestId;
  }

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
      className={className}
      placeholder={'введите новую точку'}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleInputKeyDown}
      autoFocus={autoFocus}
      onBlur={() => {
        onCancel && onCancel();
      }}
      {...conditionalProps}
    />
  );
};
