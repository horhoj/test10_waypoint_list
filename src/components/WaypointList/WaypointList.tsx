import { FC, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { appActions, appSelectors } from '../../store/app';
import styles from './WaypointList.module.scss';
import { Input } from './Input';

export const WaypointList: FC = () => {
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const waypointsData = useAppSelector(appSelectors.getWaypointsData);
  const waypointIdList = useAppSelector(appSelectors.getWaypointIdList);
  const dispatch = useAppDispatch();

  const handleAddItem = (newWaypointTitle: string) => {
    dispatch(appActions.addWaypoint(newWaypointTitle));
  };

  const handleDeleteItem = (id: number) => {
    // const msg = `Удалить точку пути с названием "${waypointsData[id].title}"`;
    // if (!confirm(msg)) {
    //   return;
    // }
    dispatch(appActions.deleteWaypoint(id));
  };

  const handlePatchItem = (id: number, newTitle: string) => {
    dispatch(appActions.editWaypointTitle({ id, newTitle }));
    setEditItemId(null);
  };

  const handleDragEnd = ({ destination, source }: DropResult) => {
    const destinationIndex = destination?.index;
    if (!(typeof destinationIndex === 'number')) {
      return;
    }

    dispatch(
      appActions.dragWaypoint({
        oldIndex: source.index,
        newIndex: destinationIndex,
      }),
    );
  };

  return (
    <div className={styles.wrap}>
      <div>
        <Input
          onEnterNewValue={handleAddItem}
          className={styles.inputAddWaypoint}
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
                  isDragDisabled={editItemId !== null}
                >
                  {(columnDraggableProvided) => (
                    <li
                      key={waypointId}
                      ref={columnDraggableProvided.innerRef}
                      {...columnDraggableProvided.dragHandleProps}
                      {...columnDraggableProvided.draggableProps}
                    >
                      <span
                        className={styles.waypointItem}
                        onDoubleClick={() => setEditItemId(waypointId)}
                      >
                        <span className={styles.waypointItemTitle}>
                          <span>{index + 1}.&nbsp;</span>
                          {editItemId === waypointId ? (
                            <Input
                              className={styles.inputEditWaypointTitle}
                              autoFocus={true}
                              defaultValue={waypointsData[waypointId].title}
                              onEnterNewValue={(newValue) => {
                                handlePatchItem(waypointId, newValue);
                              }}
                              onCancel={() => setEditItemId(null)}
                            />
                          ) : (
                            <span className={styles.inputEditWaypointTitleSpan}>
                              {waypointsData[waypointId].title}
                            </span>
                          )}
                        </span>
                        <span className={styles.waypointItemLocation}>
                          [{waypointsData[waypointId].location[0].toFixed(2)}
                          {', '}
                          {waypointsData[waypointId].location[1].toFixed(2)}]
                        </span>
                        <button
                          type={'button'}
                          className={styles.deleteItemButton}
                          onClick={() => handleDeleteItem(waypointId)}
                        >
                          X
                        </button>
                      </span>
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
