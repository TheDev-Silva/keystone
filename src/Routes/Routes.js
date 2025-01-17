import { createStackNavigator } from '@react-navigation/stack'
import AccessLogin from '../AccessLogin/AccessLogin';
import Category from '../Category/Category';
import CreatePassword from '../CreatePassword/CreatePassword';
import Initial from '../Initial/Initial';
import OptionKey from '../OptionKey/OptionKey';

import Pager from '../PagerView/Pager';


import SavesKey from '../SavesKey/SavesKey';

const Stack = createStackNavigator();

export function Routes() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name='Pager'
                component={Pager}
            />
            <Stack.Screen
                name='AccessLogin'
                component={AccessLogin}
            />
            <Stack.Screen
                name='OptionKey'
                component={OptionKey}
            />
            <Stack.Screen
                name='Initial'
                component={Initial}
            />
            <Stack.Screen
                name='CreatePassword'
                component={CreatePassword}
            />
            <Stack.Screen
                name='SavesKey'
                component={SavesKey}
            />
            <Stack.Screen
                name='Category'
                component={Category}
            />
        </Stack.Navigator>
    )
   
}