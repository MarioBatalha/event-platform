import { ComponentCompilerMeta } from '../stencil-public-runtime';
export declare const ignoreChecks: () => string;
export declare const fileName: (c: ComponentCompilerMeta) => string;
export declare const buildImports: (components: ComponentCompilerMeta[], ext?: string, isDefaultExport?: boolean) => string;
export declare const buildExports: (components: ComponentCompilerMeta[]) => string;
export declare const sortComponents: (cmps: ComponentCompilerMeta[]) => ComponentCompilerMeta[];
export declare const jsxEventName: (eventName: string) => string;
export declare const safeDefaultValue: (value?: string | undefined) => boolean;
export declare const findAllDependencies: (cmpMeta: ComponentCompilerMeta, components: ComponentCompilerMeta[]) => {
  tagName: string;
  className: string;
}[];
export declare const importAllDepdencies: (cmpMeta: ComponentCompilerMeta, components: ComponentCompilerMeta[]) => string;
export declare const defineAllDependencies: (cmpMeta: ComponentCompilerMeta, components: ComponentCompilerMeta[]) => string;
