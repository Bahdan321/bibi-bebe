import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Gigabar from './Gigabar';
import RoundButton from './RoundButton';
import CustomText from './CustomText';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TaskItemProps } from '@/types/types';
import { observer } from '@legendapp/state/react';
import { useTheme } from '@/providers/ThemeProvider';
import TaskMenu from './TaskMenu';
import BottomSheet from '@gorhom/bottom-sheet';

const TaskItem: React.FC<TaskItemProps> = observer(
  ({ task, onToggleTaskCompletion, onUpdateTask }) => {
    const { theme } = useTheme();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const truncateTask = (text: string) => {
      const maxLength = 27;
      if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
      }
      return text;
    };

    const handleTextPress = () => {
      setIsMenuVisible(true);
      bottomSheetRef.current?.expand();
    };

    const handleCloseMenu = () => {
      setIsMenuVisible(false);
      bottomSheetRef.current?.close();
    };

    return (
      <View>
        <View style={{ flexDirection: 'column', marginHorizontal: 6 }}>
          <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <TouchableOpacity onPress={handleTextPress} style={{ flex: 1 }}>
              <CustomText
                content={truncateTask(task.title)}
                size={hp('2.2')}
                color={task.status ? theme.colors.secondary : theme.colors.text}
                weight="700"
                lineThrough={task.status}
                opacity={task.status ? 0.6 : 1}
              />
            </TouchableOpacity>
            <RoundButton
              iconName={'checkmark-outline'}
              iconColor={task.status ? theme.colors.secondary : theme.colors.text}
              buttonColor={task.status ? 'transparent' : 'transparent'}
              borderColor={task.status ? theme.colors.secondary : theme.colors.text}
              borderWidth={1.5}
              onPress={() => onToggleTaskCompletion(task.id)}
              size={hp('3.5')}
              hitSlop={10}
            />
          </View>
          <Gigabar color="gray" size={1} />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={isMenuVisible ? 0 : -1}
          snapPoints={['70%']}
          enablePanDownToClose={true}
          onClose={handleCloseMenu}
          backgroundStyle={{ backgroundColor: theme.colors.primary }}
        >
          <TaskMenu
            task={{
              id: task.id,
              title: task.title,
              description: task.description || '',
              date: task.due_date ? new Date(task.due_date) : new Date(),
            }}
            visible={isMenuVisible}
            onUpdate={onUpdateTask}
            onClose={handleCloseMenu}
          />
        </BottomSheet>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
    marginBottom: 15,
    borderRadius: 4,
  },
});

export default TaskItem;