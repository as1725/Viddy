import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomAlert from "../../components/CustomAlert";

const SignIn = () => {
	const { setUser, setIsLoggedIn } = useGlobalContext();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setForm] = useState({
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
		if (form.email === "" || form.password === "") {
			// Alert.alert("Error", "Please fill in all fields");
			showAlert("Error", "Please fill in all fields");
			return;
		}

		setIsSubmitting(true);

		try {
			await signIn(form.email, form.password);
			const user = await getCurrentUser();
			setUser(user);
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
						Log in to Aora
					</Text>

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
						title="Sign In"
						handlePress={submit}
						containerStyles="mt-7"
						isLoading={isSubmitting}
					/>

					<View className="flex justify-center pt-5 flex-row gap-2">
						<Text className="text-lg text-gray-100 font-pregular">
							Don't have an account?
						</Text>
						<Link
							href="/sign-up"
							className="text-lg font-psemibold text-secondary"
						>
							Signup
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

export default SignIn;
