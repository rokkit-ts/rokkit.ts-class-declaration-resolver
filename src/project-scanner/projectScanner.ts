import * as fs from "fs-extra";
import * as path from "path";
import { FilePath } from "./filePath";

export class ProjectScanner {
  public static scanProject(entryPointPath: string): FilePath[] {
    return this.scanDirectory(path.resolve(entryPointPath));
  }

  public static filterFiles(
    filePaths: FilePath[],
    fileExtension: string
  ): FilePath[] {
    return filePaths.filter(filePath =>
      filePath.fileInformation.ext.includes(fileExtension)
    );
  }

  private static isDirectory(filePath: string): boolean {
    const stats = fs.lstatSync(filePath);
    return stats.isDirectory();
  }

  private static scanDirectory(directoryPath: string): FilePath[] {
    let filePaths: FilePath[] = [];
    let filesInDir: string[] = fs.readdirSync(directoryPath);
    filesInDir = filesInDir.map(file => directoryPath + "/" + file);
    filesInDir.forEach(filePath => {
      if (ProjectScanner.isDirectory(filePath)) {
        filePaths = filePaths.concat(this.scanDirectory(filePath));
      } else {
        filePaths.push({
          fileInformation: path.parse(filePath),
          filePath
        });
      }
    });

    return filePaths;
  }
}
