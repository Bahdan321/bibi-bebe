import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import NavigatePanel from '@/components/NavigatePanel';
import MainComponent from '@/components/MainComponent';
import { observer } from '@legendapp/state/react';
import BottomSheet from '@gorhom/bottom-sheet';
import TaskMenu from '@/components/TaskMenu';
import { useAuth } from '@/providers/AuthProvider';

const Home = observer(() => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { getUserInfo } = useAuth();

    getUserInfo();

    const goToPreviousWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() - 7);
            return newDate;
        });
    };

    const goToNextWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + 7);
            return newDate;
        });
    };

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <MainComponent currentDate={currentDate} />
            {/* <TaskMenu
                task={{
                    id: "123213",
                    title: 'Sample Task',
                    description: 'This is a sample task description.',
                    date: new Date(),
                }}
                visible={true}
                onDuplicate={(newTask) => console.log('Duplicate:', newTask)}
                onDelete={(taskId) => console.log('Delete:', taskId)}
                onClose={() => console.log('Close')}
            /> */}
            <NavigatePanel currentDate={currentDate} goToPreviousWeek={goToPreviousWeek} goToNextWeek={goToNextWeek} />
        </View>
    )
});

export default Home;