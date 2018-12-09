export class TestableService {
  public add(operandA: number, operandB: number): number {
    return operandA + operandB;
  }

  public addAsync(operandA: number, operandB: number, callback: (result: number) => void): void {
    setTimeout(() => {
      callback(operandA + operandB);
    }, 1000);
  }

  public addPromise(operandA: number, operandB: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        const result = operandA + operandB;
        if (result !== 9){
          resolve(operandA + operandB);
        } else {
          reject(new Error('Forced reject when result =9'));
        }
      }, 1000);
    });
  }

}
