import React from 'react';
import { WaypointList } from '../WaypointList';
import { MapViewer } from '../MapViewer';
import styles from './App.module.scss';

export const App: React.FC = () => {
  return (
    <div className={styles.wrap}>
      <WaypointList />
      <MapViewer />
    </div>
  );
};
