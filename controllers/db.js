import { MongoClient, ObjectId } from 'mongodb';
import parse from './filter.js';
import config from '../config/index.js';
import { nanoid } from 'nanoid';

// Configurations
const { databases } = config.storage;
const client = new MongoClient(databases.mongo.writer);
  
let db;
/**
 * @description Connects to the database
 */
const connect = async () => {
    try {
        await client.connect();
        db = client.db(databases.mongo.database);
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Failed to start the application:', error);
        throw error;
    }
};
connect();

  
/**
 * @description gets document from a collection applying filters
 */
const get = async (collection, filterString) => {
    try {
        const lower = collection.toLowerCase();
        const filters = await parse(filterString);
        const result = await db.collection(lower).findOne(filters);
        return result;
    } catch (exception) {
        console.error("Exception:", exception);
        throw exception;
    }
};

/**
 * @description Gets documents from a collection applying filters
 */
const getMany = async (collection, filterString) => {
    try {
        const lower = collection.toLowerCase();
        const filters = await parse(filterString);
        const result = await db.collection(lower).find(filters).toArray();
        return result;
    } catch (exception) {
        console.error("Exception:", exception);
        throw exception;
    }
};

/**
 * @description Inserts one or more documents into a collection
 */
const insert = async (collection, data) => {
    try {
        const lower = collection.toLowerCase();
        const result = await db.collection(lower).insertMany(data);
        return result;
    } catch (exception) {
        console.error("Exception:", exception);
        throw exception;
    }
};

/**
 * @description Updates one document in a collection
 */
const update = async (collection, filterString, data) => {
    try {
        const lower = collection.toLowerCase();
        const filters = await parse(filterString);
        const result = await db.collection(lower).updateOne(filters, { $set: data });
        return result;
    } catch (exception) {
        console.error("Exception:", exception);
        throw exception;
    }
};

/**
 * @description Retrieves documents from a collection with pagination
 */
let getFilterData = (collection, PAGE_SIZE, startIndex) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            const totalRecords = await db.collection(lower).countDocuments({});
            const records = await db.collection(lower)
            .find({})
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(PAGE_SIZE)
            .toArray();
            return resolve({ records, totalRecords })
        }
        catch (exception) {
            console.error("exception", exception)
            return reject(exception)
        }
    })
}

/**
 * @description Deletes documents from a collection
 */
const deleteMany = async (collection, filters) => {
    try {
        const lower = collection.toLowerCase();
        const result = await db.collection(lower).deleteMany(filters);
        return result;
    } catch (exception) {
        console.error("Exception:", exception);
        throw exception;
    }
};

/**
 * @description Deletes a document from a collection provided the ID is known
 */
const deleteDoc = async (collection, id) => {
    try {
        const lower = collection.toLowerCase();
        const objectId = new ObjectId(id.toString());
        const result = await db.collection(lower).deleteOne({ _id: objectId });
        console.log(result);
        return result;
    } catch (exception) {
        console.error("Exception:", exception);
        throw exception;
    }
};

/**
 * @description - db function for get the objectId 
 */ 
const getDocById = (collection, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            const result = await db.collection(lower).findOne({ _id: new ObjectId(id) })
            console.log(result)
            return resolve(result)
        }
        catch (exception) {
            console.error("exception", exception)
            return reject(exception)
        }
    })
}

/**
 * @description Counts documents in a collection matching a user ID
 */
const countDocs = async (collection, id) => {
    try {
        const lower = collection.toLowerCase();
        const count = await db.collection(lower).countDocuments({ userId: id });
        console.log(count);
        return count;
    } catch (exception) {
        console.error("Exception:", exception);
        throw exception;
    }
};

/**
 * @description Gets the latest document from a collection applying filters
 */
const getDocLatestRecords = async (collection, filterString) => {
    try {
        const lower = collection.toLowerCase();
        const filters = await parse(filterString);
        const result = await db.collection(lower).findOne(filters, { sort: { createdAt: -1 } });
        return result;
    } catch (exception) {
        console.error("Exception:", exception);
        throw exception;
    }
};

/**
 * @description - create unique userId for users
 */ 
const createNanoUserId = async () => {
    const nanoIdString = nanoid(12);
    const nanoIdInteger = nanoIdString
        .split('')
        .map(char => char.charCodeAt(0))
        .join('')
        .slice(0, 12);

    return parseInt(nanoIdInteger, 10);
};

/**
 * @description - create unique userId for rook users alternate function
 */ 
const createUserUniqueId = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const counterDoc = await db.collection('usercounters').findOneAndUpdate(
                { _id: 'countUsers' },
                { $inc: { sequence: 1 } },
                { upsert: true, returnDocument: 'after' }
            );
            const userCounter = counterDoc.value.sequence;
            const timestamp = Date.now();
            const paddedCounter = userCounter.toString().padStart(4, '0');
            const bigNumber = `${timestamp}${paddedCounter}`;
            const fixedLengthUserId = bigNumber.slice(-9);
            resolve(parseInt(fixedLengthUserId, 10));
        } catch (error) {
            console.error("Error in userIdCreate:", error);
            reject(error);
        }
    });
};

/**
 * @description - db function for pagination
 */ 
const getRecords = async (collection, filters, pageNumber, pageSize) => {
    return new Promise(async (resolve, reject) => {
        try {
            const lower = collection.toLowerCase();
            const totalRecords = await db.collection(lower).countDocuments(filters);
            const skip = (pageNumber - 1) * pageSize;
            const records = await db.collection(lower)
                .find(filters)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            resolve({ totalRecords, records });
        } catch (exception) {
            console.error("Exception:", exception);
            reject(exception);
        }
    });
};


/**
 * @description - db function for aggregate all fillter in differnt collection
 */ 
const aggregateFilter = (collection, filters) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lower = collection.toLowerCase();
            const result = await db.collection(lower).aggregate(filters).toArray();
            return resolve(result);
        }
        catch (exception) {
            return reject(exception);
        }
    })
}

export {
    get,
    getMany,
    getDocById,
    insert,
    update,
    deleteMany,
    getFilterData,
    deleteDoc,
    countDocs,
    getDocLatestRecords,
    createUserUniqueId,
    createNanoUserId,
    getRecords,
    aggregateFilter
};
