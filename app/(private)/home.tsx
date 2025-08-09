import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native';
import NavigatePanel from '@/components/NavigatePanel';
import MainComponent from '@/components/MainComponent';
import MonthView from '@/components/MonthView';
import { observer } from '@legendapp/state/react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import TaskMenu from '@/components/TaskMenu';
import { useAuth } from '@/providers/AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuoteModal } from '@/components/modals';
import Settings from '@/components/screens/settings';
import Profile from '@/components/screens/profile';
import Spaces from '@/components/screens/spaces';
import KakoetoMenu from '@/components/screens/kakoetoMenu';
import { useTheme } from '@/providers/ThemeProvider';
import Goals from '@/components/screens/goals';
import { useTasksInitializer } from '@/hooks/useTasksInitializer';

const Home = observer(() => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isMonthView, setIsMonthView] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [showQuote, setShowQuote] = useState(false); // Состояние для управления видимостью цитаты

    // Refs для bottomSheet экранов
    const settingsBottomSheetRef = useRef<BottomSheet>(null);
    const profileBottomSheetRef = useRef<BottomSheet>(null);
    const spacesBottomSheetRef = useRef<BottomSheet>(null);
    const kakoetoMenuBottomSheetRef = useRef<BottomSheet>(null);
    const goalsBottomSheetRef = useRef<BottomSheet>(null);

    // Инициализация задач для текущего пространства
    useTasksInitializer();

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1} // скрывать Backdrop при закрытом состоянии
                appearsOnIndex={0}     // показывать Backdrop при открытом состоянии
                pressBehavior="close"  // при нажатии закрывать Bottom Sheet
                style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            />
        ),
        []
    );

    const snapPoints = useMemo(() => ["25%", "50%"], []);

    const { theme } = useTheme();

    useEffect(() => {
        bottomSheetRef.current?.expand();
    }, [bottomSheetRef]);

    // Проверка даты для показа цитаты
    useEffect(() => {
        const checkQuoteDisplay = async () => {
            console.log('Проверка показа цитаты...');
            try {
                const lastShownDate = await AsyncStorage.getItem('lastQuoteShown');
                console.log('Последняя дата:', lastShownDate);
                const today = new Date().toISOString().split('T')[0];
                console.log('Сегодня:', today);

                if (lastShownDate !== today) {
                    console.log('Показываем цитату');
                    setShowQuote(true);
                    await AsyncStorage.setItem('lastQuoteShown', today);
                } else {
                    console.log('Цитата уже показана сегодня');
                }
            } catch (error) {
                console.error('Ошибка при проверке цитаты:', error);
            }
        };

        checkQuoteDisplay();
    }, []);

    const handleCloseMenu = () => {
        console.log('BottomSheet closed');
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

    const closeQuoteModal = () => {
        setShowQuote(false);
    };

    // Функции для управления bottomSheet экранами
    const openSettingsBottomSheet = useCallback(() => {
        settingsBottomSheetRef.current?.expand();
    }, []);

    const openProfileBottomSheet = () => {
        profileBottomSheetRef.current?.expand();
    };

    const openSpacesBottomSheet = () => {
        spacesBottomSheetRef.current?.expand();
    };

    const openKakoetoMenuBottomSheet = () => {
        kakoetoMenuBottomSheetRef.current?.expand();
    };

    const openGoalsBottomSheet = () => {
        goalsBottomSheetRef.current?.expand();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                    onOpenSettings={openSettingsBottomSheet}
                    onOpenProfile={openProfileBottomSheet}
                    onOpenSpaces={openSpacesBottomSheet}
                    onOpenKakoetoMenu={openKakoetoMenuBottomSheet}
                    onOpenGoals={openGoalsBottomSheet}
                />
                <QuoteModal visible={showQuote} onClose={closeQuoteModal} />

                {/* BottomSheet для Settings */}
                <BottomSheet
                    ref={settingsBottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    handleIndicatorStyle={{ backgroundColor: theme.colors.text, width: '20%' }}
                    backgroundStyle={{ backgroundColor: theme.colors.primary }}
                    enableOverDrag={false}
                    backdropComponent={renderBackdrop}
                >
                    <BottomSheetView style={{ flex: 1 }}>
                        <Settings />
                    </BottomSheetView>
                </BottomSheet>

                {/* BottomSheet для Profile */}
                <BottomSheet
                    ref={profileBottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    handleIndicatorStyle={{ backgroundColor: theme.colors.text, width: '20%' }}
                    backgroundStyle={{ backgroundColor: theme.colors.primary }}
                    enableOverDrag={false}
                    backdropComponent={renderBackdrop}
                >
                    <BottomSheetView style={{ flex: 1 }}>
                        <Profile />
                    </BottomSheetView>
                </BottomSheet>

                {/* BottomSheet для Spaces */}
                {/* <BottomSheet
                    ref={spacesBottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    handleIndicatorStyle={{ backgroundColor: theme.colors.text, width: '20%' }}
                    backgroundStyle={{ backgroundColor: theme.colors.primary }}
                    enableOverDrag={false}
                    backdropComponent={renderBackdrop}
                >
                    <BottomSheetView style={{ flex: 1 }}>
                        <Spaces />
                    </BottomSheetView>
                </BottomSheet> */}

                {/* BottomSheet для KakoetoMenu */}
                {/* <BottomSheet
                    ref={kakoetoMenuBottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    handleIndicatorStyle={{ backgroundColor: theme.colors.text, width: '20%' }}
                    backgroundStyle={{ backgroundColor: theme.colors.primary }}
                    enableOverDrag={false}
                    backdropComponent={renderBackdrop}
                >
                    <BottomSheetView style={{ flex: 1 }}>
                        <KakoetoMenu />
                    </BottomSheetView>
                </BottomSheet> */}

                {/* BottomSheet для Goals */}
                {/* <BottomSheet
                    ref={goalsBottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    handleIndicatorStyle={{ backgroundColor: theme.colors.text, width: '20%' }}
                    backgroundStyle={{ backgroundColor: theme.colors.primary }}
                    enableOverDrag={false}
                    backdropComponent={renderBackdrop}
                >
                    <BottomSheetView style={{ flex: 1 }}>
                        <Goals />
                    </BottomSheetView>
                </BottomSheet> */}
            </View>
        </GestureHandlerRootView>
    )
});

export default Home;