import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Task } from '@/types/types';

interface SubtaskItemProps {
subtask: Task;
onToggleSubtaskCompletion: (subtaskId: string) => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask, onToggleSubtaskCompletion }) => {
const { theme } = useTheme();

return (
    <View style={styles.container}>
    <TouchableOpacity onPress={() => onToggleSubtaskCompletion(subtask.id)} style={styles.checkbox}>
        <Ionicons
        name={subtask.status ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={subtask.status ? theme.colors.icon : theme.colors.text}
        />
    </TouchableOpacity>
    <Text
        style={{
        color: subtask.status ? theme.colors.secondary : theme.colors.text,
        textDecorationLine: subtask.status ? 'line-through' : 'none',
        fontSize: hp('2'),
        marginLeft: 10,
        }}
    >
        {subtask.title}
    </Text>
    </View>
);
};

const styles = StyleSheet.create({
container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
},
checkbox: {
    marginRight: 10,
},
});

export default SubtaskItem;