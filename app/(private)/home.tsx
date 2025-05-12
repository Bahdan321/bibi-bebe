import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import NavigatePanel from '@/components/NavigatePanel';
import MainComponent from '@/components/MainComponent';
import { observer } from '@legendapp/state/react';
import BottomSheet from '@gorhom/bottom-sheet';
import TaskMenu from '@/components/TaskMenu';
import { useAuth } from '@/providers/AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DragDropProvider } from '@/providers/DragDropProvider';

const Home = observer(() => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    // const { getUserInfo } = useAuth();

    useEffect(() => {
        bottomSheetRef.current?.expand();

    }, [bottomSheetRef])

    const handleCloseMenu = () => {
        console.log('BottomSheet closed');
    };

    // getUserInfo();

    const goToPreviousWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() - 7);
            return newDate;
        });
    };

    const handleDuplicateTask = (task: any) => {
        console.log('Duplicate task:', task);
        // Add logic to duplicate the task here
    };

    const handleDeleteTask = (task: any) => {
        console.log('Delete task:', task);
        // Add logic to delete the task here
    };

    const goToNextWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + 7);
            return newDate;
        });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <DragDropProvider>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <MainComponent currentDate={currentDate} />
                    <NavigatePanel currentDate={currentDate} goToPreviousWeek={goToPreviousWeek} goToNextWeek={goToNextWeek} />
                </View>
            </DragDropProvider>
        </GestureHandlerRootView>
    )
});

export default Home;
