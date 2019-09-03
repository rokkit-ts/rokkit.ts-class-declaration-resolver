import * as fs from "fs-extra";
import * as path from "path";
import * as ts from "typescript";
import { Node } from "typescript";
import { ProjectScanner } from "../project-scanner";
import {
  ClassDeclaration,
  ClassInformation,
  ConstructorDeclaration,
  ConstructorParameter
} from "./classDeclaration";

export class ClassDeclarationResolver {
  public static createClassDeclarations(
    scanningEntryPointPath: string
  ): ClassDeclaration[] {
    const unfilteredFiles = ProjectScanner.scanProject(scanningEntryPointPath);
    const filteredFiles = ProjectScanner.filterFiles(unfilteredFiles, ".ts");
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

  public static createClassDeclarationFile(
    scanningEntryPointPath: string,
    outDirPath: string,
    fileName: string
  ): void {
    if (!fs.pathExistsSync(outDirPath)) fs.mkdirSync(outDirPath);
    fs.writeFileSync(
      path.resolve(outDirPath + "/" + fileName),
      JSON.stringify(
        this.createClassDeclarations(scanningEntryPointPath),
        undefined,
        2
      )
    );
  }

  public static importClassDeclarationFromFile(
    filePath: string
  ): ClassDeclaration[] {
    const resolvedFilePath = path.resolve(filePath);
    if (fs.existsSync(resolvedFilePath)) {
      const fileData: Buffer = fs.readFileSync(resolvedFilePath);
      return JSON.parse(fileData.toString()) as ClassDeclaration[];
    }
    throw new Error("No class declaration file found.");
  }

  private static isNodeExported(node: ts.Node): boolean {
    return (
      (ts.getCombinedNodeFlags(node) & ts.ModifierFlags.Export) !== 0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }

  private static isSourceFile(source: any): source is ts.SourceFile {
    return source.isDeclarationFile !== undefined;
  }

  private static serializeClassDeclarations(
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

  private static serializeClassInformation(
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

  private static serializeClass(
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

  private static serializeClassConstructor(
    constructorType: ts.Type,
    checker: ts.TypeChecker
  ): ConstructorDeclaration[] {
    return constructorType.getConstructSignatures().map(signature => {
      return {
        parameters: this.serializeClassConstructorParameter(signature, checker)
      };
    });
  }

  private static serializeClassConstructorParameter(
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
}
