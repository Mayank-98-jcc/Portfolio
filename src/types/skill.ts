export interface Skill {
  name: string;
  symbol: string;
  color: string;
  description: string;
}
export interface SkillCategory {
  name: string;
  description: string;
  skills: Skill[];
}
