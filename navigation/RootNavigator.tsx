// navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OtpVerificationScreen from '../screens/Auth/OtpVerificationScreen';
import CompleteProfileScreen from '../screens/Auth/CompleteProfileScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import AddTextScreen from '../screens/Main/AddTextScreen';
// Main App Screens
import DashboardScreen from '../screens/Main/DashboardScreen';
import FilesListScreen from '../screens/Main/FilesListScreen';
import QueryScreen from '../screens/Main/QueryScreen';
import UploadScreen from '../screens/Main/UploadScreen';
import FileDetailScreen from '../screens/Main/FileDetailScreen';

const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();
const AppStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="OtpVerification" component={OtpVerificationScreen} options={{ headerShown: true, title: 'Enter Code' }}/>
      <AuthStack.Screen name="CompleteProfile" component={CompleteProfileScreen} options={{ headerShown: true, title: 'Complete Profile' }} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: true, title: 'Forgot Password' }} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: true, title: 'Reset Password' }} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          else if (route.name === 'Files') iconName = focused ? 'folder' : 'folder-outline';
          else if (route.name === 'Query') iconName = focused ? 'brain' : 'brain';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <MainTab.Screen name="Dashboard" component={DashboardScreen} />
      <MainTab.Screen name="Files" component={FilesListScreen} />
      <MainTab.Screen name="Query" component={QueryScreen} />
    </MainTab.Navigator>
  );
}


function AppNavigator() {
    return (
        <AppStack.Navigator>
            <AppStack.Screen name="Main" component={MainNavigator} options={{ headerShown: false }} />
            <AppStack.Screen name="Upload" component={UploadScreen} options={{ title: 'Upload File' }} />
            <AppStack.Screen name="FileDetail" component={FileDetailScreen} options={{ title: 'File Details' }} />
            <AppStack.Screen name="AddText" component={AddTextScreen} options={{ title: 'Add Text Note' }} />
        </AppStack.Navigator>
    )
}

export default function RootNavigator() {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {accessToken ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}