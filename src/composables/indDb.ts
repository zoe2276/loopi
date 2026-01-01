// export enum Stores {
//     Patterns = "Patterns"
// }
let db: IDBDatabase
let version = 1

export const initDb = (): Promise<boolean> => {
    return new Promise((res) => {
        const initreq = indexedDB.open("PatternDB")
        initreq.onupgradeneeded = () => {
            db = initreq.result
            if (!db.objectStoreNames.contains("Patterns")) {
                console.log("creating pattern store")
                db.createObjectStore("Patterns", { keyPath: "name" })
            }

            initreq.onsuccess = () => {
                db = initreq.result
                version = db.version
                console.log("request.onsuccess - initDb", version)
                res(true)
            }

            initreq.onerror = () => res(false)
        }
    })
}

export const addData = <T>(storeName: string, data: T): Promise<T|string|null> => {
    return new Promise(res => {
        const adreq = indexedDB.open("PatternDB", version)

        adreq.onsuccess = () => {
            db = adreq.result
            const tx = db.transaction(storeName, "readwrite")
            const store = tx.objectStore(storeName)

            store.add(data)
            res(data)
        }

        adreq.onerror = () => {
            const err = adreq.error?.message
            if (err) {
                res(err)
            } else {
                res("Unknown error")
            }
        }
    })
}

export const getData = <T>(storeName: string): Promise<T[]> => {
    return new Promise(res => {
        const getreq = indexedDB.open("PatternDB")

        getreq.onsuccess = () => {
            console.log("getData done")
            db = getreq.result
            const tx = db.transaction(storeName, "readonly")
            const store = tx.objectStore(storeName)
            const result = store.getAll()
            result.onsuccess = () => {
                res(result.result)
            }
        }
    })
}