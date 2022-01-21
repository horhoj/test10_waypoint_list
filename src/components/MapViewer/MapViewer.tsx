import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { YMaps, Map, Placemark, MapState, Polyline } from 'react-yandex-maps';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { appActions, appSelectors } from '../../store/app';
import { DEFAULT_LOCATION } from '../../config';
import { WaypointLocation } from '../../types';
import styles from './MapViewer.module.scss';
import { getBalloonContent, getHintContent, getIconContent } from './helpers';

const DEFAULT_MAP_STATE: MapState = {
  center: DEFAULT_LOCATION,
  zoom: 9,
};

const MIN_MAP_WIDTH = 671;

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

  //этот код нужен для адекватного выравнивания размеров карты
  const mapWrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(MIN_MAP_WIDTH);
  const resize = useCallback(() => {
    if (mapWrapRef.current) {
      const { width } = mapWrapRef.current.getBoundingClientRect();
      setWidth(width);
    }
  }, []);

  useEffect(() => {
    resize();
  }, [waypointIdList]);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={styles.wrap} style={{ minHeight: `${width + 40}px` }}>
      <div className={styles.helper}>метки на карте можно перетаскивать</div>
      <YMaps>
        <div ref={mapWrapRef}>
          <Map
            onActionEnd={(e: any) => {
              const centerCoordinates: WaypointLocation =
                e.originalEvent.map.getCenter();
              dispatch(appActions.setCurrentMapCenter(centerCoordinates));
            }}
            defaultState={DEFAULT_MAP_STATE}
            width={`${width}px`}
            height={`${width}px`}
          >
            {waypointIdList.map((waypointId) => {
              const coordinatesTextView = getBalloonContent(
                waypointsData[waypointId].location,
              );
              return (
                <Placemark
                  key={waypointId}
                  geometry={waypointsData[waypointId].location}
                  options={{
                    draggable: true,
                    preset: 'islands#blueStretchyIcon',
                  }}
                  properties={{
                    iconContent: getIconContent(
                      waypointsData,
                      coordinatesTextView,
                      waypointId,
                    ),
                    hintContent: getHintContent(
                      waypointsData[waypointId].title,
                    ),
                    balloonContentHeader: waypointsData[waypointId].title,
                    balloonContent: coordinatesTextView,
                  }}
                  onDragEnd={handlePlaceMarkDragEnd(waypointId)}
                  modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                />
              );
            })}
            <Polyline
              geometry={polylineGeometry}
              options={{
                balloonCloseButton: false,
                strokeColor: '#090',
                strokeWidth: 7,
                strokeOpacity: 0.8,
              }}
            />
          </Map>
        </div>
      </YMaps>
    </div>
  );
};
