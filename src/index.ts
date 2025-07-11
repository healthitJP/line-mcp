import { loginWithPassword } from "@evex/linejs";
import 'dotenv/config';

async function testLineJS() {
  try {
    console.log("LineJSログインを開始します...");
    
    // 環境変数からメールアドレスとパスワードを取得
    const email = process.env.LINE_EMAIL;
    const password = process.env.LINE_PASSWORD;
    
    if (!email || !password) {
      throw new Error("環境変数 LINE_EMAIL と LINE_PASSWORD を設定してください");
    }
    
    const client = await loginWithPassword({
      email: email,
      password: password,
      onPincodeRequest(pincode) {
        console.log('Enter this pincode to your LINE app:', pincode);
      }
    }, { device: "DESKTOPMAC" });
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

testLineJS(); 