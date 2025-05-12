import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    withTiming,
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

    // Animation values
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(1);
    const opacity = useSharedValue(1);
    const isActive = useSharedValue(false);

    // For Trello-like animations when other tasks move
    const offsetY = useSharedValue(0);

    // Use a regular ref, not a worklet-shared ref
    const taskRef = useRef<View>(null);
    // Store task position in shared values for use in worklets
    const taskPosition = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });

    // Register this task's position for hit testing
    const onLayout = (event: LayoutChangeEvent) => {
        const layout = event.nativeEvent.layout;
        // Store the layout in the shared value for use in worklets
        taskPosition.value = {
            x: layout.x,
            y: layout.y,
            width: layout.width,
            height: layout.height
        };
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

        // Check if we're hovering over another task or a virtual task (empty day)
        for (const pos of positions) {
            if (pos.taskId !== task.id) {
                const { layout } = pos;
                if (
                    x >= layout.x &&
                    x <= layout.x + layout.width &&
                    y >= layout.y &&
                    y <= layout.y + layout.height
                ) {
                    // Check if this is a virtual task (representing an empty day)
                    const isVirtualTask = pos.taskId.startsWith('virtual-task-');

                    // If it's a regular task, set both hoveredTaskId and hoveredDate
                    if (!isVirtualTask) {
                        setHoveredTaskId(pos.taskId);
                        setHoveredDate(pos.date);
                    } else {
                        // If it's a virtual task (empty day), only set hoveredDate
                        setHoveredTaskId(null);
                        setHoveredDate(pos.date);
                    }
                    return;
                }
            }
        }

        // Not hovering over any task or day
        setHoveredTaskId(null);
        // Don't clear hoveredDate here, as we might still be over a day but not directly over a task
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

            // Use the event position to determine where we are
            // No need to access taskRef.current in the worklet
            const centerX = event.absoluteX;
            const centerY = event.absoluteY;
            runOnJS(checkHitTest)(centerX, centerY);
        })
        .onEnd(() => {
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
            scale.value = withSpring(1);
            zIndex.value = 1;
            isActive.value = false;
            runOnJS(endDrag)();
        });

    // If another task is being dragged, animate this task
    React.useEffect(() => {
        if (isDragging && draggingTask?.id !== task.id) {
            // Fade out slightly
            opacity.value = withSpring(0.8);

            // If this is the hovered task, move it to make space for the dragged task
            if (hoveredTaskId === task.id) {
                // Move down to make space for the dragged task
                offsetY.value = withSpring(60, { damping: 15, stiffness: 150 });
            } else {
                // Reset position if not hovered
                offsetY.value = withSpring(0, { damping: 15, stiffness: 150 });
            }
        } else {
            // Reset when not dragging
            opacity.value = withSpring(1);
            offsetY.value = withSpring(0);
        }
    }, [isDragging, draggingTask, task.id, opacity, hoveredTaskId, offsetY]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value + offsetY.value },
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
            } : {}),
            // Add a smooth transition for better Trello-like feel
            borderRadius: withTiming(isActive.value ? 8 : 4),
            margin: withTiming(isActive.value ? 2 : 0),
        };
    });

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
