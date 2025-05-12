import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, LayoutChangeEvent, Dimensions } from 'react-native';
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
        hoveredDate,
        registerTaskPosition,
        unregisterTaskPosition
    } = useDragDrop();

    const isReceiving = useSharedValue(false);
    const scale = useSharedValue(1);
    const backgroundColor = useSharedValue('transparent');
    const containerRef = useRef<View>(null);

    // Create a virtual task ID for this day
    const virtualTaskId = `virtual-task-${date}`;

    // Register this list's position for hit testing
    const onLayout = (event: LayoutChangeEvent) => {
        const layout = event.nativeEvent.layout;
        // Register the list's position with the DragDropProvider
        // This is needed to detect when a task is dragged over this list
        // even if there are no tasks in it
        if (containerRef.current) {
            containerRef.current.measure((x, y, width, height, pageX, pageY) => {
                // Create a virtual "task position" for this empty list
                // This allows the drag detection to work even when there are no tasks
                if (tasks.length === 0) {
                    registerTaskPosition(virtualTaskId, {
                        x: pageX,
                        y: pageY,
                        width,
                        height,
                    }, date);
                }
            });
        }
    };

    // Cleanup the virtual task position when the component unmounts
    useEffect(() => {
        return () => {
            if (tasks.length === 0) {
                unregisterTaskPosition(virtualTaskId);
            }
        };
    }, [tasks.length, unregisterTaskPosition, virtualTaskId]);

    // Detect if a task is being dragged over this list
    useEffect(() => {
        if (isDragging && draggingTask && sourceDate !== date) {
            // This is a potential drop target for a task from another day
            isReceiving.value = true;
            scale.value = withSpring(1.02);
            backgroundColor.value = withTiming('rgba(0, 0, 0, 0.05)', { duration: 300 });

            // Set this day as the hovered date when a task is dragged over it
            // Only update if needed to avoid infinite loops
            if (hoveredDate !== date) {
                setHoveredDate(date);
            }
        } else {
            isReceiving.value = false;
            scale.value = withSpring(1);
            backgroundColor.value = withTiming('transparent', { duration: 300 });

            // Only clear hoveredDate if this was the hovered date
            if (hoveredDate === date && !isDragging) {
                setHoveredDate(null);
            }
        }
    }, [isDragging, draggingTask, sourceDate, date, setHoveredDate]);

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
