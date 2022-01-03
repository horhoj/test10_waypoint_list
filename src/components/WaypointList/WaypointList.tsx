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
          dataTestId={'add_new_waypoint_title_input'}
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
                      data-testid={`waypoint_item=${waypointId}`}
                    >
                      <span className={styles.waypointItem}>
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
                          className={styles.patchItemButton}
                          onClick={() => setEditItemId(waypointId)}
                        >
                          E
                        </button>
                        <button
                          type={'button'}
                          className={styles.deleteItemButton}
                          onClick={() => handleDeleteItem(waypointId)}
                          data-testid={`delete_waypoint_item_btn=${waypointId}`}
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
