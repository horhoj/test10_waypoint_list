import React, { useState } from 'react';
import { WaypointsData } from '../../types';
import { WaypointList } from '../WaypointList';
import { MapViewer } from '../MapViewer';
import styles from './App.module.scss';

export const App: React.FC = () => {
  // Для удобства обработки, данные по точки маршрута разбиты на два состояния.
  // Например, при изменении положения точек маршрута относительно друг друга,
  // данные по этим точкам не меняются.
  // Следовательно, для обработки данной операции достаточно только waypointIdList

  // массив обозначающий расположение элементов относительно друг друга
  const [waypointIdList, setWaypointIdList] = useState<number[]>([1, 2, 3]);
  // данные по точкам маршрута
  const [waypointsData, setWaypointsData] = useState<WaypointsData>({
    1: { title: 'Точка маршрута 1' },
    2: { title: 'Точка маршрута 2' },
    3: { title: 'Точка маршрута 3' },
  });

  return (
    <div className={styles.wrap}>
      <WaypointList
        waypointsData={waypointsData}
        setWaypointsData={setWaypointsData}
        waypointIdList={waypointIdList}
        setWaypointIdList={setWaypointIdList}
      />
      <MapViewer />
    </div>
  );
};
