import { ScoreInfo } from '/@/api/score';
import { propTypes } from '/@/utils/propTypes';

export const RadarProps = {
  scores: Array as PropType<ScoreInfo[]>,
  loading: propTypes.bool.def(false),
  width: propTypes.string.def('100%'),
  height: propTypes.string.def('20rem'),
};
