export class Base {
  protected bitmap = {
    width: undefined as any,
    height: undefined as any,
    buffer: undefined as any
  }
  protected path;
  constructor(path: string) {
    this.path = path;
  }
}