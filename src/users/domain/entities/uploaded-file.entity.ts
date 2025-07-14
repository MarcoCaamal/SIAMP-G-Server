export interface FileMetadata {
  readonly filename: string;
  readonly originalName: string;
  readonly mimetype: string;
  readonly size: number;
  readonly uploadedAt: Date;
}

export class UploadedFile {
  public readonly metadata: FileMetadata;

  constructor(
    public readonly path: string,
    public readonly url: string,
    metadata: Partial<FileMetadata> & Pick<FileMetadata, 'filename' | 'originalName' | 'mimetype' | 'size'>
  ) {
    this.metadata = {
      ...metadata,
      uploadedAt: metadata.uploadedAt || new Date(),
    };
  }

  public isImage(): boolean {
    return this.metadata.mimetype.startsWith('image/');
  }

  public getExtension(): string {
    return this.metadata.filename.split('.').pop()?.toLowerCase() || '';
  }

  public isValidImageType(): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(this.metadata.mimetype);
  }

  public isWithinSizeLimit(maxSizeInBytes: number): boolean {
    return this.metadata.size <= maxSizeInBytes;
  }
}
