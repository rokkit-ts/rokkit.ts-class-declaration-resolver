import { assert } from "chai";
import { suite, test } from "mocha-typescript";
import { FilePath } from "./filePath";
import { ProjectScanner } from "./projectScanner";

@suite
export class ProjectScannerSpec1 {
  @test
  public scanSampleProject(): FilePath[] {
    const files = ProjectScanner.scanProject("./sample-project");

    assert.exists(files);
    assert.isArray(files);
    assert.isNotEmpty(files);
    assert.equal(files.length, 4);
    files.forEach(file => {
      assert.exists(file);
      assert.isNotEmpty(file.filePath);
      assert.isNotEmpty(file.fileInformation);
    });

    return files;
  }

  @test
  public filterFiles(): void {
    const filteredFiles = ProjectScanner.filterFiles(
      this.scanSampleProject(),
      ".ts"
    );
    assert.exists(filteredFiles);
    assert.isArray(filteredFiles);
    assert.isNotEmpty(filteredFiles);
    assert.equal(filteredFiles.length, 3);
  }
}
