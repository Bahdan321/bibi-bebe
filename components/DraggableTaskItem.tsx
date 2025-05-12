import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import TaskItem from './TaskItem';
import { Task } from '@/types/types';
import { useDragDrop } from '@/providers/DragDropProvider';

interface DraggableTaskItemProps {
    task: Task;
    date: string;
    onToggleTaskCompletion: (taskId: string) => void;
    index: number;
    tasksCount: number;
}

const DraggableTaskItem: React.FC<DraggableTaskItemProps> = ({
    task,
    date,
    onToggleTaskCompletion,
    index,
    tasksCount,
}) => {
    const {
        setDraggingTask,
        setIsDragging,
        setSourceDate,
        draggingTask,
        isDragging,
        registerTaskPosition,
        unregisterTaskPosition,
        getTaskPositions,
        setHoveredTaskId,
        hoveredTaskId,
        setHoveredDate,
        hoveredDate,
        handleTaskMove,
        handleTaskReorder,
    } = useDragDrop();

    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(1);
    const opacity = useSharedValue(1);
    const isActive = useSharedValue(false);
    const taskRef = useRef<any>(null);

    // Register this task's position for hit testing
    const onLayout = (event: LayoutChangeEvent) => {
        const layout = event.nativeEvent.layout;
        registerTaskPosition(task.id, layout, date);
    };

    // Unregister when component unmounts
    useEffect(() => {
        return () => {
            unregisterTaskPosition(task.id);
        };
    }, [task.id, unregisterTaskPosition]);

    const startDrag = () => {
        setDraggingTask(task);
        setIsDragging(true);
        setSourceDate(date);
    };

    const endDrag = () => {
        // Check if we're hovering over another task or day
        if (hoveredTaskId && hoveredTaskId !== task.id) {
            // Find the index of the hovered task and the current task
            const positions = getTaskPositions();
            const tasksForDay = positions.filter(pos => pos.date === date);
            const sourceIndex = tasksForDay.findIndex(pos => pos.taskId === task.id);
            const destIndex = tasksForDay.findIndex(pos => pos.taskId === hoveredTaskId);

            if (sourceIndex !== -1 && destIndex !== -1) {
                // Reorder within the same day
                handleTaskReorder(
                    tasksForDay.map(pos => ({ id: pos.taskId } as Task)),
                    sourceIndex,
                    destIndex
                );
            }
        } else if (hoveredDate && hoveredDate !== date) {
            // Move to another day
            handleTaskMove(task, hoveredDate);
        }

        // Reset state
        setDraggingTask(null);
        setIsDragging(false);
        setSourceDate(null);
        setHoveredTaskId(null);
        setHoveredDate(null);
    };

    // Function to check if we're hovering over another task or day
    const checkHitTest = (x: number, y: number) => {
        const positions = getTaskPositions();

        // Check if we're hovering over another task
        for (const pos of positions) {
            if (pos.taskId !== task.id) {
                const { layout } = pos;
                if (
                    x >= layout.x &&
                    x <= layout.x + layout.width &&
                    y >= layout.y &&
                    y <= layout.y + layout.height
                ) {
                    setHoveredTaskId(pos.taskId);
                    setHoveredDate(pos.date);
                    return;
                }
            }
        }

        // Not hovering over any task
        setHoveredTaskId(null);
    };

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            isActive.value = true;
            zIndex.value = 100;
            scale.value = withSpring(1.05);
            runOnJS(startDrag)();
        })
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;

            // Check if we're hovering over another task
            if (taskRef.current) {
                // Use the event position to determine where we are
                const centerX = event.x;
                const centerY = event.y;
                runOnJS(checkHitTest)(centerX, centerY);
            }
        })
        .onEnd(() => {
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
            scale.value = withSpring(1);
            zIndex.value = 1;
            isActive.value = false;
            runOnJS(endDrag)();
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value },
            ],
            zIndex: zIndex.value,
            opacity: opacity.value,
            // Fix the shadowOffset style issue
            shadowColor: isActive.value ? '#000' : 'transparent',
            elevation: isActive.value ? 5 : 0,
            ...(isActive.value ? {
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            } : {})
        };
    });

    // If another task is being dragged, slightly fade out this task
    React.useEffect(() => {
        if (isDragging && draggingTask?.id !== task.id) {
            opacity.value = withSpring(0.6);
        } else {
            opacity.value = withSpring(1);
        }
    }, [isDragging, draggingTask, task.id, opacity]);

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View
                ref={taskRef}
                style={[styles.container, animatedStyle]}
                onLayout={onLayout}
            >
                <TaskItem
                    task={task}
                    date={date}
                    onToggleTaskCompletion={onToggleTaskCompletion}
                />
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});

export default DraggableTaskItem;
