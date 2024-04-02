import Skin from './models/Skins.js'
export const createItem = async ({ name, rarity }) => {
    try {
      const result = await Skin.create({ name, rarity });
      console.log(`Item ${name} saved successfully.`);
      return result;
    } catch (error) {
      console.error(`Error saving item ${name}:`, error);
      throw error;
    }
  };
  