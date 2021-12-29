import React, { useState } from 'react';
import { Waypoint } from '../../types';
import { WaypointList } from '../WaypointList';
import { MapViewer } from '../MapViewer';
import styles from './App.module.scss';

const DEFAULT_WAYPOINT_LIST: Waypoint[] = [
  { id: 1, title: 'Точка маршрута 1' },
  { id: 2, title: 'Точка маршрута 2' },
  { id: 3, title: 'Точка маршрута 3' },
];

export const App: React.FC = () => {
  const [waypointList, setWaypointList] = useState<Waypoint[]>(
    DEFAULT_WAYPOINT_LIST,
  );

  return (
    <div className={styles.wrap}>
      <WaypointList />
      <MapViewer />
    </div>
  );
};
