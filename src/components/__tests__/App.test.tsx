import { fireEvent, render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { WaypointList } from '../WaypointList';
import { DEFAULT_WAYPOINT_ID_LIST, DEFAULT_WAYPOINTS_DATA } from '../../config';
import '@testing-library/jest-dom/extend-expect';
import { Waypoint, WaypointIdList, WaypointLocation } from '../../types';

const getLocationText = (location: WaypointLocation): string => {
  return `[${location[0]}, ${location[1]}]`;
};

const checkWaypoint = async (currentWaypoint: Waypoint, ren: RenderResult) => {
  //находим title и проверяем его отображение
  const waypointTitle = await ren.findByText(currentWaypoint.title);
  expect(waypointTitle).toHaveTextContent(currentWaypoint.title);
  //проверяем вывод месторасположения
  const waypointLocation = await ren.findByText(
    getLocationText(currentWaypoint.location),
  );
  expect(waypointLocation).toHaveTextContent(
    getLocationText(currentWaypoint.location),
  );
};

describe('test block for the list of waypoints', () => {
  it('integration test for sequential verification of displaying, deleting and adding of waypoints', async () => {
    //делаем обертку над компонентом для доступа к redux
    const ren = render(
      <Provider store={store}>
        <WaypointList />
      </Provider>,
    );

    //проверяем выведены ли точки пути по умолчанию (4 штуки)
    for (let i = 0; i < DEFAULT_WAYPOINT_ID_LIST.length; i++) {
      const waypointId = DEFAULT_WAYPOINT_ID_LIST[i];
      const currentWaypoint = DEFAULT_WAYPOINTS_DATA[waypointId];
      await checkWaypoint(currentWaypoint, ren);
    }
    //удаляем 2 и 4 элементы, должны остаться 1 и 3
    //удаляем используя атрибут data-testid, который будет содержать для кнопки удаления
    //"delete_waypoint_item_btn=11", где 11 это ид соответствующего waypoint
    const deleteWaypointsIdList: WaypointIdList = [2, 4];
    for (let i = 0; i < deleteWaypointsIdList.length; i++) {
      const waypointId = deleteWaypointsIdList[i];
      //находим кнопку удаления
      const deleteBtn = await ren.findByTestId(
        `delete_waypoint_item_btn=${waypointId}`,
      );
      //кликаем по ней
      fireEvent.click(deleteBtn);
      //пытаемся найти удаленный вэйпойнт
      const waypointItem = ren.queryByTestId(`waypoint_item=${waypointId}`);
      // проверяем существует ли вэйпойнт
      expect(waypointItem).toBeNull();
    }
    //после удаления проверяем остались ли вэйпойнты с ид 1 и 3
    const currentWaypointIdList: WaypointIdList = [1, 3];
    for (let i = 0; i < currentWaypointIdList.length; i++) {
      const waypointId = currentWaypointIdList[i];
      const currentWaypoint = DEFAULT_WAYPOINTS_DATA[waypointId];

      const waypointItem = ren.queryByTestId(`waypoint_item=${waypointId}`);
      expect(waypointItem).not.toBeNull();
      await checkWaypoint(currentWaypoint, ren);
    }
    //теперь добавляем новый элемент, который должен получить ид 4
    //находим инпут для ввода нового названия маршрута
    const addNewWaypointTitleInput = await ren.findByTestId(
      'add_new_waypoint_title_input',
    );
    const newTitle = 'new title';
    //записываем в этот инпут новое значение
    fireEvent.change(addNewWaypointTitleInput, {
      target: { value: newTitle },
    });
    //теперь нажимаем Enter, для данного инпута
    // console.log(addNewWaypointTitleInput);
    fireEvent.keyDown(addNewWaypointTitleInput, { key: 'Enter' });
    //проверяем появился ли новый элемент(его ид должен быть 4, так как по сценарию работы,
    // у нового вэйпойнта должен быть новый ид, который больше на 1 по сравнению с максимальным из существующих ):
    await ren.findByTestId(`waypoint_item=4`);

    const newWaypoint: Waypoint = {
      //так как при создании мы сдвигаем центр на 0.05 по второй координате
      //(чтобы новые метки не выстраивались друг над другом) то новые координаты будут
      //немного отличаться от DEFAULT_LOCATION
      location: [55.75, 37.62],
      title: newTitle,
    };

    await checkWaypoint(newWaypoint, ren);
  });
});
