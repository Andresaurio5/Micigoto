import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import { registerWidgetTaskHandler } from 'react-native-android-widget';

import App from './App';
import { tareaWidget } from './src/widget/tarea';

registerRootComponent(App);
if (Platform.OS === 'android') registerWidgetTaskHandler(tareaWidget);
