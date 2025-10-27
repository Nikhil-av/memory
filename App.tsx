// App.tsx

// âœ… THIS MUST BE THE VERY FIRST LINE
import 'react-native-gesture-handler';

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './navigation/RootNavigator';


export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
//   ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, Linking, PermissionsAndroid
// } from 'react-native';
// import { addUser, loginUser } from './storage';
// import { getUserMemory, setUserMemory } from './memoryStorage';
// import { pick, keepLocalCopy, types } from '@react-native-documents/picker';
// import RNFS from 'react-native-fs';
//
// async function requestStoragePermissions() {
//   if (Platform.OS === 'android') {
//     await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
//     await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
//     if (Platform.Version >= 33 && PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES) {
//       await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
//       await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO);
//       await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO);
//     }
//   }
// }
//
// const OPENAI_API_KEY = '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';
//
// async function summarizeFileWithOpenAI(file) {
//   let encoded = '';
//   let isImage = false;
//   let prompt = "Summarize the key details in this file (document, image, PDF). For IDs, cards, extract all key info (number, name, dob, etc). Provide details in clear key-value pairs. If no text, say so.";
//   if (file.type && file.type.startsWith('image/')) {
//     isImage = true;
//     prompt = "This is an image — " + prompt;
//     encoded = await RNFS.readFile(file.uri.replace('file://', ''), 'base64');
//   } else if (file.type && file.type.startsWith('application/pdf')) {
//     encoded = await RNFS.readFile(file.uri.replace('file://', ''), 'base64');
//     prompt = `This is a PDF titled "${file.name}". ${prompt}`;
//   } else if (file.type && file.type.startsWith('text/')) {
//     encoded = await RNFS.readFile(file.uri.replace('file://', ''), 'utf8');
//     prompt = `This is a text file named "${file.name}". ${prompt}\n\nFile Content:\n${encoded}`;
//   } else {
//     encoded = await RNFS.readFile(file.uri.replace('file://', ''), 'base64');
//     prompt = `This is a file named "${file.name}". Try to summarize key details from its content, if possible.`;
//   }
//   let content;
//   if (isImage) {
//     content = [
//       { type: 'text', text: prompt },
//     { type: 'image_url', image_url: { url: `data:${file.type};base64,${encoded}` } }
//     ];
//   } else if (file.type && file.type.startsWith('application/pdf')) {
//     content = [
//       { type: 'text', text: prompt },
//       { type: 'text', text: "This is a PDF file attached." }
//     ];
//   } else {
//     content = [{ type: 'text', text: prompt }];
//   }
//
//   let res;
//   try {
//     res = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: isImage ? 'gpt-4o' : 'gpt-4o',
//         messages: [{ role: 'user', content }],
//         max_tokens: 400,
//       }),
//     });
//     Alert.alert('DEBUG', 'after fetch');
//   } catch (fetchErr) {
//     Alert.alert('Fetch error', fetchErr.message || String(fetchErr));
//     throw fetchErr;
//   }
//
//   let rawText;
//   try {
//     rawText = await res.text(); // Always try text first
//   } catch (e) {
//     Alert.alert('res.text() error', e.message || String(e));
//     throw e;
//   }
//   // Optional: see what OpenAI really sent back!
//
//   let data;
//   try {
//     data = JSON.parse(rawText);
//   } catch (parseErr) {
//     Alert.alert('JSON parse error', parseErr.message || String(parseErr));
//     throw parseErr;
//   }
//
//   const summary = data.choices?.[0]?.message?.content || 'No summary found.';
//   return summary;
// }
//
// function LoginScreen({ navigateToRegister, onLogin, errorMsg }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   return (
//     <View style={styles.contentContainer}>
//       <Text style={styles.title}>Welcome Back!</Text>
//       <Text style={styles.subtitle}>Sign in to continue</Text>
//       <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#737373" autoCapitalize="none" />
//       <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#737373" autoCapitalize="none" />
//       <CustomButton title="Login" onPress={() => onLogin(email, password)} />
//       {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}
//       <Text style={styles.linkText} onPress={navigateToRegister}>
//         Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
//       </Text>
//     </View>
//   );
// }
//
// function RegisterScreen({ navigateToLogin, onRegister, errorMsg }) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   return (
//     <View style={styles.contentContainer}>
//       <Text style={styles.title}>Create Account</Text>
//       <Text style={styles.subtitle}>Start your journey with us</Text>
//       <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} placeholderTextColor="#737373" />
//       <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#737373" autoCapitalize="none" />
//       <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#737373" autoCapitalize="none" />
//       <CustomButton title="Register" onPress={() => onRegister(name, email, password)} />
//       {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}
//       <Text style={styles.linkText} onPress={navigateToLogin}>
//         Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
//       </Text>
//     </View>
//   );
// }
//
// function AddStatementScreen({ user, onBack }) {
//   const [statement, setStatement] = useState('');
//   const [memory, setMemoryState] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   useEffect(() => { (async () => { setMemoryState(await getUserMemory(user.email)); })(); }, []);
//   const saveMemory = async (newArray) => { await setUserMemory(user.email, newArray); setMemoryState(newArray); };
//    const handleAttachFile = async () => {
//       try {
//         setUploading(true);
//         await requestStoragePermissions();
//
//         // Use the 'copyTo' option to get a permanent local URI directly
//         const [file] = await pick({
//           type: [types.allFiles],
//           copyTo: 'documentDirectory', // This is the key fix!
//         });
//
//         // Check if the file and its URI are valid after picking
//         if (!file || !file.uri) {
//           setUploading(false);
//           // Alert is optional here, as cancelling the picker is normal user behavior
//           // Alert.alert("Picker Error", "No file was picked or the file has no URI.");
//           return;
//         }
//
//         // No need for keepLocalCopy anymore, 'file.uri' is the permanent path
//         const summary = await summarizeFileWithOpenAI(file); // Pass the file object directly
//
//         const newEntry = {
//           type: 'file',
//           name: file.name,
//           mime: file.type,
//           uri: file.uri, // Use the URI directly from the picked file
//           summary,
//           addedAt: Date.now(),
//         };
//
//         const newMemory = [...memory, newEntry];
//         await saveMemory(newMemory);
//         Alert.alert('File Added!', summary ? `Summary: ${summary}` : 'File is now in your memory.');
//
//       } catch (e) {
//         if (e.message && e.message.includes('cancelled')) {
//           // User cancelled the picker, do nothing
//         } else {
//           Alert.alert('File Problem', e.message || String(e));
//         }
//       } finally {
//         setUploading(false);
//       }
//     };
//   const handleAddStatement = async () => {
//     if (!statement.trim()) return;
//     const newEntry = { type: 'text', content: statement.trim(), addedAt: Date.now() };
//     const newMemory = [...memory, newEntry];
//     await saveMemory(newMemory);
//     setStatement('');
//   };
//   const handleDeleteMemory = async (index) => {
//     const updated = [...memory.slice(0, index), ...memory.slice(index + 1)];
//     await saveMemory(updated);
//   };
//   const handleDownloadFile = async (entry) => { if (entry && entry.uri) await Linking.openURL(entry.uri); };
//   return (
//     <SafeAreaView style={styles.screenContainer}>
//       <Text style={styles.pageTitle}>Memory Dashboard</Text>
//       <View style={styles.memoryCard}>
//         <Text style={styles.memoryPrompt}>Add text or attach PDF/Image/Doc:</Text>
//         <TextInput style={styles.memoryTextArea} placeholder="Type something memorable here..." value={statement} onChangeText={setStatement} multiline textAlignVertical="top" />
//         <CustomButton title="Add Note" onPress={handleAddStatement} disabled={!statement.trim()} style={{ marginTop: 6 }} />
//         <CustomButton title={uploading ? 'Uploading...' : 'Attach File'} onPress={handleAttachFile} disabled={uploading} />
//       </View>
//       <View style={{ marginTop: 22, width: '100%' }}>
//         <Text style={styles.sectionTitle}>Your Memory</Text>
//         <ScrollView style={styles.memoryScroll} contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 2 }} showsVerticalScrollIndicator={false}>
//           {!memory.length && (<Text style={{ color: '#bbb', margin: 12, textAlign: 'center' }}>No items yet.</Text>)}
//           {memory.map((m, idx) =>
//             m.type === 'file' ? (
//               <View key={idx} style={styles.memoryListItemRow}>
//                 <View style={{ flex: 1 }}>
//                   <Text style={{ fontWeight: 'bold' }}>{m.name}</Text>
//                   <Text style={{ fontSize: 12, color: '#555' }}>Type: {m.mime}</Text>
//                   {m.summary ? (<Text numberOfLines={4} style={{ fontSize: 13 }}>Summary: {m.summary}</Text>) : null}
//                 </View>
//                 <TouchableOpacity onPress={() => handleDownloadFile(m)} style={styles.fileButton}>
//                   <Text style={styles.fileButtonText}>📥</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => handleDeleteMemory(idx)} style={styles.deleteIconBtn}>
//                   <Text style={styles.deleteIconText}>🗑️</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View key={idx} style={styles.memoryListItemRow}>
//                 <Text style={{ color: '#3c4961', flex: 1 }}>{m.content}</Text>
//                 <TouchableOpacity onPress={() => handleDeleteMemory(idx)} style={styles.deleteIconBtn}>
//                   <Text style={styles.deleteIconText}>🗑️</Text>
//                 </TouchableOpacity>
//               </View>
//             )
//           )}
//         </ScrollView>
//       </View>
//       <TouchableOpacity style={styles.backButton} onPress={onBack}>
//         <Text style={styles.backButtonText}>← Back to Dashboard</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }
//
// function ChatMemoryScreen({ user, onBack }) {
//   const [memory, setMemory] = useState([]);
//   const [chatInput, setChatInput] = useState('');
//   const [chatMessages, setChatMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const scrollViewRef = useRef();
//   useEffect(() => { (async () => setMemory(await getUserMemory(user.email)))(); }, []);
//   const sendMessage = async () => {
//     if (!chatInput.trim()) return;
//     const currentInput = chatInput.trim();
//     setChatMessages((prev) => [...prev, { role: 'user', text: currentInput }]);
//     setChatInput('');
//     setLoading(true);
//     let prompt = "Here is the user's memory information.\n";
//     memory.forEach((m) => {
//       if (m.type === 'file') {
//         prompt += `[FILE: ${m.name}, type: ${m.mime}]-- SUMMARY: ${m.summary}\n`;
//       } else if (m.type === 'text') {
//         prompt += `[NOTE]: ${m.content}\n`;
//       }
//     });
//     prompt += "\nFor file requests (e.g. 'give my pan pdf'), answer with the text: [DOWNLOAD:filename.ext]";
//     const res = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'gpt-4',
//         messages: [
//           { role: 'system', content: prompt },
//           { role: 'user', content: currentInput },
//         ],
//         max_tokens: 300,
//       }),
//     });
//     const data = await res.json();
//     let assistantMsg = data.choices?.[0]?.message?.content || 'No response';
//     const downloadMatch = assistantMsg.match(/\[DOWNLOAD\:([^\]]+)\]/i);
//     let fileEntry;
//     if (downloadMatch) {
//       const filename = downloadMatch[1].trim();
//       fileEntry = memory.find(
//         (m) =>
//           m.type === 'file' &&
//           m.name.toLowerCase() === filename.toLowerCase()
//       );
//       assistantMsg = `Here is your file "${filename}":`;
//     }
//     setLoading(false);
//     setChatMessages((prev) => [
//       ...prev,
//       { role: 'gpt', text: assistantMsg, file: fileEntry },
//     ]);
//     setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 22);
//   };
//   return (
//     <SafeAreaView style={styles.screenContainer}>
//       <Text style={styles.pageTitle}>Chat with Your Memory</Text>
//       <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//         <ScrollView ref={scrollViewRef} contentContainerStyle={styles.chatScroll} style={styles.chatScroll}>
//           {chatMessages.length === 0 ? (
//             <Text style={{ color: '#bbb', textAlign: 'center', marginVertical: 30 }}>Ask about your memory or request a file...</Text>
//           ) : (
//             chatMessages.map((msg, i) => (
//               <View key={i} style={[styles.chatBubble, msg.role === 'user' ? styles.userBubble : styles.gptBubble]}>
//                 <Text style={[styles.chatText, msg.role === 'user' ? styles.userText : styles.gptText]}>{msg.text}</Text>
//                 {msg.file && msg.file.uri ? (
//                   <TouchableOpacity style={styles.fileButton} onPress={() => Linking.openURL(msg.file.uri)}>
//                     <Text style={styles.fileButtonText}>📥 Download {msg.file.name}</Text>
//                   </TouchableOpacity>
//                 ) : null}
//               </View>
//             ))
//           )}
//           {loading && <ActivityIndicator style={{ marginTop: 8 }} />}
//         </ScrollView>
//         <View style={styles.chatInputRow}>
//           <TextInput style={styles.chatInput} placeholder="Type your question or file request..." value={chatInput} onChangeText={setChatInput} editable={!loading} onSubmitEditing={sendMessage} returnKeyType="send" />
//           <CustomButton title="Send" onPress={sendMessage} disabled={loading || !chatInput.trim()} style={styles.sendButtonShort} />
//         </View>
//       </KeyboardAvoidingView>
//       <TouchableOpacity style={styles.backButton} onPress={onBack}>
//         <Text style={styles.backButtonText}>← Back to Dashboard</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }
//
// function Dashboard({ user, onLogout }) {
//   const [mode, setMode] = useState(null);
//   if (mode === 'add') return <AddStatementScreen user={user} onBack={() => setMode(null)} />;
//   if (mode === 'chat') return <ChatMemoryScreen user={user} onBack={() => setMode(null)} />;
//   return (
//     <SafeAreaView style={styles.screenContainer}>
//       <Text style={styles.title}>Welcome, {user.name}!</Text>
//       <Text style={styles.subtitle}>What do you want to do?</Text>
//       <View style={{ width: '98%', marginTop: 18 }}>
//         <OptionButton title="Edit Memory" icon="📝" onPress={() => setMode('add')} />
//         <OptionButton title="Chat with Memory" icon="🤖" onPress={() => setMode('chat')} />
//         <TouchableOpacity style={styles.minorButton} onPress={onLogout}>
//           <Text style={styles.minorButtonText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }
//
// function App() {
//   const [currentScreen, setCurrentScreen] = useState('Login');
//   const [errorMsg, setErrorMsg] = useState('');
//   const [user, setUser] = useState(null);
//   const handleLogin = async (email, password) => {
//     const found = await loginUser(email, password);
//     if (found) {
//       setUser(found);
//       setErrorMsg('');
//       setCurrentScreen('Dashboard');
//     } else {
//       setErrorMsg('Invalid credentials!');
//     }
//   };
//   const handleRegister = async (name, email, password) => {
//     if (!name || !email || !password) {
//       setErrorMsg('All fields required!');
//       return;
//     }
//     const ok = await addUser({ name, email, password });
//     if (ok) {
//       setCurrentScreen('Login');
//       setErrorMsg('Registration successful! Please login.');
//     } else {
//       setErrorMsg('Email already exists!');
//     }
//   };
//   const handleLogout = () => {
//     setUser(null);
//     setCurrentScreen('Login');
//     setErrorMsg('');
//   };
//   if (currentScreen === 'Dashboard' && user) {
//     return <Dashboard user={user} onLogout={handleLogout} />;
//   }
//   return (
//     <SafeAreaView style={styles.screenContainer}>
//       {currentScreen === 'Login' && (
//         <LoginScreen navigateToRegister={() => { setCurrentScreen('Register'); setErrorMsg(''); }}
//           onLogin={handleLogin}
//           errorMsg={errorMsg}
//         />
//       )}
//       {currentScreen === 'Register' && (
//         <RegisterScreen navigateToLogin={() => { setCurrentScreen('Login'); setErrorMsg(''); }}
//           onRegister={handleRegister}
//           errorMsg={errorMsg}
//         />
//       )}
//     </SafeAreaView>
//   );
// }
//
// const OptionButton = ({ title, icon, onPress }) => (
//   <TouchableOpacity onPress={onPress} style={styles.optionButton} activeOpacity={0.9}>
//     <View style={styles.optionButtonInner}>
//       <Text style={styles.optionButtonIcon}>{icon}</Text>
//       <Text style={styles.optionButtonText}>{title}</Text>
//     </View>
//   </TouchableOpacity>
// );
//
// const CustomButton = ({ title, onPress, disabled, style }) => (
//   <TouchableOpacity
//     style={[styles.customButton, disabled && { backgroundColor: '#ccc' }, style]}
//     onPress={onPress}
//     disabled={disabled}
//     activeOpacity={0.8}
//   >
//     <Text style={styles.customButtonText}>{title}</Text>
//   </TouchableOpacity>
// );
//
// const styles = StyleSheet.create({
//   screenContainer: { flex: 1, backgroundColor: '#f0f4f7', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 16 },
//   contentContainer: { width: '92%', maxWidth: 400, backgroundColor: 'transparent', padding: 28, borderRadius: 12, alignSelf: 'center' },
//   title: { fontSize: 32, fontWeight: 'bold', color: '#1e3a5f', marginTop: 18, marginBottom: 4, textAlign: 'center' },
//   subtitle: { fontSize: 17, color: '#5a789a', marginBottom: 20, textAlign: 'center' },
//   input: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 8, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#ddd', color: '#333', width: '100%' },
//   optionButton: { backgroundColor: '#fff', borderColor: '#1680fe', borderWidth: 2, borderRadius: 18, paddingVertical: 26, paddingHorizontal: 22, marginVertical: 17, alignItems: 'center', elevation: 5 },
//   optionButtonInner: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
//   optionButtonIcon: { fontSize: 28, marginRight: 13 },
//   optionButtonText: { fontSize: 20, color: '#1680fe', fontWeight: 'bold', letterSpacing: 0.5 },
//   minorButton: { backgroundColor: '#ededed', borderRadius: 7, marginTop: 30, paddingVertical: 14, alignItems: 'center' },
//   minorButtonText: { color: '#666', fontWeight: 'bold', fontSize: 15 },
//   customButton: { backgroundColor: '#1680fe', borderRadius: 7, paddingVertical: 13, paddingHorizontal: 14, marginTop: 11, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', minWidth: 90 },
//   customButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
//   sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#294872', marginBottom: 9, marginLeft: 2, marginTop: 18 },
//   errorMsg: { color: 'red', marginTop: 7, textAlign: 'center', fontSize: 14 },
//   successMsg: { color: '#1aaa1a', marginTop: 5, marginBottom: -5, textAlign: 'center', fontWeight: 'bold', fontSize: 15, letterSpacing: 0.2 },
//   linkText: { marginTop: 25, textAlign: 'center', color: '#5a789a', fontSize: 14 },
//   linkTextBold: { fontWeight: 'bold', color: '#1680fe' },
//   memoryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 19, marginTop: 24, width: '99%', alignSelf: 'center', elevation: 3 },
//   memoryPrompt: { color: '#0e3e77', fontWeight: 'bold', fontSize: 15, marginBottom: 7 },
//   memoryTextArea: { backgroundColor: '#f7faff', borderRadius: 9, padding: 15, minHeight: 65, maxHeight: 90, fontSize: 16, marginBottom: 7, borderWidth: 1, borderColor: '#cdddee', color: '#31334d' },
//   memoryScroll: { backgroundColor: '#f5f8fc', borderRadius: 7, height: 100 },
//   memoryListItemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e4f0fa', borderRadius: 6, paddingVertical: 7, paddingHorizontal: 9, marginBottom: 6 },
//   deleteIconBtn: { paddingHorizontal: 10, paddingVertical: 2, marginLeft: 7, borderRadius: 16, backgroundColor: '#fde7e7', alignItems: 'center', justifyContent: 'center' },
//   deleteIconText: { color: '#cc2333', fontSize: 19, fontWeight: 'bold' },
//   fileButton: { padding: 6, marginLeft: 7, backgroundColor: '#e4fafd', borderRadius: 6, alignItems: 'center' },
//   fileButtonText: { fontSize: 17, color: '#1182b6', fontWeight: 'bold' },
//   pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#00306b', marginTop: 18, marginBottom: 19, textAlign: 'center' },
//   chatScroll: { flexGrow: 1, minHeight: 180, width: '100%', paddingBottom: 13, marginBottom: 0, backgroundColor: 'transparent', borderRadius: 8 },
//   chatBubble: { marginVertical: 3, marginHorizontal: 0, borderRadius: 13, maxWidth: '83%', paddingHorizontal: 16, paddingVertical: 12 },
//   userBubble: { backgroundColor: '#d8ebff', alignSelf: 'flex-end', borderTopRightRadius: 3 },
//   gptBubble: { backgroundColor: '#f6f7fa', alignSelf: 'flex-start', borderTopLeftRadius: 3 },
//   chatText: { fontSize: 16 },
//   userText: { color: '#105f95', fontWeight: '600' },
//   gptText: { color: '#2b2c3d' },
//   chatInputRow: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#fff', borderRadius: 9, marginTop: 7, paddingHorizontal: 7, paddingVertical: 4, borderWidth: 1, borderColor: '#dedede' },
//   chatInput: { flex: 1, fontSize: 17, minHeight: 34, maxHeight: 74, paddingLeft: 7, paddingVertical: 7, color: '#333', backgroundColor: 'transparent' },
//   sendButtonShort: { minWidth: 55, marginLeft: 7, marginTop: 0, borderRadius: 7, paddingVertical: 9, backgroundColor: '#31aaff' },
//   backButton: { marginTop: 18, alignSelf: 'center' },
//   backButtonText: { color: '#1680fe', fontWeight: '600', fontSize: 16 },
// });
//
// export default App;
