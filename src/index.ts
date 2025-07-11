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

    console.log("ログイン成功！");

    console.log("ユーザー情報を取得中...");
    const users = await client.fetchUsers();
    
    console.log("取得したユーザー数:", users.length);
    console.log("ユーザー情報:", JSON.stringify(users, null, 2));

  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

testLineJS(); 