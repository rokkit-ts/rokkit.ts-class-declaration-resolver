export interface ClassDeclaration {
  filePath: string;
  classInformation: ClassInformation;
}

export interface ClassInformation {
  className: string;
  constructors: ConstructorDeclaration[];
}

export interface ConstructorDeclaration {
  parameters: ConstructorParameter[];
}

export interface ConstructorParameter {
  name: string;
  type: string;
}
