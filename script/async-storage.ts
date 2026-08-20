export const asyncStorage = {
  setItem(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          localStorage.setItem(key, value);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  },

  getItem(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const value = localStorage.getItem(key);
          resolve(value);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  },

  removeItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          localStorage.removeItem(key);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  },
};
