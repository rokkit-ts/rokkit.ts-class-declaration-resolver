import * as fs from "fs-extra";
import * as path from "path";
import { FilePath } from "./filePath";

export class ProjectScanner {
  private readonly entryPointPath: string;

  constructor(entryPointPath: string) {
    this.entryPointPath = path.resolve(entryPointPath);
  }

  private static isDirectory(filePath: string): boolean {
    const stats = fs.lstatSync(filePath);
    return stats.isDirectory();
  }

  public scanProject(): FilePath[] {
    return this.scanDirectory(this.entryPointPath);
  }

  private scanDirectory(directoryPath: string): FilePath[] {
    let filePaths: FilePath[] = [];
    let filesInDir: string[] = fs.readdirSync(directoryPath);
    filesInDir = filesInDir.map(file => directoryPath + "/" + file);
    filesInDir.forEach(filePath => {
      if (ProjectScanner.isDirectory(filePath)) {
        filePaths = filePaths.concat(this.scanDirectory(filePath));
      } else {
        filePaths.push({
          filePath: filePath,
          fileInformation: path.parse(filePath)
        });
      }
    });

    return filePaths;
  }
}
