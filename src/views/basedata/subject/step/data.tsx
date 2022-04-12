import { GenderEnum } from '/@/enums/genderEnum';

export interface ScoreSheetItem {
  upper: number;
  lower: number;
  score: number;
  level: string;
}

export const defaultLevel = ['优秀', '良好', '及格', '不及格'];


export interface SubjectInfo {
  subName: string;
  subDesp?: string | undefined;
  level: string[];
  genders: GenderEnum[];
  grades: number[];
  compId?: number;
}


