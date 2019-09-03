import * as fs from "fs-extra";
import * as path from "path";
import * as ts from "typescript";
import { Node } from "typescript";
import { ProjectScanner } from "../project-scanner";
import { FilePath } from "../project-scanner/filePath";
import {
  ClassDeclaration,
  ClassInformation,
  ConstructorDeclaration,
  ConstructorParameter
} from "./classDeclaration";

export class ClassDeclarationResolver {
  private projectScanner: ProjectScanner;

  constructor(entryPointPath: string) {
    this.projectScanner = new ProjectScanner(entryPointPath);
  }

  public createClassDeclarations(): ClassDeclaration[] {
    const unfilteredFiles = this.projectScanner.scanProject();
    const filteredFiles = this.filterFiles(unfilteredFiles, ".ts");
    const filePaths = filteredFiles.map(file => file.filePath);
    const program = ts.createProgram(filePaths, {
      incremental: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES5
    });
    let output: ClassDeclaration[] = [];
    const checker = program.getTypeChecker();
    for (const sourceFile of program.getSourceFiles()) {
      output = output.concat(
        this.serializeClassDeclarations(sourceFile, checker)
      );
    }
    return output;
  }

  public importClassDeclarationFromFile(filePath: string): ClassDeclaration[] {
    const fileData: Buffer = fs.readFileSync(path.resolve(filePath));
    return JSON.parse(fileData.toString()) as ClassDeclaration[];
  }

  public createClassDeclarationFile(
    outDirPath: string,
    fileName: string
  ): void {
    if (!fs.pathExistsSync(outDirPath)) fs.mkdirSync(outDirPath);
    fs.writeFileSync(
      path.resolve(outDirPath + "/" + fileName),
      JSON.stringify(this.createClassDeclarations(), undefined, 2)
    );
  }

  private isNodeExported(node: ts.Node): boolean {
    return (
      (ts.getCombinedNodeFlags(node) & ts.ModifierFlags.Export) !== 0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }

  private isSourceFile(source: any): source is ts.SourceFile {
    return source.isDeclarationFile !== undefined;
  }

  private serializeClassDeclarations(
    source: ts.SourceFile | Node,
    checker: ts.TypeChecker
  ): ClassDeclaration[] {
    const output: ClassDeclaration[] = [];
    if (this.isSourceFile(source)) {
      if (!source.isDeclarationFile) {
        ts.forEachChild(source, node => {
          const classInformation = this.serializeClassInformation(
            node,
            checker
          );
          if (classInformation) {
            output.push({
              classInformation,
              filePath: node.getSourceFile().fileName
            });
          }
        });
      }
    } else {
      ts.forEachChild(source, subNode => {
        const classInformation = this.serializeClassInformation(
          subNode,
          checker
        );
        if (classInformation) {
          output.push({
            classInformation,
            filePath: subNode.getSourceFile().fileName
          });
        }
      });
    }
    return output;
  }

  private serializeClassInformation(
    node: Node,
    checker: ts.TypeChecker
  ): ClassInformation | undefined {
    if (this.isNodeExported(node)) {
      if (ts.isClassDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (symbol) {
          return this.serializeClass(symbol, checker);
        }
      } else if (ts.isModuleDeclaration(node)) {
        this.serializeClassDeclarations(node, checker);
      }
    }
    return;
  }

  private serializeClass(
    symbol: ts.Symbol,
    checker: ts.TypeChecker
  ): ClassInformation {
    const constructorType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration!
    );

    return {
      className: symbol.getName(),
      constructors: this.serializeClassConstructor(constructorType, checker)
    };
  }

  private serializeClassConstructor(
    constructorType: ts.Type,
    checker: ts.TypeChecker
  ): ConstructorDeclaration[] {
    return constructorType.getConstructSignatures().map(signature => {
      return {
        parameters: this.serializeClassConstructorParameter(signature, checker)
      };
    });
  }

  private serializeClassConstructorParameter(
    signature: ts.Signature,
    checker: ts.TypeChecker
  ): ConstructorParameter[] {
    return signature.getParameters().map(parameter => {
      return {
        name: parameter.getName(),
        type: checker.typeToString(
          checker.getTypeOfSymbolAtLocation(
            parameter,
            parameter.valueDeclaration!
          )
        )
      };
    });
  }

  private filterFiles(
    filePaths: FilePath[],
    fileExtension: string
  ): FilePath[] {
    return filePaths.filter(filePath =>
      filePath.fileInformation.ext.includes(fileExtension)
    );
  }
}
