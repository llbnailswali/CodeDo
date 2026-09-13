import { LessonQuestion, WorldMeta } from '../../types';
import { CODEDO_MASTER_WORLDS, CURRICULUM_LEVELS_META } from './masterCurriculumCatalog';
import { WORLD_1_QUESTIONS } from './world1_foundations';
import { WORLD_2_QUESTIONS } from './world2_logic';
import { WORLD_3_QUESTIONS } from './world3_loops';
import { WORLD_4_QUESTIONS } from './world4_functions';
import { WORLD_5_QUESTIONS } from './world5_oop';
import { WORLD_6_QUESTIONS } from './world6_collections';
import { WORLD_7_QUESTIONS } from './world7_generics';
import { WORLD_8_QUESTIONS } from './world8_coroutines';
import { WORLD_9_QUESTIONS } from './world9_compose';
import { WORLD_10_QUESTIONS } from './world10_architecture';
import { DAILY_BATTLE_POOL } from './dailyBattleBank';

export { WORLD_1_QUESTIONS } from './world1_foundations';
export { WORLD_2_QUESTIONS } from './world2_logic';
export { WORLD_3_QUESTIONS } from './world3_loops';
export { WORLD_4_QUESTIONS } from './world4_functions';
export { WORLD_5_QUESTIONS } from './world5_oop';
export { WORLD_6_QUESTIONS } from './world6_collections';
export { WORLD_7_QUESTIONS } from './world7_generics';
export { WORLD_8_QUESTIONS } from './world8_coroutines';
export { WORLD_9_QUESTIONS } from './world9_compose';
export { WORLD_10_QUESTIONS } from './world10_architecture';
export { DAILY_BATTLE_POOL } from './dailyBattleBank';
export { CODEDO_MASTER_WORLDS, CURRICULUM_LEVELS_META } from './masterCurriculumCatalog';

// Master combined pool of all curriculum questions
export const ALL_CURRICULUM_QUESTIONS: LessonQuestion[] = [
  ...WORLD_1_QUESTIONS,
  ...WORLD_2_QUESTIONS,
  ...WORLD_3_QUESTIONS,
  ...WORLD_4_QUESTIONS,
  ...WORLD_5_QUESTIONS,
  ...WORLD_6_QUESTIONS,
  ...WORLD_7_QUESTIONS,
  ...WORLD_8_QUESTIONS,
  ...WORLD_9_QUESTIONS,
  ...WORLD_10_QUESTIONS
];

// World Meta Catalog (Authoritative 22-World Curriculum Structure as per CODEDO_MASTER_PLAN.md)
export const WORLDS_CATALOG: WorldMeta[] = CODEDO_MASTER_WORLDS;

// Repository Lookup Helpers
export class LessonRepository {
  static getAll(): LessonQuestion[] {
    return ALL_CURRICULUM_QUESTIONS;
  }

  static getById(id: string): LessonQuestion | undefined {
    return (
      ALL_CURRICULUM_QUESTIONS.find((q) => q.id === id) ||
      DAILY_BATTLE_POOL.find((q) => q.id === id)
    );
  }

  static getForLesson(lessonId: string): LessonQuestion[] {
    const matched = ALL_CURRICULUM_QUESTIONS.filter((q) => q.lessonId === lessonId);
    return matched.length > 0 ? matched : WORLD_1_QUESTIONS;
  }

  static getForWorld(worldId: string): LessonQuestion[] {
    return ALL_CURRICULUM_QUESTIONS.filter((q) => q.worldId === worldId);
  }

  static getForSkill(skill: string): LessonQuestion[] {
    return ALL_CURRICULUM_QUESTIONS.filter((q) => q.skill === skill);
  }
}

export class BattleRepository {
  static getDailySprint(): LessonQuestion[] {
    return DAILY_BATTLE_POOL;
  }
}
