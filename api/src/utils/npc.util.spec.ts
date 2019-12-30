import {NPC, NPCUtil} from './npc.util';

describe('NPCUtil', () => {
  it('Can fetch with multiple locales', async () => {
    const npcId = 90517;
    const npc: NPC = await NPCUtil.getById(npcId);
    expect(npc.id).toBe(npcId);
    expect(npc.name.en_GB).toBe('Felbound Wolf');
    expect(npc.name.fr_FR).toBe('Loup gangre-lié');
    expect(npc.map.coordinates[0].x).toBe(25.4);
    expect(npc.map.coordinates[0].y).toBe(76.4);
    expect(npc.map.coordinates.length).toBe(23);
    expect(npc.expansionId).toBe(5);
    expect(npc.drops.length).toBe(182);
  });
});
