export class RandomHelper {
  public static randomString(length: number, charSet?: string) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomPoz = Math.floor(Math.random() * charSet.length);

      result += charSet.substring(randomPoz, randomPoz + 1);
    }

    return result;
  }

  public static getCurrentTimeStamp() {
    return Date.now();
  }
}
