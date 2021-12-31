import { FC, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { WaypointsData } from '../../types';
import styles from './WaypointList.module.scss';
import { Input } from './Input';

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
  const [editItemId, setEditItemId] = useState<number | null>(null);

  const handleAddItem = (newWaypointTitle: string) => {
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
  };

  const handleDeleteItem = (id: number) => {
    const msg = `Удалить точку пути с названием "${waypointsData[id].title}"`;
    if (!confirm(msg)) {
      return;
    }
    const newWaypointIdList = waypointIdList.filter(
      (waypointId) => waypointId !== id,
    );
    setWaypointIdList(newWaypointIdList);
    const newWaypointsData = { ...waypointsData };
    delete newWaypointsData[id];
    setWaypointsData(newWaypointsData);
  };

  const handlePostItem = (id: number, newTitle: string) => {
    const newWaypointsData: WaypointsData = {
      ...waypointsData,
      [id]: { ...waypointsData[id], title: newTitle },
    };
    setWaypointsData(newWaypointsData);
    setEditItemId(null);
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
        <Input onEnterNewValue={handleAddItem} />
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
                  isDragDisabled={editItemId !== null}
                >
                  {(columnDraggableProvided) => (
                    <li
                      key={waypointId}
                      ref={columnDraggableProvided.innerRef}
                      {...columnDraggableProvided.dragHandleProps}
                      {...columnDraggableProvided.draggableProps}
                    >
                      {editItemId === waypointId ? (
                        <Input
                          autoFocus={true}
                          defaultValue={waypointsData[waypointId].title}
                          onEnterNewValue={(newValue) => {
                            handlePostItem(waypointId, newValue);
                          }}
                          onCancel={() => setEditItemId(null)}
                        />
                      ) : (
                        <span
                          className={styles.waypointItem}
                          onDoubleClick={() => setEditItemId(waypointId)}
                        >
                          {waypointsData[waypointId].title}
                          <button
                            type={'button'}
                            className={styles.deleteItemButton}
                            onClick={() => handleDeleteItem(waypointId)}
                          >
                            X
                          </button>
                        </span>
                      )}
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
