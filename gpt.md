Сейчас есть такая проблема, что пользователь не может переключаться между неделями, у него она сейчас одна.
Я бы хотел тебя попросить помочь мне реализовать логику, которая будет получать данные с календаря и передавать их в компонент, который далее обработает эти данные и перекинет на компонент, который отвечает за день, чтобы данные были не фейковыми,а настоящими.
У меня есть главный компонент:
const MainComponent: React.FC = () => {
    const days = [
        { date: '2025-03-28', dayOfWeek: 'Понедельник' },
        { date: '2025-03-29', dayOfWeek: 'Вторник' },
        { date: '21-01-27', dayOfWeek: 'Среда' },
        { date: '21-01-28', dayOfWeek: 'Четверг' },
        { date: '21-01-29', dayOfWeek: 'Пятница' },
        { date: '21-01-30', dayOfWeek: 'Суббота' },
        { date: '21-01-31', dayOfWeek: 'Воскресенье' },
    ];

    const { theme } = useTheme();


    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                nestedScrollEnabled={true}
            >
                <View style={styles.content}>
                    {days.map((day, index) => (
                        <DayBlock key={index} date={day.date} dayOfWeek={day.dayOfWeek} />
                    ))}
                    {/* <DayBlock date={days[0].date} dayOfWeek={days[0].dayOfWeek} /> */}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        padding: 12,
    }
});

export default MainComponent;

компонент списка задач:

interface TaskListProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTaskCompletion: (taskId: string) => void;
}

const TaskList = observer(({ tasks, onAddTask, onToggleTaskCompletion }: TaskListProps) => {
  // const handleAddTask = (newTaskText: string) => {
  //   if (newTaskText.trim() !== '') {
  //     onAddTask(newTaskText.trim());
  //   }
  // };

  // tasks = Object.values(tasks);

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTaskCompletion={() => onToggleTaskCompletion(task.id)}
        />
      ))}
      <NewTaskInput onAddTask={onAddTask} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default TaskList;

компонент дня:
type DayBlockProps = {
    date: string;
    dayOfWeek: string;
}

const DayBlock: React.FC<DayBlockProps> = observer(({ date, dayOfWeek }) => {
    const todos = todos$.get();
    console.log(todos);
    const { theme } = useTheme();

    const tasksForDay = Object.values(todos || {}).filter((task) => task.date === date);
    return (
        <View style={{ marginBottom: 48 }}>
            <DayInfo date={date} dayOfWeek={dayOfWeek} />
            <Gigabar color={theme.colors.secondary} size={2} />
            <TaskList tasks={tasksForDay} onAddTask={(text) => addTask(text, date)} onToggleTaskCompletion={toggleTaskCompletion} date={date} />
        </View>
    );
});

export default DayBlock;

