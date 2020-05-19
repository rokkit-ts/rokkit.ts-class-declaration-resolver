# rokkit.ts-class-declaration-resolver

[![Build Status](https://travis-ci.com/rokkit-ts/rokkit.ts-class-declaration-resolver.svg?branch=master)](https://travis-ci.com/rokkit-ts/rokkit.ts-class-declaration-resolver)

Rokkit.ts Class declaration resolver is used to create class information that are not present on runtime. It is mainly used by the rokkit.ts-dependency-injection package.

## Install and Build

To install the package:

```bash
npm install @rokkit.ts/class-declaration-resolver
```

## Usage

The package is designed to retrieve class information about a user project/folder. The information contain data about
the file, the classes and the constructor parameters of this class.
The following example shows how to scan a project export and re-import the class information.

```typescript
import { ClassDeclarationResolver } from "@rokkit.ts/class-declaration-resolver";

ClassDeclarationResolver.createClassDeclarationFile(
  "./sample-project",
  "./config",
  "declarations.json"
);

const declarations = ClassDeclarationResolver.importClassDeclarationFromFile(
  "./config/declarations.json"
);
```

### API Description

|  Class:  | ClassDeclarationResolver                                                                                      |
| :------: | :------------------------------------------------------------------------------------------------------------ |
| Methods: | <code>createClassDeclarations(scanningEntryPointPath: string)</code>                                          |
|          | <code>createClassDeclarationFile(scanningEntryPointPath: string, outDirPath: string, fileName: string)</code> |
|          | <code>importClassDeclarationFromFile(filePath: string)</code>                                                 |

## Contribution

All kinds of contributions are welcome, no matter how big or small.
Before you start to contribute please read our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

Rokkit.ts-dependency-injection is Open Source software released under the MIT License.
