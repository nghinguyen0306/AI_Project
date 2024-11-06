import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import type { GetMetadataResult } from '@capacitor-firebase/storage';

export type AssetState = {
  name?: string;
  label?: string;
  path: string;
  exists: boolean;
  size?: number;
  progress?: number; // Download progress in percentage
  modified?: Date;
  children?: AssetState[];
};

type ProgressCallback = (receivedLength: number, totalLength: number) => void;

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  static BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/sign-translation-a34c3.appspot.com/o/';
  static BUCKET = 'sign-translation-a34c3.appspot.com';

  private getStorage() {
    return import(/* webpackChunkName: "@capacitor-firebase/storage" */ '@capacitor-firebase/storage');
  }

  private getFilesystem() {
    return import(/* webpackChunkName: "@capacitor/filesystem" */ '@capacitor/filesystem');
  }

  stat(path: string): AssetState {
    if (path.endsWith('/')) {
      const files = this.getLocalStorageDirectory(path);
      if (!files) {
        return { path, exists: false, children: [] };
      }
      const filesStat = files.map((f) => this.stat(path + f));
      return {
        path,
        exists: filesStat.every((f) => f.exists),
        size: filesStat.reduce((acc, f) => acc + (f.size || 0), 0),
        children: filesStat,
      };
    }

    const fileStatStr = localStorage.getItem(path);
    if (!fileStatStr) {
      return { path, exists: false };
    }
    const fileStat = JSON.parse(fileStatStr) as GetMetadataResult;

    return {
      path,
      exists: true,
      size: fileStat.size,
      modified: new Date(fileStat.updatedAt),
    };
  }

  async deleteCache(path: string) {
    if (path.endsWith('/')) {
      const files = this.getLocalStorageDirectory(path);
      if (files) {
        await Promise.all(files.map((f) => this.deleteCache(path + f)));
      }
    } else {
      await this.deleteFile(path);
    }

    localStorage.removeItem(path);
  }

  getLocalStorageDirectory(path: string) {
    const filesStr = localStorage.getItem(path);
    if (!filesStr) {
      return null;
    }
    return filesStr.split(',');
  }

  async download(path: string, progressCallback?: ProgressCallback) {
    if (path.endsWith('/')) {
      return this.getDirectory(path, progressCallback);
    }
    return this.getFileUri(path, progressCallback);
  }

  async getDirectory(path: string, progressCallback?: ProgressCallback): Promise<Map<string, string>> {
    if (!path.endsWith('/')) {
      throw new Error('Directory path must end with /');
    }
    let files = this.getLocalStorageDirectory(path);
    if (!files) {
      // Directory is not cached
      files = Array.from(await this.listDirectory(path));
      localStorage.setItem(path, files.join(','));
    }

    // Build a combined progress callback for all files
    let totalLength = 0;
    const received = new Array(files.length).fill(0);
    const progressSet = new Set<number>();
    const fileProgressCallback = (i, fileReceivedLength, fileTotalLength) => {
      if (!progressSet.has(i)) {
        progressSet.add(i);
        totalLength += fileTotalLength;
      }
      received[i] = fileReceivedLength;
      if (progressCallback) {
        const receivedLength = received.reduce((acc, r) => acc + r, 0);
        progressCallback(receivedLength, totalLength);
      }
    };

    const localFiles = await Promise.all(
      files.map((f, i) => {
        return this.getFileUri(path + f, (n, d) => fileProgressCallback(i, n, d));
      })
    );
    const map = new Map<string, string>();
    files.forEach((f, i) => map.set(f, localFiles[i]));
    return map;
  }

  async getFileUri(path: string, progressCallback?: ProgressCallback): Promise<string> {
    const download = async (asBlob = false) => {
      if (asBlob) {
        return this.getRemoteFileAsBlob(path, progressCallback);
      }
      return this.getRemoteFile(path, progressCallback);
    };

    const downloadDone = async () => {
      // Save metadata, so we can check for updates later
      const metadata = await this.statRemoteFile(path);
      localStorage.setItem(path, JSON.stringify(metadata));
    };

    try {
      return await this.navigatorStorageFileUri(path, download, downloadDone);
    } catch (e) {}

    try {
      return await this.capacitorGetFileUri(path, download, downloadDone);
    } catch (e) {}

    return this.buildRemotePath(path);
  }

  async deleteFile(path: string) {
    return Promise.all([
      this.deleteNavigatorStorageFile(path).catch(() => {}),
      this.deleteCapacitorGetFileUri(path).catch(() => {}),
    ]);
  }

  async deleteNavigatorStorageFile(path: string) {
    const [directory, fileName] = await this.navigatorStorageDirectory(path);

    try {
      const fileHandle = await directory.getFileHandle(fileName);
      await fileHandle.remove();
    } catch (e) {}
  }

  async navigatorStorageDirectory(path: string): Promise<[any, string]> {
    let directory = await navigator.storage.getDirectory();
    const route = path.split('/');
    const fileName = route.pop();
    for (const dir of route) {
      directory = await directory.getDirectoryHandle(dir, { create: true });
    }

    return [directory, fileName];
  }

  async navigatorStorageFileUri(path: string, download: CallableFunction, downloadDone: CallableFunction) {
    const [directory, fileName] = await this.navigatorStorageDirectory(path);

    const downloadAndWrite = async () => {
      const fileHandle = await directory.getFileHandle(fileName, { create: true });

      if (!('createWritable' in fileHandle)) {
        await fileHandle.remove();
        throw new Error('Web storage not supported');
      }

      const wtr = await fileHandle.createWritable();
      try {
        const chunks = await download();
        for await (const chunk of chunks) {
          await wtr.write(chunk);
        }
      } finally {
        await wtr.close();
      }

      await downloadDone();
    };

    const getFile = async () => {
      const statStr = localStorage.getItem(path);
      if (!statStr) {
        return null;
      }
      const stat = JSON.parse(statStr);

      let fileHandle;
      try {
        fileHandle = await directory.getFileHandle(fileName);
      } catch (e) {
        return null;
      }

      const file = await fileHandle.getFile();
      if (Number(stat.size) !== file.size) {
        return null;
      }

      return file;
    };

    let file = await getFile();
    while (!file) {
      await downloadAndWrite();
      file = await getFile();
    }

    return URL.createObjectURL(file);
  }

  async deleteCapacitorGetFileUri(path: string) {
    const { Directory, Filesystem } = await this.getFilesystem();
    const fileOptions = { directory: Directory.External, path };
    await Filesystem.deleteFile(fileOptions);
  }

  async capacitorGetFileUri(path: string, download: CallableFunction, downloadDone: CallableFunction) {
    const { Directory, Filesystem } = await this.getFilesystem();

    const fileOptions = { directory: Directory.External, path };
    try {
      const stat = await Filesystem.stat(fileOptions);
      if (stat.size === 0) {
        await Filesystem.deleteFile(fileOptions);
        return this.capacitorGetFileUri(path, download, downloadDone);
      }
    } catch (e) {
      const blob = await download(true);
      const writeBlob = await import(/* webpackChunkName: "@capacitor/blob-writer" */ 'capacitor-blob-writer');
      await writeBlob.default({
        path,
        directory: Directory.External,
        blob,
        fast_mode: true,
        recursive: true,
      });
      await downloadDone();
    }

    if (Capacitor.isNativePlatform()) {
      const { uri } = await Filesystem.getUri(fileOptions);
      return Capacitor.convertFileSrc(uri);
    }

    const { data } = await Filesystem.readFile(fileOptions);
    return URL.createObjectURL(data as any as Blob);
  }

  buildRemotePath(path: string) {
    return AssetsService.BUCKET_URL + encodeURIComponent(path);
  }

  async listDirectory(path: string): Promise<string[]> {
    const response = await fetch(`${AssetsService.BUCKET_URL}${encodeURIComponent(path)}?alt=media`);
    const items = await response.json();
    return items.map((item: { name: string }) => item.name);
  }

  async statRemoteFile(path: string) {
    const response = await fetch(`${AssetsService.BUCKET_URL}${encodeURIComponent(path)}?alt=media`);
    return await response.json();
  }

  async getRemoteFileAsBlob(path: string, progressCallback?: ProgressCallback) {
    let array: Uint8Array = null;
    let arrayIndex = 0;

    const chunks = this.getRemoteFile(path, (loaded, total) => {
      if (!array) {
        array = new Uint8Array(total);
      }
      if (progressCallback) {
        progressCallback(loaded, total);
      }
    });
    for await (const chunk of chunks) {
      array.set(chunk, arrayIndex);
      arrayIndex += chunk.length;
    }

    return new Blob([array]);
  }

  async *getRemoteFile(path: string, progressCallback?: ProgressCallback) {
    const response = await fetch(`${AssetsService.BUCKET_URL}${encodeURIComponent(path)}?alt=media`);
    const reader = response.body.getReader();

    const contentLength = +response.headers.get('Content-Length');

    let receivedLength = 0;
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      receivedLength += value.length;
      if (progressCallback) {
        progressCallback(receivedLength, contentLength);
      }
      yield value;
    }
  }
}