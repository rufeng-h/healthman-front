export interface SubStuSelectItem {
  grade: string;
  M: boolean;
  F: boolean;
  prevSelected: boolean;
}

export interface SubStuSelect {
  name: '小学' | '初中' | '大学' | '高中';
  value: SubStuSelectItem[];
}
