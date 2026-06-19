export interface listProSkillInterfaces {
  results: interfaceData[];
  department: string;
}
type interfaceData = {
  mediumClass: string;
  smallClass: string;
  content: string;
  difficulty: number;
};
