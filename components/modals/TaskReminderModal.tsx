import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, NativeScrollEvent, NativeSyntheticEvent, FlatList, Animated } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import CustomText from '@/components/base/CustomText';
import CustomTouchable from '@/components/base/CustomTouchable';
import CustomModal from '@/components/base/CustomModal';

interface TaskReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (hours: number, minutes: number) => void;
  targetDateISO?: string;
}

// Константы выносим наружу, чтобы они не пересоздавались
const ITEM_HEIGHT = 50;
const WHEEL_HEIGHT = ITEM_HEIGHT * 5;
const LOOPS = 50;

const WheelItem = React.memo(({ item, isSelected, theme, scale }: { item: string, isSelected: boolean, theme: any, scale?: Animated.Value }) => {
  if (isSelected && scale) {
    return (
      <Animated.View style={[styles.item, { transform: [{ scale }] }] as any}>
        <CustomText
          content={item}
          size={'xxxl'}
          color={theme.colors.secondary}
          weight={'bold'}
          textCenter
        />
      </Animated.View>
    );
  }
  return (
    <View style={styles.item}>
      <CustomText
        content={item}
        size={'lg'}
        color={theme.colors.text}
        weight={'normal'}
        textCenter
      />
    </View>
  );
});
WheelItem.displayName = 'WheelItem';

const TaskReminderModal: React.FC<TaskReminderModalProps> = ({ visible, onClose, onConfirm, targetDateISO }) => {
  const { theme } = useTheme();

  const now = useMemo(() => new Date(), []);
  // Округляем минуты до ближайших 5
  const initialMinutesRaw = Math.round(now.getMinutes() / 5) * 5 % 60;
  const initialHoursRaw = now.getHours();

  const [selectedHour, setSelectedHour] = React.useState(initialHoursRaw.toString().padStart(2, '0'));
  const [selectedMinute, setSelectedMinute] = React.useState(initialMinutesRaw.toString().padStart(2, '0'));

  const targetDate = useMemo(() => {
    if (!targetDateISO) return null;
    const d = new Date(targetDateISO);
    return isNaN(d.getTime()) ? null : d;
  }, [targetDateISO]);

  const isToday = useMemo(() => {
    if (!targetDate) return false;
    const a = new Date(targetDate);
    const b = new Date();
    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);
    return a.getTime() === b.getTime();
  }, [targetDate]);

  const hoursBase = useMemo(() => {
    if (isToday) {
      const start = now.getHours();
      return Array.from({ length: 24 - start }, (_, i) => (start + i).toString().padStart(2, '0'));
    }
    return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  }, [isToday, now]);

  const hoursData = useMemo(() => {
    let result: string[] = [];
    for (let i = 0; i < LOOPS; i++) {
      result = [...result, ...hoursBase];
    }
    return result;
  }, [hoursBase]);

  const minutesData = useMemo(() => {
    const base = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    let result: string[] = [];
    for (let i = 0; i < LOOPS; i++) {
      result = [...result, ...base];
    }
    return result;
  }, []);

  // Вычисляем начальную позицию скролла, чтобы она была в середине списка ("бесконечность")
  const initialHourIndex = useMemo(() => {
    const centerLoop = Math.floor(LOOPS / 2);
    const selected = initialHoursRaw.toString().padStart(2, '0');
    const idxInBase = hoursBase.indexOf(selected);
    const safeIdx = idxInBase < 0 ? 0 : idxInBase;
    return (centerLoop * hoursBase.length) + safeIdx;
  }, [initialHoursRaw, hoursBase]);

  const initialMinuteIndex = useMemo(() => {
    const centerLoop = Math.floor(LOOPS / 2);
    return (centerLoop * 60) + (initialMinutesRaw); // Индекс в массиве совпадает со значением, т.к. 00, 01...
  }, [initialMinutesRaw]);

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const handleConfirm = () => {
    onConfirm(parseInt(selectedHour, 10), parseInt(selectedMinute, 10));
    onClose();
  };

  // Обработчики скролла
  const colonScale = useRef(new Animated.Value(1)).current;
  const hourSelectScale = useRef(new Animated.Value(1)).current;
  const minuteSelectScale = useRef(new Animated.Value(1)).current;

  const onScrollHours = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const baseLen = hoursBase.length || 1;
    const realIndex = ((index % baseLen) + baseLen) % baseLen;
    const value = hoursBase[realIndex];
    setSelectedHour(prev => prev === value ? prev : value);
    Animated.parallel([
      Animated.spring(colonScale, { toValue: 1, useNativeDriver: true }),
      Animated.sequence([
        Animated.spring(hourSelectScale, { toValue: 1.12, useNativeDriver: true }),
        Animated.spring(hourSelectScale, { toValue: 1, useNativeDriver: true }),
      ]),
    ]).start();
  }, [hoursBase, colonScale, hourSelectScale]);

  const onScrollMinutes = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const realIndex = index % 60;
    const value = realIndex.toString().padStart(2, '0');
    setSelectedMinute(prev => prev === value ? prev : value);
    Animated.parallel([
      Animated.spring(colonScale, { toValue: 1, useNativeDriver: true }),
      Animated.sequence([
        Animated.spring(minuteSelectScale, { toValue: 1.12, useNativeDriver: true }),
        Animated.spring(minuteSelectScale, { toValue: 1, useNativeDriver: true }),
      ]),
    ]).start();
  }, [colonScale, minuteSelectScale]);

  const onBeginDrag = () => {
    Animated.spring(colonScale, { toValue: 1.15, useNativeDriver: true }).start();
  };

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      animationType="fade"
      // Убрал лишние пропсы, которых может не быть в твоем компоненте, верни если нужно
      width="90%"
      padding={theme.spacing?.lg || 20}
    >
      <View style={styles.content}>
        <View style={styles.labelContainer}>
          <CustomText translationKey="time.hours" size="md" color={theme.colors.secondary} weight="bold" textCenter />
          <View style={styles.labelSpacer} />
          <CustomText translationKey="time.minutes" size="md" color={theme.colors.secondary} weight="bold" textCenter />
        </View>

        <View style={styles.unifiedPicker}>
          {/* ЧАСЫ */}
          <View style={[styles.wheelWrapper, { height: WHEEL_HEIGHT }]}>
            <FlatList
              data={hoursData}
              keyExtractor={(item, index) => `h-${index}`}
              renderItem={({ item }) => (
                <WheelItem item={item} isSelected={item === selectedHour} theme={theme} scale={hourSelectScale} />
              )}
              getItemLayout={getItemLayout}
              initialScrollIndex={initialHourIndex}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onMomentumScrollEnd={onScrollHours}
              onScrollBeginDrag={onBeginDrag}
              // paddingVertical через contentContainerStyle для центрирования первого элемента
              contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
            />
          </View>

          {/* ДВОЕТОЧИЕ */}
          <View style={[styles.colonContainer, { height: WHEEL_HEIGHT }]}>
            <Animated.View style={{ transform: [{ scale: colonScale }] }}>
              <CustomText content=":" size="xxl" color={theme.colors.text} weight="normal" />
            </Animated.View>
          </View>

          {/* МИНУТЫ */}
          <View style={[styles.wheelWrapper, { height: WHEEL_HEIGHT }]}>
            <FlatList
              data={minutesData}
              keyExtractor={(item, index) => `m-${index}`}
              renderItem={({ item }) => (
                <WheelItem item={item} isSelected={item === selectedMinute} theme={theme} scale={minuteSelectScale} />
              )}
              getItemLayout={getItemLayout}
              initialScrollIndex={initialMinuteIndex}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onMomentumScrollEnd={onScrollMinutes}
              onScrollBeginDrag={onBeginDrag}
              contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
            />
          </View>
        </View>

        <CustomTouchable style={[styles.applyButton, { backgroundColor: theme.colors.button }]} onPress={handleConfirm}>
          <CustomText translationKey="common.confirm" size="md" color={theme.colors.primary} weight="bold" textCenter />
        </CustomTouchable>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: { marginTop: 10 },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  labelSpacer: { width: 40 },
  unifiedPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  wheelWrapper: {
    width: 80, // Немного уменьшил ширину для аккуратности
    overflow: 'hidden',
  },
  colonContainer: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    height: 50, // Должно совпадать с ITEM_HEIGHT
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default TaskReminderModal;