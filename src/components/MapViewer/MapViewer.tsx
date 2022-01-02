import { FC } from 'react';
import { YMaps, Map, Placemark, MapState, Polyline } from 'react-yandex-maps';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { appActions, appSelectors } from '../../store/app';
import { DEFAULT_LOCATION } from '../../config';
import { WaypointLocation } from '../../types';
import styles from './MapViewer.module.scss';

const DEFAULT_MAP_STATE: MapState = {
  center: DEFAULT_LOCATION,
  zoom: 9,
};

const getHintContent = (hint: string): string =>
  `<p style='font-size: 130%; padding: 5px'>${hint}</p>`;

const getBalloonContent = (WL: WaypointLocation): string =>
  `<p>[${WL[0].toFixed(2)}, ${WL[1].toFixed(2)}]</p>`;

export const MapViewer: FC = () => {
  const dispatch = useAppDispatch();
  const waypointIdList = useAppSelector(appSelectors.getWaypointIdList);
  const waypointsData = useAppSelector(appSelectors.getWaypointsData);

  const handlePlaceMarkDragEnd = (waypointId: number) => (e: any) => {
    const newWaypointLocation: WaypointLocation = e
      .get('target')
      .geometry.getCoordinates();

    const action = appActions.editWaypointLocation({
      id: waypointId,
      newWaypointLocation,
    });

    dispatch(action);
  };

  //получаем массив координат для построения ломаной
  const polylineGeometry: WaypointLocation[] = [];
  waypointIdList.forEach((waypointId) => {
    polylineGeometry.push(waypointsData[waypointId].location);
  });

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
            defaultState={DEFAULT_MAP_STATE}
            width={`100%`}
            height={`100%`}
          >
            {waypointIdList.map((waypointId, index) => (
              <Placemark
                key={waypointId}
                geometry={waypointsData[waypointId].location}
                options={{
                  draggable: true,
                }}
                properties={{
                  iconContent: (index + 1).toString(),
                  hintContent: getHintContent(waypointsData[waypointId].title),
                  balloonContentHeader: waypointsData[waypointId].title,
                  balloonContent: getBalloonContent(
                    waypointsData[waypointId].location,
                  ),
                }}
                onDragEnd={handlePlaceMarkDragEnd(waypointId)}
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
              />
            ))}
            <Polyline
              geometry={polylineGeometry}
              options={{
                balloonCloseButton: false,
                strokeColor: '#090',
                strokeWidth: 10,
                strokeOpacity: 0.8,
              }}
            />
          </Map>
        </div>
      </YMaps>
    </div>
  );
};
