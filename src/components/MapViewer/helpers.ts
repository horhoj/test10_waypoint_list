import { WaypointLocation, WaypointsData } from '../../types';

export const getHintContent = (hint: string): string =>
  `<p style='font-size: 130%; padding: 5px'>${hint}</p>`;

export const getBalloonContent = (WL: WaypointLocation): string =>
  `[${WL[0].toFixed(2)}, ${WL[1].toFixed(2)}]`;

export const getIconContent = (
  waypointsData: WaypointsData,
  coordinatesTextView: string,
  waypointId: number,
): string =>
  `<p style="display: flex">
     <span 
        style="
          font-weight: 500; 
          font-size: 110%; 
          overflow: hidden; 
          text-overflow: ellipsis; 
          max-width: 120px; 
          display: inline-block"
      >
        ${waypointsData[waypointId].title}
      </span>&nbsp;
      <span>
        ${coordinatesTextView}
      </span>
    </p>`;
