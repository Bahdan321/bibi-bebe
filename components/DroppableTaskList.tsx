import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { observer } from '@legendapp/state/react';
import DraggableTaskList from './DraggableTaskList';
import { Task, TaskListProps } from '@/types/types';
import { useDragDrop } from '@/providers/DragDropProvider';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
} from 'react-native-reanimated';

interface DroppableTaskListProps extends TaskListProps {
    // Additional props if needed
}

const DroppableTaskList = observer(({ tasks, onAddTask, onToggleTaskCompletion, date }: DroppableTaskListProps) => {
    const {
        draggingTask,
        isDragging,
        sourceDate,
        handleTaskMove,
        setHoveredDate,
        hoveredDate
    } = useDragDrop();

    const isReceiving = useSharedValue(false);
    const scale = useSharedValue(1);
    const backgroundColor = useSharedValue('transparent');
    const containerRef = useRef<View>(null);

    // Register this list's position for hit testing
    const onLayout = (event: LayoutChangeEvent) => {
        // We don't need to register the list's position with the DragDropProvider
        // because we're only interested in detecting when a task is dragged over this list
    };

    // Detect if a task is being dragged over this list
    useEffect(() => {
        if (isDragging && draggingTask && sourceDate !== date) {
            // This is a potential drop target for a task from another day
            isReceiving.value = true;
            scale.value = withSpring(1.02);
            backgroundColor.value = withTiming('rgba(0, 0, 0, 0.05)', { duration: 300 });

            // Set this day as the hovered date when a task is dragged over it
            if (hoveredDate !== date) {
                setHoveredDate(date);
            }
        } else {
            isReceiving.value = false;
            scale.value = withSpring(1);
            backgroundColor.value = withTiming('transparent', { duration: 300 });
        }
    }, [isDragging, draggingTask, sourceDate, date, hoveredDate, setHoveredDate]);

    // Handle the drop event
    React.useEffect(() => {
        if (!isDragging && draggingTask && sourceDate !== date && isReceiving.value) {
            // A task was dropped on this list from another day
            handleTaskMove(draggingTask, date);
            isReceiving.value = false;
        }
    }, [isDragging, draggingTask, sourceDate, date, handleTaskMove]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            backgroundColor: backgroundColor.value,
            borderRadius: 8,
            padding: isReceiving.value ? 8 : 0,
            marginBottom: isReceiving.value ? 8 : 0,
        };
    });

    return (
        <Animated.View
            style={animatedStyle}
            ref={containerRef}
            onLayout={onLayout}
        >
            <DraggableTaskList
                tasks={tasks}
                onAddTask={onAddTask}
                onToggleTaskCompletion={onToggleTaskCompletion}
                date={date}
            />
        </Animated.View>
    );
});

export default DroppableTaskList;
