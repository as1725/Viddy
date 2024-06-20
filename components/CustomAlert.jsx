import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

const CustomAlert = ({
	isVisible,
	onClose,
	title,
	message,
	onConfirm,
	confirmText = "Confirm",
	cancelText,
	confirmTextStyles,
	cancelTextStyles,
}) => {
	return (
		<Modal
			isVisible={isVisible}
			onBackButtonPress={onClose}
            useNativeDriver={true}
		>
			<View className="bg-primary p-6 rounded-xl border border-secondary-00">
				{title && (
					<Text className="text-white text-xl font-semibold mb-4">{title}</Text>
				)}
				{message && (
					<Text className="text-white text-base font-medium mb-6">
						{message}
					</Text>
				)}
				<View className="flex-row justify-end">
					{cancelText && (
						<TouchableOpacity onPress={onClose} className="mr-8">
							<Text
								style={cancelTextStyles}
								className="font-psemibold text-white"
							>
								{cancelText}
							</Text>
						</TouchableOpacity>
					)}
					<TouchableOpacity onPress={onConfirm} className="mr-2">
						<Text
							style={confirmTextStyles}
							className="font-psemibold text-secondary"
						>
							{confirmText}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

export default CustomAlert;
