import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'USERS_ARRAY';

// Get all users as array
export const getUsers = async () => {
  const json = await AsyncStorage.getItem(USERS_KEY);
  return json ? JSON.parse(json) : [];
};

// Add a user object, return false if email exists
export const addUser = async (newUser) => {
  const users = await getUsers();
  if (users.find(user => user.email === newUser.email)) return false;
  users.push(newUser);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};

// Find user matching email & password
export const loginUser = async (email, password) => {
  const users = await getUsers();
  return users.find(user => user.email === email && user.password === password) || null;
};
