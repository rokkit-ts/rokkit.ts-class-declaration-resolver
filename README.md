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

If you want to contribute to the project, please don't hesitate to send feedback, create issues or a pull request for
open ones.

## Upcoming features

The next feature extends the ClassDeclarationResolver. It will now tag the file with a specific date and check if the
file is still valid on the next import.

## License

Rokkit.ts-dependency-injection is Open Source software released under the MIT License.
