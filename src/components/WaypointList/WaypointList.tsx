import { FC, useState, KeyboardEvent } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
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

  const handleDragEnd = ({ destination, source }: DropResult) => {
    const destinationIndex = destination?.index;
    if (!(typeof destinationIndex === 'number')) {
      return;
    }
    const newWaypointIdList: number[] = [...waypointIdList];
    const moved = newWaypointIdList.splice(source.index, 1);
    newWaypointIdList.splice(destinationIndex, 0, ...moved);
    setWaypointIdList(newWaypointIdList);
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          type="statusLane"
          droppableId={'waypoint-list-droppable'}
          direction="vertical"
        >
          {(columnDroppableProvided) => (
            <ul
              className={styles.waypointList}
              {...columnDroppableProvided.droppableProps}
              ref={columnDroppableProvided.innerRef}
            >
              {waypointIdList.map((waypointId, index) => (
                <Draggable
                  key={waypointId}
                  draggableId={waypointId.toString()}
                  index={index}
                >
                  {(columnDraggableProvided) => (
                    <li
                      key={waypointId}
                      className={styles.waypointItem}
                      ref={columnDraggableProvided.innerRef}
                      {...columnDraggableProvided.dragHandleProps}
                      {...columnDraggableProvided.draggableProps}
                    >
                      {waypointsData[waypointId].title}
                      <button
                        type={'button'}
                        className={styles.deleteItemButton}
                        onClick={() => handleDeleteItem(waypointId)}
                      >
                        X
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {columnDroppableProvided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
