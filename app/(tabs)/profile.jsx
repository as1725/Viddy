import React, { useState } from "react";
import { router } from "expo-router";
import { Image, View, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut } from "../../lib/appwrite";
import { EmptyState, InfoBox, SearchInput, VideoCard } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import CustomAlert from "../../components/CustomAlert";

const Profile = () => {
	const { user, setUser, setIsLoggedIn } = useGlobalContext();
	const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
	const [isModalVisible, setModalVisible] = useState(false);

	const handleLogout = async () => {
		await signOut();
		setUser(null);
		setIsLoggedIn(false);

		router.replace("sign-in");
	};

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	return (
		<SafeAreaProvider>
			<SafeAreaView className="bg-primary h-full">
				<FlatList
					data={posts}
					keyExtractor={(item) => item.$id}
					renderItem={({ item }) => (
						<VideoCard
							title={item.title}
							thumbnail={item.thumbnail}
							video={item.video}
							creator={item.creator.username}
							avatar={item.creator.avatar}
						/>
					)}
					ListHeaderComponent={() => (
						<View className="w-full justify-center items-center mt-6 mb-12 px-4">
							<TouchableOpacity
								className="flex flex-row items-end justify-end w-full"
								onPress={toggleModal}
							>
								<Image
									source={icons.logout}
									resizeMode="contain"
									className="w-6 h-6"
								/>
							</TouchableOpacity>

							<View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
								<Image
									source={{ uri: user?.avatar }}
									resizeMode="cover"
									className="w-[90%] h-[90%] rounded-lg"
								/>
							</View>

							<InfoBox
								title={user?.username}
								subtitle={user?.email}
								containerStyles="mt-5"
								titleStyles="text-xl mb-2"
							></InfoBox>

							<View className="mt-5 flex-row">
								<InfoBox
									title={posts?.length}
									subtitle="Posts"
									containerStyles="mr-10"
									titleStyles="text-xl"
								></InfoBox>
								<InfoBox
									title="1.2k"
									subtitle="Followers"
									titleStyles="text-xl"
								></InfoBox>
							</View>
						</View>
					)}
					// ListEmptyComponent={() => (
					// 	<EmptyState
					// 		title="No Videos Found"
					// 		subtitle="No videos found for this search query"
					// 	/>
					// )}
				/>

				<CustomAlert
					isVisible={isModalVisible}
					onClose={toggleModal}
					title="Confirm Logout"
					message="Are you sure you want to logout?"
					onConfirm={handleLogout}
					confirmText="Logout"
					cancelText="Cancel"
					confirmTextStyles="text-secondary"
					cancelTextStyles="text-white"
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default Profile;
