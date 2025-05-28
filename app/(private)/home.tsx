import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native';
import NavigatePanel from '@/components/NavigatePanel';
import MainComponent from '@/components/MainComponent';
import MonthView from '@/components/MonthView';
import { observer } from '@legendapp/state/react';
import BottomSheet from '@gorhom/bottom-sheet';
import TaskMenu from '@/components/TaskMenu';
import { useAuth } from '@/providers/AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Home = observer(() => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isMonthView, setIsMonthView] = useState(false);
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

    const goToPreviousWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() - 7);
            return newDate;
        });
    };

    const goToNextYear = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setFullYear(prevDate.getFullYear() + 1);
            return newDate;
        });
    };

    const goToPreviousYear = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setFullYear(prevDate.getFullYear() - 1);
            return newDate;
        });
    };

    const toggleView = () => {
        setIsMonthView(prev => !prev);
    };

    const handleDayPress = (dateString: string) => {
        const selectedDate = new Date(dateString);
        setCurrentDate(selectedDate);
        setIsMonthView(false);
    };

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            {isMonthView ? (
                <MonthView currentDate={currentDate} onDayPress={handleDayPress} />
            ) : (
                <MainComponent currentDate={currentDate} />
            )}
            <NavigatePanel
                currentDate={currentDate}
                goToPreviousWeek={goToPreviousWeek}
                goToNextWeek={goToNextWeek}
                goToPreviousYear={goToPreviousYear}
                goToNextYear={goToNextYear}
                isMonthView={isMonthView}
                toggleView={toggleView}
            />
        </View>
    )
});

export default Home;