import { CompletionItem, CompletionItemKind } from 'vscode';
import { FileInfo } from './FileInfo';
import { workspace } from 'vscode';

const withExtension = workspace.getConfiguration('path-intellisense')['extensionOnImport'];

export class PathCompletionItem extends CompletionItem {
    constructor(fileInfo: FileInfo, isImport: boolean) {
        super(fileInfo.file);
        
        this.kind = CompletionItemKind.File;
        
        this.addGroupByFolderFile(fileInfo);
        this.removeExtensionIfImport(fileInfo, isImport);
        this.addSlashForFolder(fileInfo);
    }
    
    addGroupByFolderFile(fileInfo: FileInfo) {
        this.sortText = `${fileInfo.isFile ? 'b' : 'a'}_${fileInfo.file}`;
    }
    
    addSlashForFolder(fileInfo: FileInfo) {
        if (!fileInfo.isFile) {
            this.label = `${fileInfo.file}/`;
        }
    }
    
    removeExtensionIfImport(fileInfo: FileInfo, isImport: boolean) {
        if (!fileInfo.isFile || withExtension || !isImport) {
            return;
        }
        
        let index = fileInfo.file.lastIndexOf('.');
        this.insertText = index != -1 ? fileInfo.file.substring(0, index) : fileInfo.file;
    }
}