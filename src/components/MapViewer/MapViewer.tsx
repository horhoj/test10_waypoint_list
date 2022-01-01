import { FC, useState } from 'react';
import { YMaps, Map, Placemark, MapState } from 'react-yandex-maps';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { appActions, appSelectors } from '../../store/app';
import { DEFAULT_LOCATION } from '../../config';
import { WaypointLocation } from '../../types';
import styles from './MapViewer.module.scss';

export const MapViewer: FC = () => {
  const [mapState, setMapState] = useState<MapState>({
    center: DEFAULT_LOCATION,
    zoom: 9,
  });

  const dispatch = useAppDispatch();
  const center = useAppSelector(appSelectors.getCurrentMapCenter);

  return (
    <div className={styles.wrap}>
      <YMaps>
        <div className={styles.mapWrap}>
          <Map
            onActionEnd={(e: any) => {
              const centerCoordinates: WaypointLocation =
                e.originalEvent.map.getCenter();
              dispatch(appActions.setCurrentMapCenter(centerCoordinates));
            }}
            defaultState={mapState}
            width={'100%'}
            height={'100%'}
          />
        </div>
      </YMaps>
    </div>
  );
};
