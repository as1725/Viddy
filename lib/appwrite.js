import {
	Account,
	Avatars,
	Client,
	Databases,
	ID,
	Query,
	Storage,
} from "react-native-appwrite";

export const config = {
	endpoint: "https://cloud.appwrite.io/v1",
	platform: "com.secureteams.ustaad",
	projectId: "666d964f000c48915581",
	databaseId: "666d97bb0019bccdd7d0",
	userCollectionId: "666d97e50002d2ad8a66",
	videoCollectionId: "666d980a00194548b450",
	storageId: "666d9920001454c73006",
};

// Init your React Native SDK
const client = new Client();
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

client
	.setEndpoint(config.endpoint) // Your API Endpoint
	.setProject(config.projectId) // Your project ID
	.setPlatform(config.platform); // Your platform name

export const createUser = async (email, password, username) => {
	console.log("Creating user...");
	try {
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		);

		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(username);

		await signIn(email, password);

		const newUser = await databases.createDocument(
			config.databaseId,
			config.userCollectionId,
			ID.unique(),
			{
				accountId: newAccount.$id,
				email,
				username,
				avatar: avatarUrl,
			}
		);

		console.log("User created successfully");
		return newUser;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
};

export const signIn = async (email, password) => {
	console.log("Signing in...");
	try {
		const session = await account.createEmailPasswordSession(email, password);
		console.log("Session created successfully");
		return session;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
};

export const getCurrentUser = async () => {
	// console.log("Getting current user...");
	try {
		const user = await account.get();
		if (!user) throw Error;

		const userDoc = await databases.listDocuments(
			config.databaseId,
			config.userCollectionId,
			[Query.equal("accountId", user.$id)]
		);

		if (!userDoc) throw Error;

		// console.log("User fetched successfully");
		return userDoc.documents[0];
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
};

// Get latest created video posts
export const getLatestPosts = async () => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videoCollectionId,
			[Query.orderDesc("$createdAt"), Query.limit(7)]
		);

		// console.log(posts.documents.length);
		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
};

// Get all video Posts
export const getAllPosts = async () => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videoCollectionId,
			[Query.orderDesc("$createdAt")]
		);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
};

// Get video posts that matches search query
export async function searchPosts(query) {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videoCollectionId,
			[Query.search("title", query)]
		);

		if (!posts) throw new Error("Something went wrong");

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}

export async function getUserPosts(userId) {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videoCollectionId,
			[Query.equal("creator", userId), Query.orderDesc("$createdAt")]
		);

		if (!posts) throw new Error("Something went wrong");

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}

export const signOut = async () => {
	try {
		const session = await account.deleteSession("current");

		return session;
	} catch (error) {
		throw new Error(error);
	}
};

// Create Video Post
export async function createVideoPost(form) {
	try {
		const [thumbnailUrl, videoUrl] = await Promise.all([
			uploadFile(form.thumbnail, "image"),
			uploadFile(form.video, "video"),
		]);

		const newPost = await databases.createDocument(
			config.databaseId,
			config.videoCollectionId,
			ID.unique(),
			{
				title: form.title,
				thumbnail: thumbnailUrl,
				video: videoUrl,
				// prompt: form.prompt,
				creator: form.userId,
			}
		);

		return newPost;
	} catch (error) {
		throw new Error(error);
	}
}

// Upload File
export async function uploadFile(file, type) {
	if (!file) return;

	const asset = {
		name: file.fileName,
		type: file.mimeType,
		size: file.fileSize,
		uri: file.uri,
	};

	try {
		const uploadedFile = await storage.createFile(
			config.storageId,
			ID.unique(),
			asset
		);

		const fileUrl = await getFilePreview(uploadedFile.$id, type);
		return fileUrl;
	} catch (error) {
		throw new Error(error);
	}
}

// Get File Preview
export async function getFilePreview(fileId, type) {
	let fileUrl;

	try {
		if (type === "video") {
			fileUrl = storage.getFileView(config.storageId, fileId);
		} else if (type === "image") {
			fileUrl = storage.getFilePreview(
				config.storageId,
				fileId,
				2000,
				2000,
				"top",
				100
			);
		} else {
			throw new Error("Invalid file type");
		}

		if (!fileUrl) throw Error;

		return fileUrl;
	} catch (error) {
		throw new Error(error);
	}
}
