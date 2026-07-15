import conf from "@/conf/conf.js";

import {
    Client,
    ID,
    Databases,
    Storage,
    Query,
    Permission,
    Role,
} from "appwrite";

export class Service {

    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    /*
    ==================================================
    PAGINATION HELPER
    Appwrite defaults to 25 docs per query.
    This fetches all pages automatically.
    ==================================================
    */

    async listAllDocuments(databaseId, collectionId, baseQueries = []) {
        const all = [];
        const pageSize = 100;
        let offset = 0;

        while (true) {
            const response = await this.databases.listDocuments(
                databaseId,
                collectionId,
                [
                    ...baseQueries,
                    Query.limit(pageSize),
                    Query.offset(offset),
                ]
            );

            all.push(...response.documents);

            if (all.length >= response.total) break;
            offset += pageSize;
        }

        return { documents: all, total: all.length };
    }

    /*
    ==================================================
    CALENDARS
    ==================================================
    */

    async createCalendar(calendarData) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCalendarCollectionId,
                ID.unique(),
                calendarData,
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users()),
                ]
            );
        } catch (error) {
            console.error("Appwrite :: createCalendar :: error", error);
            throw error;
        }
    }

    async getCalendars(userId) {
        try {
            return await this.listAllDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCalendarCollectionId,
                [Query.equal("userId", userId)]
            );
        } catch (error) {
            console.error("Appwrite :: getCalendars :: error", error);
            throw error;
        }
    }

    async getSharedCalendar(calendarId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCalendarCollectionId,
                [Query.equal("localId", calendarId)]
            );
            return response.documents[0];
        } catch (error) {
            console.error("Appwrite :: getSharedCalendar :: error", error);
            throw error;
        }
    }

    async getCalendar(calendarId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCalendarCollectionId,
                calendarId
            );
        } catch (error) {
            console.error("Appwrite :: getCalendar :: error", error);
            throw error;
        }
    }

    async updateCalendar(calendarId, data, permissions) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCalendarCollectionId,
                calendarId,
                data,
                permissions
            );
        } catch (error) {
            console.error("Appwrite :: updateCalendar :: error", error);
            throw error;
        }
    }

    async deleteCalendar(calendarId) {
        try {
            await this.deleteCalendarTasks(calendarId);
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCalendarCollectionId,
                calendarId
            );
        } catch (error) {
            console.error("Appwrite :: deleteCalendar :: error", error);
            throw error;
        }
    }

    /*
    ==================================================
    TASKS
    ==================================================
    */

    async createTask(taskData) {
        try {
            /*
            Task permissions:
              - read:   any (public-read supports shared calendar viewing)
              - update: owner only
              - delete: owner only
            */
            const permissions = taskData.userId
                ? [
                      Permission.read(Role.any()),
                      Permission.update(Role.user(taskData.userId)),
                      Permission.delete(Role.user(taskData.userId)),
                  ]
                : [Permission.read(Role.any())];

            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTasksCollectionId,
                ID.unique(),
                taskData,
                permissions
            );
        } catch (error) {
            console.error("Appwrite :: createTask :: error", error);
            throw error;
        }
    }

    async getTasks(calendarId) {
        try {
            return await this.listAllDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteTasksCollectionId,
                [Query.equal("calendarId", calendarId)]
            );
        } catch (error) {
            console.error("Appwrite :: getTasks :: error", error);
            throw error;
        }
    }

    async getSharedTasks(calendarId) {
        try {
            return await this.listAllDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteTasksCollectionId,
                [Query.equal("calendarId", calendarId)]
            );
        } catch (error) {
            console.error("Appwrite :: getSharedTasks :: error", error);
            throw error;
        }
    }

    async getTasksByUser(userId) {
        try {
            return await this.listAllDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteTasksCollectionId,
                [Query.equal("userId", userId)]
            );
        } catch (error) {
            console.error("Appwrite :: getTasksByUser :: error", error);
            throw error;
        }
    }

    async updateTask(taskId, data) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTasksCollectionId,
                taskId,
                data
            );
        } catch (error) {
            console.error("Appwrite :: updateTask :: error", error);
            throw error;
        }
    }

    async deleteTask(taskId) {
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTasksCollectionId,
                taskId
            );
        } catch (error) {
            console.error("Appwrite :: deleteTask :: error", error);
            throw error;
        }
    }

    async deleteCalendarTasks(calendarId) {
        try {
            const response = await this.getTasks(calendarId);
            await Promise.all(
                response.documents.map((task) =>
                    this.deleteTask(task.$id)
                )
            );
        } catch (error) {
            console.error("Appwrite :: deleteCalendarTasks :: error", error);
            throw error;
        }
    }

    async bulkUpdateTasks(tasks) {
        try {
            await Promise.all(
                tasks.map((task) =>
                    this.updateTask(task.$id, {
                        startDate: task.startDate,
                        endDate: task.endDate,
                        position: task.position,
                        column: task.column,
                    })
                )
            );
        } catch (error) {
            console.error("Appwrite :: bulkUpdateTasks :: error", error);
            throw error;
        }
    }
}

const service = new Service();
export default service;
