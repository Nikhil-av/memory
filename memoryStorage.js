import AsyncStorage from '@react-native-async-storage/async-storage';

const MEMORY_PREFIX = 'USER_MEMORY_';

// Get all memory items
export const getUserMemory = async (email) => {
  const key = `${MEMORY_PREFIX}${email}`;
  const json = await AsyncStorage.getItem(key);
  return json ? JSON.parse(json) : [];
};

// Overwrite memory (array of objects)
export const setUserMemory = async (email, memoryArray) => {
  const key = `${MEMORY_PREFIX}${email}`;
  await AsyncStorage.setItem(key, JSON.stringify(memoryArray));
};

// Remove by index
export const deleteUserMemoryAtIndex = async (email, index) => {
  const key = `${MEMORY_PREFIX}${email}`;
  let mem = await getUserMemory(email);
  mem.splice(index, 1);
  await AsyncStorage.setItem(key, JSON.stringify(mem));
};
