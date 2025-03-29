import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import NavigatePanel from '@/components/NavigatePanel';
import MainComponent from '@/components/MainComponent';
import { observer } from '@legendapp/state/react';

const Home = observer(() => {
    const [currentDate, setCurrentDate] = useState(new Date());

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
            <NavigatePanel currentDate={currentDate} goToPreviousWeek={goToPreviousWeek} goToNextWeek={goToNextWeek} />
        </View>
    )
});

export default Home;