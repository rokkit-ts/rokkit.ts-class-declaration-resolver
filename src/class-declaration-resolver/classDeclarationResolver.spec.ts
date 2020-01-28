import { assert, expect } from "chai";
import { suite, test } from "mocha-typescript";
import { ClassDeclarationResolver } from "./classDeclarationResolver";

@suite
export class ClassDeclarationResolverSpec {
  @test
  public createClassDeclaration(): void {
    const classDeclarations = ClassDeclarationResolver.createClassDeclarations(
      "./sample-project"
    );
    assert.exists(classDeclarations);
    assert.isArray(classDeclarations);
    assert.isNotEmpty(classDeclarations);
    assert.equal(classDeclarations.length, 3);
    assert.exists(classDeclarations[0]);
    assert.exists(classDeclarations[0].classInformation);
    assert.exists(classDeclarations[0].classInformation.className);
    assert.exists(classDeclarations[0].classInformation.constructors);
    assert.isArray(classDeclarations[0].classInformation.constructors);

    const classNames = classDeclarations.map(
      classDeclaration => classDeclaration.classInformation.className
    );
    expect(classNames).to.include("App");
    expect(classNames).to.include("App2");
    expect(classNames).to.include("App3");
  }

  @test
  public createDeclarationFile(): void {
    ClassDeclarationResolver.createClassDeclarationFile(
      ".",
      "sample-project",
      "./dist",
      "declarations.json",
      "test"
    );

    const classDeclarations = ClassDeclarationResolver.importClassDeclarationFromFile(
      "./dist/declarations.json"
    );

    assert.exists(classDeclarations);
    assert.isArray(classDeclarations);
    assert.isNotEmpty(classDeclarations);
    assert.equal(classDeclarations.length, 3);
    assert.exists(classDeclarations[0]);
    assert.exists(classDeclarations[0].classInformation);
    assert.exists(classDeclarations[0].sourceFilePath);
    assert.exists(classDeclarations[0].compiledFilePath);
    assert.exists(classDeclarations[0].classInformation.className);
    assert.exists(classDeclarations[0].classInformation.constructors);
    assert.isArray(classDeclarations[0].classInformation.constructors);

    const classNames = classDeclarations.map(
      classDeclaration => classDeclaration.classInformation.className
    );
    expect(classNames).to.include("App");
    expect(classNames).to.include("App2");
    expect(classNames).to.include("App3");
  }

  @test
  public importNotExistingDeclarationFile(): void {
    expect(() =>
      ClassDeclarationResolver.importClassDeclarationFromFile(
        "./sample-project/declaration.yml"
      )
    ).to.throw("No class declaration file found.");
  }
}
