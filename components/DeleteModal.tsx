import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface DeleteModalProps {
    Modaltext: string;
    firstButtonText: string;
    secondButtonText: string;
    firstButtonAction: () => void;
    secondButtonAction: () => void;
    visible: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ Modaltext, firstButtonText, secondButtonText, firstButtonAction, secondButtonAction, visible }) => {
    return (
        <Modal
            transparent
            animationType="slide"
            visible={visible}
            onRequestClose={firstButtonAction}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>{Modaltext}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={firstButtonAction} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>{firstButtonText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={secondButtonAction} style={styles.deleteButton}>
                            <Text style={styles.buttonText}>{secondButtonText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: wp('80%'),
        padding: hp('3%'),
        backgroundColor: '#fff',
        borderRadius: 60,
        alignItems: 'center',
    },
    modalText: {
        fontSize: wp('8%'),
        marginBottom: hp('2%'),
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: 'black',
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('5%'),
        borderRadius: 5,
        marginHorizontal: wp('2%'),
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('5%'),
        borderRadius: 5,
        marginHorizontal: wp('2%'),
    },
    buttonText: {
        color: '#fff',
        fontSize: wp('6%'),
    },
});
