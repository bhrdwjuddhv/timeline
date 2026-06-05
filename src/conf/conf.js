const conf = {
    appwriteUrl: String(import.meta.env.VITE_REACT_APP_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCalendarCollectionId: String(import.meta.env.VITE_APPWRITE_CALENDAR_COLLECTION_ID),
    appwriteTasksCollectionId: String(import.meta.env.VITE_APPWRITE_TASK_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID)

}

export default conf