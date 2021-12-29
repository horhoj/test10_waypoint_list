import { FC, useState, KeyboardEvent } from 'react';
import { WaypointsData } from '../../types';
import styles from './WaypointList.module.scss';

interface WaypointListProps {
  waypointsData: WaypointsData;
  setWaypointsData(waypointsData: WaypointsData): void;
  waypointIdList: number[];
  setWaypointIdList(waypointIdList: number[]): void;
}

export const WaypointList: FC<WaypointListProps> = ({
  waypointIdList,
  setWaypointIdList,
  setWaypointsData,
  waypointsData,
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const newWaypointTitle = inputValue.trim();
    //прерываем если нажат не клавиша Enter или введено пустое, или состоящее из пробелов значение
    if (e.key !== 'Enter' || !newWaypointTitle) {
      return;
    }
    const currentMaxId = Math.max(...waypointIdList);
    let newId = 1;
    // так как Math.max может возвращать странные значения типа -Infinity и NaN,
    //то соответственно делаем проверку на эти значения
    if (!Number.isNaN(currentMaxId) && !(currentMaxId === -Infinity)) {
      newId = currentMaxId + 1;
    }
    const newWaypointsData: WaypointsData = {
      ...waypointsData,
      [newId]: { title: newWaypointTitle },
    };
    setWaypointsData(newWaypointsData);
    setWaypointIdList([...waypointIdList, newId]);
    setInputValue('');
  };

  const handleDeleteItem = (id: number) => {
    const newWaypointIdList = waypointIdList.filter(
      (waypointId) => waypointId !== id,
    );
    setWaypointIdList(newWaypointIdList);
    const newWaypointsData = { ...waypointsData };
    delete newWaypointsData[id];
    setWaypointsData(newWaypointsData);
  };

  return (
    <div className={styles.wrap}>
      <div>
        <input
          type="text"
          className={styles.input}
          placeholder={'введите новую точку'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </div>
      <ul className={styles.waypointList}>
        {waypointIdList.map((waypointId) => (
          <li key={waypointId} className={styles.waypointItem}>
            {waypointsData[waypointId].title}
            <button
              type={'button'}
              className={styles.deleteItemButton}
              onClick={() => handleDeleteItem(waypointId)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
