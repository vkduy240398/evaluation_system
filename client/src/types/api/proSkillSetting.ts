export interface main {
  callBack: (data: any) => void;
  errorCallBack: (bool?: boolean) => void;
}
export interface paramsListVersion {
  status: number;
  departmentId: number;
  limit: number;
  offset: number;
}
export interface professionalExpertise {
  jobType: string;
  childrens: {
    year: number;
    periodIndex: number;
    totalPoint: number;
  }[];
  childrenLarge: {
    year: string;
    periodIndex: number;
    totalPoint: number;
    largeClass: string;
    evaluationId: number;
    childrens: {
      difficulty: number;
      mediumClass: string;
      pointEvaluator2: number;
      smallClass: string;
    }[];
  }[];
  childrenMedium: {
    year: string;
    periodIndex: number;
    totalPoint: number;
    largeClass: string;
    mediumClass: string;
    evaluationId: number;
    childrens: {
      difficulty: number;
      mediumClass: string;
      largeClass: string;
      pointEvaluator2: number;
      smallClass: string;
    }[];
  }[];
}
