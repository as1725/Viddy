import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomAlert from "../../components/CustomAlert";

const SignUp = () => {
	const { setUser, setIsLoggedIn } = useGlobalContext();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
	});

	const [alertVisible, setAlertVisible] = useState(false);
	const [alertConfig, setAlertConfig] = useState({
		title: "",
		message: "",
		onConfirm: () => {},
		confirmText: "OK",
		cancelText: null,
	});

	const showAlert = (
		title,
		message,
		onConfirm = () => {},
		confirmText = "OK",
		cancelText = null
	) => {
		setAlertConfig({
			title,
			message,
			onConfirm,
			confirmText,
			cancelText,
		});
		setAlertVisible(true);
	};

	const submit = async () => {
		if (form.email === "" || form.password === "" || form.username === "") {
			// Alert.alert("Error", "Please fill in all fields");
			showAlert("Error", "Please fill in all fields");
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await createUser(form.email, form.password, form.username);
			// Alert.alert("Success", "User created successfully");
			showAlert("Success", "User created successfully");
			setUser(result);
			setIsLoggedIn(true);
			router.replace("/home");
		} catch (error) {
			// Alert.alert("Error", error.message);
			showAlert("Error", error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView>
				<View
					className="w-full flex justify-center h-full px-6 my-6"
					style={{
						minHeight: Dimensions.get("window").height - 100,
					}}
				>
					<Image
						source={images.logo}
						resizeMode="contain"
						className="w-[115px] h-[34px]"
					/>

					<Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
						Create an account
					</Text>
					<FormField
						title="Username"
						value={form.username}
						handleChangeText={(e) => setForm({ ...form, username: e })}
						otherStyles="mt-10"
					/>
					<FormField
						title="Email"
						value={form.email}
						handleChangeText={(e) => setForm({ ...form, email: e })}
						otherStyles="mt-7"
						keyboardType="email-address"
					/>

					<FormField
						title="Password"
						value={form.password}
						handleChangeText={(e) => setForm({ ...form, password: e })}
						otherStyles="mt-7"
					/>

					<CustomButton
						title="Sign Up"
						handlePress={submit}
						containerStyles="mt-7"
						isLoading={isSubmitting}
					/>

					<View className="flex justify-center pt-5 flex-row gap-2">
						<Text className="text-lg text-gray-100 font-pregular">
							Already a member?
						</Text>
						<Link
							href="/sign-in"
							className="text-lg font-psemibold text-secondary"
						>
							Sign In
						</Link>
					</View>
				</View>
			</ScrollView>

			<CustomAlert
				isVisible={alertVisible}
				onClose={() => setAlertVisible(false)}
				title={alertConfig.title}
				message={alertConfig.message}
				onConfirm={() => {
					alertConfig.onConfirm();
					setAlertVisible(false);
				}}
				confirmText={alertConfig.confirmText}
				cancelText={alertConfig.cancelText}
				// confirmTextStyles={{
				// 	color: "white",
				// 	backgroundColor: "green",
				// 	padding: 10,
				// 	borderRadius: 5,
				// }}
				// cancelTextStyles={{
				// 	color: "blue",
				// }}
			/>
			
		</SafeAreaView>
	);
};

export default SignUp;
