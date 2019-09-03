import { assert } from "chai";
import { suite, test } from "mocha-typescript";
import { ProjectScanner } from "./projectScanner";

@suite
export class ProjectScannerSpec1 {
  @test
  public scanSampleProject(): void {
    const projectScanner: ProjectScanner = new ProjectScanner(
      "./sample-project"
    );
    const files = projectScanner.scanProject();

    assert.exists(files);
    assert.isArray(files);
    assert.isNotEmpty(files);
    assert.equal(files.length, 3);
    files.forEach(file => {
      assert.exists(file);
      assert.isNotEmpty(file.filePath);
      assert.isNotEmpty(file.fileInformation);
    });
  }
}
